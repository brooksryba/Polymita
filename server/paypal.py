import base64
import requests

class PayPal:
    def __init__(self, client_id, client_secret):
        self.id = client_id
        self.secret = client_secret
        self.baseURL = {
            "sandbox": "https://api-m.sandbox.paypal.com",
            "production": "https://api-m.paypal.com"
        }

    def create_order(self, amount):
        access_token = self.generate_access_token()
        url = f"{self.baseURL['sandbox']}/v2/checkout/orders"
        response = requests.post(url, json={
            "intent": "CAPTURE",
            "purchase_units": [
                {
                    "amount": {
                        "currency_code": "USD",
                        "value": str(amount),
                    },
                },
            ],
        }, headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}",
        })
        data = response.json()
        return data


    # use the orders api to capture payment for an order
    def capture_payment(self, order_id):
        access_token = self.generate_access_token()
        url = f"{self.baseURL['sandbox']}/v2/checkout/orders/{order_id}/capture"
        response = requests.post(url, headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}",
        })
        data = response.json()
        return data


    # generate an access token using client id and app secret
    def generate_access_token(self):
        auth = base64.b64encode(f"{self.id}:{self.secret}".encode()).decode()
        response = requests.post(f"{self.baseURL['sandbox']}/v1/oauth2/token", headers={
            "Authorization": f"Basic {auth}",
        }, data={
            "grant_type": "client_credentials",
        })
        data = response.json()
        return data["access_token"]