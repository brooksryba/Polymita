import os
import datetime
import easypost
from random import randint
from easypost import Address, Parcel, Shipment
from flask import Flask, request, g, jsonify, make_response
from flask_cors import CORS
from dotenv import load_dotenv

from paypal import PayPal
from database import Product, Order, Session, SQLAlchemyEncoder

load_dotenv(dotenv_path="../.env")
PAYPAL_FEE = 1.0299
PAYPAL_COST = 0.30
PAYPAL_CLIENT_ID = os.environ.get("REACT_APP_PAYPAL_CLIENT_ID")
PAYPAL_CLIENT_SECRET = os.environ.get("PAYPAL_CLIENT_SECRET")
PAYPAL_MODE = os.environ.get("PAYPAL_MODE")
EASYPOST_API_KEY = os.environ.get("EASYPOST_API_KEY")
EASYPOST_ADDRESS_ID = os.environ.get("EASYPOST_ADDRESS_ID")

app = Flask(__name__)
app.json_encoder = SQLAlchemyEncoder
CORS(app)

easypost.api_key = EASYPOST_API_KEY
ORIGIN_ADDRESS = Address.retrieve(EASYPOST_ADDRESS_ID)

def json_error(message):
    return make_response(jsonify({"error": message}), 400)

@app.before_request
def before_request():
    g.session = Session()

@app.teardown_request
def teardown_request(exception):
    session = getattr(g, 'session', None)
    if session is not None:
        session.commit()
        session.close()


@app.route('/estimate', methods=['GET'])
def estimate():
    dest = Address.create(zip=request.args.get("dest"))
    parcel = Parcel.create(weight=16*float(request.args.get("weight")))
    shipment = Shipment.create(to_address=dest, from_address=ORIGIN_ADDRESS, parcel=parcel)

    return {"rates":[{'delivery_days': r.delivery_days or 1, 'carrier':r.carrier, 'service':r.service, 'rate':r.rate} for r in shipment.rates]}

@app.route('/purchase', methods=['POST'])
def purchase():
    weight = float(0.0)
    amount = float(0.0)
    products = []

    for item in request.json.get("cart"):
        product = Product.find(item['id'])
        if(product is None):
            return json_error(f"One or more products in the cart is no longer available.")
        if(product.quantity != -1 and product.quantity < item['quantity']):
            return json_error(f"{product.name} is no longer available.")
        weight += product.weight
        amount += product.price * item['quantity']
        products.append({"id": product.id, "quantity": item['quantity']})

    service = request.json.get("service")

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
            email=request.json.get("email")
        )

        resp = dest.verify()
        if not resp.verifications.delivery.success:
            return json_error('. '.join(resp.verifications.delivery.errors) + ".")
    except easypost.error.Error as e:
        return json_error(f"Shipping address is invalid ({e}).")
    parcel = Parcel.create(weight=16*weight)
    shipment = Shipment.create(to_address=dest, from_address=ORIGIN_ADDRESS, parcel=parcel)

    amount += float([s for s in shipment.rates if s.service == service][0].rate)
    amount *= PAYPAL_FEE
    amount *= PAYPAL_FEE
    amount += PAYPAL_COST

    order = PayPal(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_MODE).create_order(amount=round(amount, 2))
    Order.create(id=order["id"],
                date=datetime.datetime.now(),
                products=products,
                weight=weight,
                service=service,
                shipment=shipment.id,
                address=dest.to_dict(),
                is_processed=False,
                is_shipped=False)
    return order

@app.route('/confirm', methods=['POST'])
def confirm():
    order_id = request.json.get("orderID")
    capture = PayPal(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_MODE).capture_payment(order_id=order_id)
    receivables = capture['purchase_units'][0]['payments']['captures'][0]['seller_receivable_breakdown']

    order = Order.find(order_id)

    for meta in order.products:
        product = Product.find(meta['id'])
        if(product.quantity == 0):
            return json_error(f"{product.name} is no longer available.")
        elif(product.quantity != -1):
            product.update(quantity=product.quantity-meta['quantity'])

    try:
        shipment = Shipment.retrieve(order.shipment)
        rate = [s for s in shipment.rates if s.service == order.service][0]
        shipment.buy(rate=rate)
    except:
        return json_error(f"Shipping rate no longer available.")

    order.update(email=capture.get("payer").get("email_address"),
                fee=receivables["paypal_fee"]["value"],
                price=receivables["gross_amount"]["value"],
                net=receivables["net_amount"]["value"],
                label=rate.rate,
                is_processed=True)

    return jsonify(order)

@app.route('/orders', methods=['GET'])
def orders():
    return jsonify(Order.find_all())

@app.route('/list', methods=['GET'])
def list_active():
    return jsonify(Product.filter(lambda product: product.quantity != 0))

@app.route('/list_all', methods=['GET'])
def list_all():
    return jsonify(Product.find_all())

@app.route('/fixtures', methods=['GET'])
def create():
    products = []
    products.append(Product.create(category='photography', quantity=-1, name="Red Dragonfly Print", image="images/photography/IMG_2152.webp", date=datetime.datetime.now() - datetime.timedelta(days=randint(0, 30)), price=40.00, weight=0.2, size='8" x 10"',))
    products.append(Product.create(category='pottery', quantity=1, name="Mossy Oak Mug", image="images/pottery/IMG_6770.webp", date=datetime.datetime.now() - datetime.timedelta(days=randint(0, 30)), price=10.00, weight=1.5, size='12 fl oz',))
    products.append(Product.create(category='pottery', quantity=1, name="Cobalt Dreams Mug", image="images/pottery/IMG_6763.webp", date=datetime.datetime.now() - datetime.timedelta(days=randint(0, 30)), price=20.00, weight=1.5, size='12 fl oz',))
    products.append(Product.create(category='pottery', quantity=1, name="Inkwell Mug", image="images/pottery/IMG_6776.webp", date=datetime.datetime.now() - datetime.timedelta(days=randint(0, 30)), price=30.00, weight=1.5, size='12 fl oz',))
    products.append(Product.create(category='pottery', quantity=2, name="Ocean Sands Mug", image="images/pottery/IMG_6797.webp", date=datetime.datetime.now() - datetime.timedelta(days=randint(0, 30)), price=40.00, weight=1.5, size='12 fl oz',))
    products.append(Product.create(category='pottery', quantity=1, name="Toasted Mallow Planter", image="images/pottery/IMG_6799_.webp", date=datetime.datetime.now() - datetime.timedelta(days=randint(0, 30)), price=50.00, weight=1.5, size='12 fl oz',))
    products.append(Product.create(category='pottery', quantity=2, name="Autumn Rush Mug", image="images/pottery/IMG_6792.webp", date=datetime.datetime.now() - datetime.timedelta(days=randint(0, 30)), price=60.00, weight=1.5, size='12 fl oz',))
    return jsonify(products)

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")