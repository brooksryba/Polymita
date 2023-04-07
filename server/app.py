import os
import datetime
import paypalrestsdk
import easypost
from easypost import Address, Parcel, Shipment
from flask import Flask, request, g, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

from paypal import PayPal
from database import Product, Order, Session, SQLAlchemyEncoder

load_dotenv()
PAYPAL_CLIENT_ID = os.environ.get("PAYPAL_CLIENT_ID")
PAYPAL_CLIENT_SECRET = os.environ.get("PAYPAL_CLIENT_SECRET")
EASYPOST_API_KEY = os.environ.get("EASYPOST_API_KEY")
ORIGIN_ZIP = os.environ.get("ORIGIN_ZIP")

app = Flask(__name__)
app.json_encoder = SQLAlchemyEncoder
CORS(app)

easypost.api_key = EASYPOST_API_KEY
paypalrestsdk.configure({
    "mode": "sandbox", # or "live" for production
    "client_id": PAYPAL_CLIENT_ID,
    "client_secret": PAYPAL_CLIENT_SECRET
})


@app.before_request
def before_request():
    g.session = Session()

@app.teardown_request
def teardown_request(exception):
    session = getattr(g, 'session', None)
    if session is not None:
        session.close()


@app.route('/estimate', methods=['GET'])
def estimate():
    origin = Address.create(zip=ORIGIN_ZIP)
    dest = Address.create(zip=request.args.get("dest"))
    parcel = Parcel.create(weight=16*int(request.args.get("weight")))
    shipment = Shipment.create(to_address=dest, from_address=origin, parcel=parcel)

    return [{'carrier':r.carrier, 'service':r.service, 'rate':r.rate} for r in shipment.rates]

@app.route('/purchase', methods=['POST'])
def purchase():
    amount = float(0.0)
    for item in request.json.get("cart"):
        product = Product.find(item['id'])
        amount += product.price * item['quantity']
    return PayPal(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET).create_order(amount=amount)

@app.route('/confirm', methods=['POST'])
def confirm():
    capture = PayPal(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET).capture_payment(order_id=request.json.get("orderID"))
    order = Order.create(email=capture.get("payer").get("email_address"),
                        date=datetime.datetime.now())
    return jsonify(order)

@app.route('/orders', methods=['GET'])
def orders():
    return jsonify(Order.find_all())

@app.route('/list', methods=['GET'])
def list():
    return jsonify(Product.filter(lambda product: product.quantity > 0))

@app.route('/list_all', methods=['GET'])
def list_all():
    return jsonify(Product.find_all())

@app.route('/fixtures', methods=['GET'])
def create():
    products = []
    products.append(Product.create(quantity=1, name="Mossy Oak Mug", image="images/pottery/IMG_6770.webp", date=datetime.datetime.now(), price=30.00, weight=1.5, size='12 fl. oz.',))
    products.append(Product.create(quantity=1, name="Cobalt Dreams Mug", image="images/pottery/IMG_6763.webp", date=datetime.datetime.now(), price=30.00, weight=1.5, size='12 fl. oz.',))
    products.append(Product.create(quantity=1, name="Inkwell Mug", image="images/pottery/IMG_6776.webp", date=datetime.datetime.now(), price=30.00, weight=1.5, size='12 fl. oz.',))
    products.append(Product.create(quantity=2, name="Ocean Sands Mug", image="images/pottery/IMG_6797.webp", date=datetime.datetime.now(), price=30.00, weight=1.5, size='12 fl. oz.',))
    products.append(Product.create(quantity=1, name="Toasted Mallow Planter", image="images/pottery/IMG_6799_.webp", date=datetime.datetime.now(), price=30.00, weight=1.5, size='12 fl. oz.',))
    products.append(Product.create(quantity=2, name="Autumn Rush Mug", image="images/pottery/IMG_6792.webp", date=datetime.datetime.now(), price=30.00, weight=1.5, size='12 fl. oz.',))
    return jsonify(products)

if __name__ == '__main__':
    app.run(debug=True)