import { useEffect, useState } from "react";
import { StepWizardChildProps } from "react-step-wizard";
import { Oval } from 'react-loader-spinner';

import { StoreShippingService, StoreEstimate, StoreCheckoutShippingProps } from "types/Store";
import SweetAlert from 'components/Swal';
import { MaterialButton } from "components/Base";


const StoreCheckoutShipping: React.FC<StoreCheckoutShippingProps & Partial<StepWizardChildProps>> = ({ cartItems, contact, setShipping, nextStep, previousStep }) => {
  const [estimate, setEstimate] = useState<StoreEstimate>();
  const [selection, setSelection] = useState();

  const onOptionChange = ((e:any) => {
    setSelection(e.target.value)
  })

  useEffect(() => {
    console.log("Effect")
    if(!contact)
      return
    setEstimate(undefined);
    setSelection(undefined);
    const weight = cartItems.reduce((total, item) => total + (item.weight * item.quantity), 0)
    fetch(`${process.env.REACT_APP_BACKEND}/estimate?dest=${contact.zip}&weight=${weight}`)
      .then((response) => response.json())
      .then((data: StoreEstimate) => {
        setEstimate(data);
      })
      .catch((error) => {
          console.error("Error fetching data:", error);
      });
  }, [contact?.zip, cartItems]);

  function doSetShipping() {
    if(!estimate)
      return
    const rate = estimate.rates.find((rate) => rate.service === selection)
    if(rate) {
      setShipping({
        carrier: rate.carrier,
        service: rate.service,
        rate: rate.rate,
        delivery_days: rate.delivery_days,
      });

      if(nextStep)
        nextStep();
    } else {
      SweetAlert.fire({
        icon: 'error',
        title: 'Please select a shipping rate before continuing.',
        showConfirmButton: false,
        timer: 1500
      })
    }
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });


  return (
    <div className='Shipping'>
      <div className="half">
        <h3><span className="material-symbols-outlined">local_shipping</span>Shipping Serivce (USPS):</h3>
        {(estimate && estimate.rates.length === 0 ?
          <span>No rates available for ZIP code {contact?.zip}.</span> :
          <></>
        )}
        {(estimate ? estimate.rates
          .sort((a: StoreShippingService, b: StoreShippingService) => a.delivery_days - b.delivery_days)
          .map((rate: StoreShippingService) =>
            <div key={rate.service}>
              <input id={rate.service} type='radio' name='service' onChange={onOptionChange} value={rate.service}/>
              <label htmlFor={rate.service}>
                ({rate.delivery_days}-{Math.ceil(rate.delivery_days*1.5)} day) {rate.service} - {formatter.format(Number(rate.rate))}
              </label>
              <br/>
            </div>
            ) :
            <Oval
              height={80}
              width={80}
              color="#4fa94d"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              ariaLabel='oval-loading'
              secondaryColor="#4fa94d"
              strokeWidth={2}
              strokeWidthSecondary={2}
            />)}
      </div>
      <div className="buttons">
        <MaterialButton name="arrow_back" className="back" onClick={previousStep}/>
        <MaterialButton className="next" onClick={doSetShipping} name="arrow_forward"/>
      </div>
    </div>
  )
}

export default StoreCheckoutShipping;