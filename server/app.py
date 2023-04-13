import datetime
import easypost
import os
import json
import pandas as pd
from dotenv import load_dotenv
from easypost import Address, Parcel, Shipment
from functools import wraps
from flask import Flask, request, g, jsonify, make_response, abort, send_file
from flask_cors import CORS
from random import randint

from database import Product, Order, Session, SQLAlchemyEncoder
from paypal import PayPal

load_dotenv(dotenv_path="../.env")

# Load in environment variables for use in the app
PAYPAL_FEE = 1.0299
PAYPAL_COST = 0.30
PAYPAL_CLIENT_ID = os.environ.get("REACT_APP_PAYPAL_CLIENT_ID")
PAYPAL_CLIENT_SECRET = os.environ.get("PAYPAL_CLIENT_SECRET")
PAYPAL_MODE = os.environ.get("PAYPAL_MODE")
EASYPOST_API_KEY = os.environ.get("EASYPOST_API_KEY")
EASYPOST_ADDRESS_ID = os.environ.get("EASYPOST_ADDRESS_ID")
ADMIN_API_KEY = os.environ.get("ADMIN_API_KEY")

# Construct the Flask application
# Instantiate custom JSON encoder
# Instantiate Cross-Origin library
app = Flask(__name__)
app.json_encoder = SQLAlchemyEncoder
CORS(app)

# Connect to the EasyPost API
# Get the default origin address
easypost.api_key = EASYPOST_API_KEY
ORIGIN_ADDRESS = Address.retrieve(EASYPOST_ADDRESS_ID)

def authenticated(func):
    @wraps(func)
    def decorated_function(*args, **kwargs):
        value = request.headers.get('Authorization')
        if not value:
            abort(400, 'Missing Authorization header')
        if value != ADMIN_API_KEY:
            abort(400, 'Authorization token is bad')
        return func(*args, **kwargs)
    return decorated_function

def json_error(message):
    '''Return Flask response wrapping error text.'''
    return make_response(jsonify({"error": message}), 400)


@app.before_request
def before_request():
    '''Create new database session for the flask request.'''
    g.session = Session()


@app.teardown_request
def teardown_request(exception):
    '''Commit the session to the database after the flask request.'''
    session = getattr(g, 'session', None)
    if session is not None:
        session.close()


@app.route('/estimate', methods=['GET'])
def estimate():
    '''Return a set of shipping rates according to the ZIP code and weight.'''
    dest = Address.create(zip=request.args.get("dest"), country=request.args.get("country"))
    parcel = Parcel.create(weight=16*float(request.args.get("weight")))
    shipment = Shipment.create(to_address=dest, from_address=ORIGIN_ADDRESS, parcel=parcel)

    return {"rates":[{'delivery_days': r.delivery_days or 7,
                        'carrier':r.carrier,
                        'service':r.service.replace("International", "").replace("Package", "").replace("Service", ""),
                        'rate':r.rate} for r in shipment.rates]}


@app.route('/purchase', methods=['POST'])
def purchase():
    '''
        Create the models and calculate properties necessary to construct
        the PayPal order. The order creation does not charge the user, so
        we do not remove items from the store or buy the shipping label.
    '''
    weight = float(0.0)
    amount = float(0.0)
    products = []

    # Loop over every item in the cart
    for item in request.json.get("cart"):
        product = Product.find(item['id'])

        # Check that the order items are still for sale
        if(product is None):
            # We don't know what happened to the product
            return json_error(f"One or more products in the cart is no longer available.")
        if(product.quantity != -1 and product.quantity < item['quantity']):
            # We know the product and it doesn't have enough remaining
            return json_error(f"{product.name} is no longer available.")

        # Add the sum of weight and price for the item
        weight += product.weight * item['quantity']
        amount += product.price * item['quantity']

        # Construct limited product reference for database
        products.append({"id": product.id, "name": product.name, "quantity": item['quantity']})

    # Address creation may fail if fields are invalid
    try:
        dest = Address.create(
            name=request.json.get("name"),
            street1=request.json.get("address_1"),
            street2=request.json.get("address_2"),
            city=request.json.get("city"),
            state=request.json.get("state"),
            zip=request.json.get("zip"),
            country=request.json.get("country"),
            phone=request.json.get("phone"),
            email=request.json.get("email"))

        # Call to the server to verify all fields
        resp = dest.verify()

        # Alert the user which fields are invalid
        if not resp.verifications.delivery.success:
            return json_error('. '.join(resp.verifications.delivery.errors) + ".")
    except easypost.error.Error as e:
        # Alert the user why the address is invalid
        return json_error(f"Shipping address is invalid ({e}).")

    # Create parcel and shipment to generate label
    parcel = Parcel.create(weight=16*weight)
    shipment = Shipment.create(to_address=dest, from_address=ORIGIN_ADDRESS, parcel=parcel)

    # Calculate the true shipping rate by service name
    # We do this because the estimate in the UI may be incorrect
    service = request.json.get("service")
    amount += float([s for s in shipment.rates if s.service == service][0].rate)

    # Capture the funds to cover the merchant fees
    # Multiply by the fee twice and add the flatrate
    amount *= PAYPAL_FEE
    amount *= PAYPAL_FEE
    amount += PAYPAL_COST

    # Create the order in PayPal and update the database
    # Include fields that will be useful for management later
    order = PayPal(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_MODE).create_order(amount=round(amount, 2))
    Order.create(id=order["id"],
                date=datetime.datetime.now(),
                products=products,
                weight=weight,
                label_service=service,
                shipment=shipment.id,
                address=dest.id,
                is_processed=False,
                is_shipped=False)

    # Commit the session now that we have no errors
    g.session.commit()

    # Return the PayPal order information to the widget
    return jsonify(order)


@app.route('/confirm', methods=['POST'])
def confirm():
    '''
        The user has authorized a payment and we need to update the
        store state accordingly. Remove products in cart from the stock,
        buy a shipping label, and finally capture a payment. We capture
        they payment last in case there are any last minute errors, it is
        better to not charge the user.
    '''
    order_id = request.json.get("orderID")
    order = Order.find(order_id)

    # Loop over products to update quantity
    for meta in order.products:
        product = Product.find(meta['id'])
        # The product may not exist anymore
        if(product is None):
            return json_error(f"One or more products in the cart is no longer available.")
        # Ensure the cart item in stock still
        if(product.quantity == 0):
            return json_error(f"{product.name} is no longer available.")
        # Deduct cart quantity from the item stock
        elif(product.quantity != -1):
            product.update(quantity=product.quantity-meta['quantity'])

    # Label creation may fail with insufficient funds
    try:
        # Use the Shipment created in the purchase phase
        shipment = Shipment.retrieve(order.shipment)
        # Select the shipping service from the user
        rate = [s for s in shipment.rates if s.service == order.label_service][0]
        # Execute payment on the shipping label
        label = shipment.buy(rate=rate)
    except:
        # Something bad happened during purchase
        return json_error(f"Could not process shipping label.")

    # Capture the PayPal order to accept and transfer funds
    # Extract metadata from the capture to store in the database
    capture = PayPal(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_MODE).capture_payment(order_id=order_id)
    receivables = capture['purchase_units'][0]['payments']['captures'][0]['seller_receivable_breakdown']
    order.update(email=capture.get("payer").get("email_address"),
                paypal_fee=float(receivables["paypal_fee"]["value"]),
                order_price=float(receivables["gross_amount"]["value"]),
                net_profit=float(receivables["net_amount"]["value"]) - float(rate.rate),
                label_price=float(rate.rate),
                tracker=label["tracker"]["public_url"],
                is_processed=True)

    # Commit the session now that we have no errors
    g.session.commit()

    # Return the order data to the interface
    return jsonify(order)


@app.route('/orders', methods=['GET'])
@authenticated
def orders():
    '''Return a list of all orders in the database.'''
    return jsonify(Order.find_all())

@app.route('/list', methods=['GET'])
def list_active():
    '''Return a list of all in stock products in the database.'''
    # Check that the count is != 0 instead of < 1 (-1 means infinite stock)
    return jsonify(Product.filter(lambda product: product.quantity != 0))


@app.route('/list_all', methods=['GET'])
@authenticated
def list_all():
    '''Return a list of all products regardless of stock.'''
    return jsonify(Product.find_all())


@app.route('/admin/products/update', methods=['POST'])
@authenticated
def admin_update_products():
    '''Update the production database with a local copy of the products.'''
    # Read the file from Flask
    if 'file' not in request.files:
        return 'No file submitted'

    file = request.files['file']
    if not file.filename:
        return 'Invalid filename'

    # Construct a DataFrame from the file
    df = pd.read_excel(file)
    data = df.to_dict(orient='records')

    # Iterate the DataFrame
    # Update product where exists
    # Create product where does not exist
    products = []
    for index, row in df.iterrows():
        row['date'] = datetime.datetime.fromtimestamp(row['date'])

        product = Product.find(row['id'])
        if product is not None:
            product.update(**{r:row[r] for r in row.keys() if r not in ['id']})
            products.append(product)
        else:
            products.append(Product.create(**row))

    # Commit the session now that we have no errors
    g.session.commit()

    return jsonify(products)

@app.route('/admin/products/get', methods=['GET'])
@authenticated
def admin_get_products():
    '''Build Excel dataframe of the store contents.'''
    # Serialize all the products to memory
    data = json.loads(json.dumps(Product.find_all(), cls=SQLAlchemyEncoder))
    df = pd.DataFrame(data)

    # Create an Excel writer object
    # Write the DataFrame to the Excel file
    # Save the Excel file
    writer = pd.ExcelWriter('Products.xlsx')
    df.to_excel(writer, sheet_name='Sheet1', index=False)
    writer._save()

    return send_file('Products.xlsx', as_attachment=True)

@app.route('/admin/orders/get', methods=['GET'])
@authenticated
def admin_get_orders():
    '''Build Excel dataframe of the store contents.'''
    # Serialize all the products to memory
    data = json.loads(json.dumps(Order.find_all(), cls=SQLAlchemyEncoder))
    df = pd.DataFrame(data)

    # Create an Excel writer object
    # Write the DataFrame to the Excel file
    # Save the Excel file
    writer = pd.ExcelWriter('Orders.xlsx')
    df.to_excel(writer, sheet_name='Sheet1', index=False)
    writer._save()

    return send_file('Orders.xlsx', as_attachment=True)

@app.route('/admin/orders/ship/<id>', methods=['PUT'])
@authenticated
def admin_update_order_ship(id:str):
    '''Modify order to set shipped properties.'''
    # Find the order by ID
    # Update the order with new values
    order = Order.find(id)
    if order is not None:
        order.update(shipping_date=datetime.datetime.now(),
                     shipping_number=request.json.get("tracker"),
                     is_shipped=True)

    # Commit the session now that we have no errors
    g.session.commit()

    return jsonify(order)


# Allow the application to run as main
if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")