import { useContext, useEffect, useState } from "react";
import { StepWizardChildProps } from "react-step-wizard";
import { Oval } from 'react-loader-spinner';

import { StoreContext, StoreShippingService, StoreEstimate, CurrencyType } from "types/Store";
import { Heading, MaterialButton, Optional } from "components/Base";
import { handleShippingSelection, handleShippingFetch } from "functions/Checkout";

const StoreCheckoutShipping: React.FC<Partial<StepWizardChildProps>> = ({ nextStep, previousStep }) => {
  const { contact, cartItems, setShipping } = useContext(StoreContext);
  const [estimate, setEstimate] = useState<StoreEstimate>();
  const [selection, setSelection] = useState("");

  const onOptionChange = ((e: any) => { setSelection(e.target.value) })

  useEffect(() => {
    handleShippingFetch(contact, cartItems, setEstimate, setSelection)
  }, [contact?.zip, cartItems]);

  return (
    <div className='Shipping'>
      <div className="full">
        <Heading level={3} icon="local_shipping">Shipping Serivce (USPS):</Heading>
        <Optional condition={estimate !== undefined && estimate.rates.length === 0}>
          <span>No rates available for ZIP code {contact?.zip}.</span>
        </Optional>
        <Optional condition={estimate === undefined}>
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
          />
        </Optional>
        <Optional condition={estimate !== undefined}>
          {estimate?.rates
            .sort((a: StoreShippingService, b: StoreShippingService) => a.delivery_days - b.delivery_days)
            .map((rate: StoreShippingService) =>
              <div key={rate.service}>
                <input id={rate.service} type='radio' name='service' onChange={onOptionChange} value={rate.service} />
                <label htmlFor={rate.service}>
                  <Optional condition={rate.delivery_days >= 7}>
                    ({rate.delivery_days}+ days)
                  </Optional>
                  <Optional condition={rate.delivery_days < 7}>
                    ({rate.delivery_days}-{Math.ceil(rate.delivery_days * 1.5)} day)
                  </Optional>
                  &nbsp;{rate.service} - {CurrencyType.format(Number(rate.rate))}
                </label>
                <br />
              </div>
            )}
        </Optional>
      </div>
      <div className="buttons">
        <MaterialButton name="arrow_back" className="back" onClick={previousStep} />
        <MaterialButton className="next" onClick={() => handleShippingSelection(estimate, selection, setShipping, nextStep)} name="arrow_forward" />
      </div>
    </div>
  )
}

export default StoreCheckoutShipping;