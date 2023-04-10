import base64
import requests

PAYPAL_BASE_URLS = {
    "sandbox": "https://api-m.sandbox.paypal.com",
    "live": "https://api-m.paypal.com"
}

class PayPal:
    '''
        PayPal React Widget SDK. This code was created due to out-of-date
        python packages. PayPal operates on an OAuth backed REST API which
        allows us to capture payments in the storefront.
    '''
    def __init__(self, client_id, client_secret, client_mode):
        self.id = client_id
        self.secret = client_secret
        self.url = PAYPAL_BASE_URLS[client_mode]

    def create_order(self, amount):
        '''Use the v2 Orders API to create an order for checkout.'''
        params = {"intent": "CAPTURE","purchase_units": [{"amount": {"currency_code": "USD","value": str(amount)}}]}

        response = requests.post(f"{self.url}/v2/checkout/orders", json=params, headers=self.headers())
        return response.json()

    def capture_payment(self, order_id):
        '''Use the v2 Orders API to capture payment for an order.'''
        response = requests.post(f"{self.url}/v2/checkout/orders/{order_id}/capture", headers=self.headers())
        return response.json()

    def headers(self):
        '''Generate an access token using client id and app secret.'''
        auth = base64.b64encode(f"{self.id}:{self.secret}".encode()).decode()
        response = requests.post(f"{self.url}/v1/oauth2/token",
                                 headers={"Authorization": f"Basic {auth}"},
                                 data={"grant_type": "client_credentials"}).json()

        return {"Content-Type": "application/json", "Authorization": f"Bearer {response['access_token']}"}