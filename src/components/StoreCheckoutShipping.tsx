import { useEffect, useState } from "react";
import { StepWizardChildProps } from "react-step-wizard";

import { StoreShippingService, StoreEstimate, StoreCheckoutShippingProps } from "types/Store";


const StoreCheckoutShipping: React.FC<StoreCheckoutShippingProps & Partial<StepWizardChildProps>> = ({ cartItems, contact, setShipping, nextStep, previousStep }) => {
  const [estimate, setEstimate] = useState<StoreEstimate>();
  const [selection, setSelection] = useState("Medium")

  const onOptionChange = ((e:any) => {
    setSelection(e.target.value)
  })

  useEffect(() => {
    if(!contact)
      return
    const weight = cartItems.reduce((total, item) => total + (item.weight * item.quantity), 0)
    fetch(`http://localhost:5000/estimate?dest=${contact.zip}&weight=${weight}`)
      .then((response) => response.json())
      .then((data: StoreEstimate) => {
        setEstimate(data);
      })
      .catch((error) => {
          console.error("Error fetching data:", error);
      });
  }, [contact]);

  function doSetShipping() {
    if(!estimate)
      return
    console.log(selection)
    const rate = estimate.rates.find((rate) => rate.service === selection)
    if(!rate)
      return
    setShipping({
      carrier: rate.carrier,
      service: rate.service,
      rate: rate.rate,
      delivery_days: rate.delivery_days,
    });

    if(nextStep)
      nextStep();
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });


  return (
    <div className='Shipping'>
      <div className="half">
        <h3><span className="material-symbols-outlined">local_shipping</span>Shipping Serivce (USPS):</h3>
        {(estimate ? estimate.rates
          .sort((a: StoreShippingService, b: StoreShippingService) => a.delivery_days - b.delivery_days)
          .map((rate: StoreShippingService) =>
            <div key={rate.service}>
              <input type='radio' name='service' onChange={onOptionChange} value={rate.service}/>
              ({rate.delivery_days}-{Math.ceil(rate.delivery_days*1.5)} day) {rate.service} - {formatter.format(Number(rate.rate))}
              <br/>
            </div>
            ) : <></>)}
        <button onClick={previousStep}>Previous Step</button>
        <button onClick={doSetShipping}>Next Step</button>
      </div>
    </div>
  )
}

export default StoreCheckoutShipping;