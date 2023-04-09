import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { StepWizardChildProps } from "react-step-wizard";

import { StoreCheckoutPaymentProps } from 'types/Store';
import SweetAlert from 'components/Swal';

const PayPalOptions = {
  "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
  components: "buttons",
  currency: "USD"
};

const StoreCheckoutPayment: React.FC<StoreCheckoutPaymentProps & Partial<StepWizardChildProps>> = ({ cartItems, contact, shipping, previousStep, setCartItems, setIsCheckout }) => {

  function onError() {
    SweetAlert.fire({
      icon: 'error',
      title: 'Error occurred during checkout. Please try again shortly.',
      showConfirmButton: false,
      timer: 3000
    })
  }

  function createOrder() {
    return fetch("http://localhost:5000/purchase", {
      method: "POST",
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify({
        cart: cartItems,
        name: contact?.name,
        email: contact?.email,
        phone: contact?.phone,
        address_1: contact?.address_1,
        address_2: contact?.address_2,
        city: contact?.city,
        state: contact?.state,
        zip: contact?.zip,
        country: contact?.country,
        service: shipping?.service
      }),
    })
      .then((response) => response.json())
      .then((order) => order.id);
  }

  function onApprove(data: any) {
    return fetch("http://localhost:5000/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify({
        orderID: data.orderID
      })
    })
      .then((response) => {
        SweetAlert.fire({
          icon: 'success',
          title: 'Checkout complete',
          showConfirmButton: false,
          timer: 3000
        }).then(() => {
          setCartItems([]);
          setIsCheckout(false);
        })
        return response.json()
      });
  }

  const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
  });

  const cartTotal = Number(cartItems.reduce((total, item) => total + (item.price * item.quantity), 0));

  return (
    <div className='Payment'>
      <div className="half">
        <h4><span className="material-symbols-outlined">preview</span>Review:</h4>
        <label>Contact:</label>
        E-mail: {contact?.email}<br/>
        Phone: {contact?.phone}<br/><br/>

        <label>Shipping Address:</label>
        {contact?.name}<br/>{contact?.address_1} {contact?.address_2}<br/>{contact?.city}, {contact?.state} {contact?.zip} {contact?.country}

      </div>
      <div className="half">
        <h4><span className="material-symbols-outlined">payments</span>Payment:</h4>
        <label>Sub-total: {formatter.format(cartTotal)}</label>
        <label>Shipping: {formatter.format(Number(shipping?.rate))}</label>
        <label>Tax & Fees: {formatter.format((cartTotal+Number(shipping?.rate))*0.0299)}</label>
        <hr/>
        <label>Total: {formatter.format((cartTotal+Number(shipping?.rate))*1.0299)}</label>
        <br/>
        <PayPalScriptProvider options={PayPalOptions}>
          <PayPalButtons
            disabled={false}
            forceReRender={[contact, shipping]}
            fundingSource={undefined}
            createOrder={createOrder}
            onApprove={onApprove}
            onError={onError}
          />
        </PayPalScriptProvider>
      </div>
      <div className="buttons">
        <button className='back' onClick={previousStep}>
            <span className="material-symbols-outlined">arrow_back</span>
        </button>
      </div>
    </div>
  )
}

export default StoreCheckoutPayment;