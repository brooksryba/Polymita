import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { StepWizardChildProps } from "react-step-wizard";
import emailjs from '@emailjs/browser';

import { StoreCheckoutPaymentProps } from 'types/Store';
import SweetAlert from 'components/Swal';
import { MaterialButton } from "components/Base";

declare global {
  namespace NodeJS {
      interface ProcessEnv {
          REACT_APP_PAYPAL_CLIENT_ID: string;
      }
  }
}

const PayPalOptions = {
  "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
  components: "buttons",
  currency: "USD"
};

const StoreCheckoutPayment: React.FC<StoreCheckoutPaymentProps & Partial<StepWizardChildProps>> = ({ cartItems, contact, shipping, previousStep, setCartItems, setIsCheckout }) => {
  let errorResponse = {'error': undefined};

  function onError(err:any) {
    console.log(err)
    SweetAlert.fire({
      icon: 'error',
      title: (errorResponse.error ? `An error occurred:<br>${errorResponse.error}` : 'Error occurred during checkout. Please try again shortly.'),
      showConfirmButton: false,
      timer: 5000
    }).then(() =>
      errorResponse.error = undefined
    )
  }

  function createOrder() {
    return fetch(`${process.env.REACT_APP_BACKEND}/purchase`, {
      method: "POST",
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify({
        cart: cartItems,
        name: contact?.name,
        email: contact?.email,
        phone: contact?.phone,
        address_1: contact?.address_0 + ' ' + contact?.address_1,
        address_2: contact?.address_2,
        city: contact?.city,
        state: contact?.state,
        zip: contact?.zip,
        country: contact?.country,
        service: shipping?.service
      }),
    })
      .then((response) => {
        return response.json()
      })
      .then((order) => {
        if(order.error)
          errorResponse.error = order.error
        return order.id
      });
  }

  function onApprove(data: any) {
    return fetch(`${process.env.REACT_APP_BACKEND}/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify({
        orderID: data.orderID
      })
    })
      .then((response) => {
        return response.json()
      }).then(function(order) {
        if(order.error) {
          errorResponse.error = order.error
          onError(order.error)
        } else {
          SweetAlert.fire({
            icon: 'success',
            title: 'Your order has been placed!',
            showConfirmButton: false,
            timer: 3000
          }).then(() => {
            setCartItems([]);
            setIsCheckout(false);
          })

          emailjs.send('service_f93v6k2', 'template_0jy2vhm', {
            "user_email": contact?.email,
            "user_name": contact?.username,
            "tracking_url": order.tracker
          }, 'fsNy-2mIY3UcPyt1_')
        }
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
        Name: {contact?.username}<br/>
        E-mail: {contact?.email}<br/>
        Phone: {contact?.phone}<br/><br/>

        <label>Shipping Address:</label>
        {contact?.name}<br/>
        {contact?.address_0} {contact?.address_1} {contact?.address_2}<br/>
        {contact?.city}, {contact?.state} {contact?.zip} {contact?.country}
      </div>
      <div className="half">
        <h4><span className="material-symbols-outlined">payments</span>Payment:</h4>
        <label>Sub-total: {formatter.format(cartTotal)}</label>
        <label>Shipping: {formatter.format(Number(shipping?.rate))}</label>
        <label>Tax & Fees: {formatter.format((cartTotal+Number(shipping?.rate))*0.0299)}</label>
        <hr/>
        <label>Total: {formatter.format(((cartTotal+Number(shipping?.rate))*1.0299*1.0299)+0.30)}</label>
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
        <MaterialButton name="arrow_back" className="back" onClick={previousStep}/>
      </div>
    </div>
  )
}

export default StoreCheckoutPayment;