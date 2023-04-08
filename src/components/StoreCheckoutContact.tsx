import { useRef } from "react";
import { StepWizardChildProps } from "react-step-wizard";

import { StoreCheckoutContactProps } from "types/Store";


const StoreCheckoutContact: React.FC<StoreCheckoutContactProps & Partial<StepWizardChildProps>> = ({ setContact, nextStep }) => {
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);
    const address1Ref = useRef<HTMLInputElement>(null);
    const address2Ref = useRef<HTMLInputElement>(null);
    const cityRef = useRef<HTMLInputElement>(null);
    const stateRef = useRef<HTMLInputElement>(null);
    const zipRef = useRef<HTMLInputElement>(null);
    const countryRef = useRef<HTMLInputElement>(null);

    function doNextStep() {
        setContact({
            name: nameRef.current ? nameRef.current.value : "",
            email: emailRef.current ? emailRef.current.value : "",
            phone: phoneRef.current ? phoneRef.current.value : "",
            address_1: address1Ref.current ? address1Ref.current.value : "",
            address_2: address2Ref.current ? address2Ref.current.value : "",
            city: cityRef.current ? cityRef.current.value : "",
            state: stateRef.current ? stateRef.current.value : "",
            zip: zipRef.current ? zipRef.current.value : "",
            country: countryRef.current ? countryRef.current.value : "",
        })
        if(nextStep)
            nextStep();
    }

    return (
        <div className='Contact'>
            <div className="half">
                <h3><span className="material-symbols-outlined">contacts</span>Contact Information:</h3>
                <label>E-mail:</label>
                <input ref={emailRef} type='text' />
                <label>Phone:</label>
                <input ref={phoneRef} type='text' />
            </div>
            <div className="half">
                <h3><span className="material-symbols-outlined">home</span>Shipping Address:</h3>
                <label>Name:</label>
                <input ref={nameRef} type='text' />
                <label>Address Line 1:</label>
                <input ref={address1Ref} type='text' />
                <label>Address Line 2:</label>
                <input ref={address2Ref} type='text' />
                <label>City:</label>
                <input ref={cityRef} type='text' />
                <label>State:</label>
                <input ref={stateRef} type='text' />
                <label>ZIP:</label>
                <input ref={zipRef} type='text' />
                <label>Country:</label>
                <input ref={countryRef} type='text' />
            </div>
        <button onClick={doNextStep}>Next Step</button>
      </div>
    )
}

export default StoreCheckoutContact;