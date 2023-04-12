import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { StepWizardChildProps } from "react-step-wizard";

import { StoreContext, CurrencyType } from 'types/Store';
import { MaterialButton } from "components/Base";

import { handlePaymentCreateOrder, handlePaymentOrderApprove, handlePaymentError } from "functions/Checkout";
import { useContext } from "react";

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

const StoreCheckoutPayment: React.FC<Partial<StepWizardChildProps>> = ({ previousStep }) => {
  const context = useContext(StoreContext);
  const { cartItems, contact, shipping } = context;

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
        <label>Sub-total: {CurrencyType.format(cartTotal)}</label>
        <label>Shipping: {CurrencyType.format(Number(shipping?.rate))}</label>
        <label>Tax & Fees: {CurrencyType.format((cartTotal+Number(shipping?.rate))*0.0299)}</label>
        <hr/>
        <label>Total: {CurrencyType.format(((cartTotal+Number(shipping?.rate))*1.0299*1.0299)+0.30)}</label>
        <br/>
        <PayPalScriptProvider options={PayPalOptions}>
          <PayPalButtons
            disabled={false}
            forceReRender={[contact, shipping]}
            fundingSource={undefined}
            createOrder={() => handlePaymentCreateOrder(context)}
            onApprove={(data:any) => handlePaymentOrderApprove(data, context)}
            onError={() => handlePaymentError()}
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