import os
import datetime
import easypost
from easypost import Address, Parcel, Shipment
from flask import Flask, request, g, jsonify

from database import Product, Order, OrderProduct, Session, SQLAlchemyEncoder


app = Flask(__name__)
app.json_encoder = SQLAlchemyEncoder
easypost.api_key = "EZTKb66dfac4a667469bb680848e771f1014B4dbPVHe0AP1tNlJyM4rSg"


@app.before_request
def before_request():
    g.session = Session()

@app.teardown_request
def teardown_request(exception):
    session = getattr(g, 'session', None)
    if session is not None:
        session.close()


@app.route('/calculator', methods=['GET'])
def calculate_shipping():
    origin = Address.create(zip=request.args.get("origin"))
    dest = Address.create(zip=request.args.get("dest"))
    parcel = Parcel.create(weight=16*int(request.args.get("weight")))
    shipment = Shipment.create(to_address=dest, from_address=origin, parcel=parcel)

    return [{'carrier':r.carrier, 'service':r.service, 'rate':r.rate} for r in shipment.rates]

@app.route('/purchase', methods=['GET'])
def purchase():
    product = Product.find(2)
    return jsonify(product.update(quantity=product.quantity-1))

@app.route('/list', methods=['GET'])
def list():
    return jsonify(Product.filter(lambda product: product.quantity > 0))

@app.route('/list_all', methods=['GET'])
def list_all():
    return jsonify(Product.find_all())

@app.route('/create', methods=['GET'])
def create():
    return jsonify(Product.create(quantity=10, name='Widget', date=datetime.datetime.now(),
                    price=12.34, weight=1.23, size='Medium'))

if __name__ == '__main__':
    app.run(debug=True)