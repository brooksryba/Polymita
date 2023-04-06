from flask import Flask, request
import requests

app = Flask(__name__)

@app.route('/shipping', methods=['GET'])
def calculate_shipping():
    # USPS shipping calculator URL
    url = 'http://production.shippingapis.com/ShippingAPI.dll?API=RateV4&XML='

    # Required parameters for the USPS shipping calculator
    origin_zip = request.args.get('origin_zip')
    dest_zip = request.args.get('dest_zip')
    weight = request.args.get('weight')

    # Build the XML request for the USPS shipping calculator
    xml_request = f'''<RateV4Request USERID="your_usps_userid">
                        <Package ID="0">
                            <Service>ALL</Service>
                            <ZipOrigination>{origin_zip}</ZipOrigination>
                            <ZipDestination>{dest_zip}</ZipDestination>
                            <Pounds>{weight}</Pounds>
                            <Ounces>0</Ounces>
                            <Container></Container>
                            <Size>REGULAR</Size>
                            <Machinable>true</Machinable>
                        </Package>
                    </RateV4Request>'''

    # Send the request to the USPS shipping calculator and get the response
    response = requests.get(url + xml_request)

    # Return the response from the USPS shipping calculator
    return response.text

if __name__ == '__main__':
    app.run()