import { useState, useRef } from "react";
import { StepWizardChildProps } from "react-step-wizard";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";

import { StoreCheckoutContactProps } from "types/Store";
import SweetAlert from 'components/Swal';
import MaterialButton from "./MaterialButton";

const StoreCheckoutContact: React.FC<StoreCheckoutContactProps & Partial<StepWizardChildProps>> = ({ setContact, nextStep }) => {
    const usernameRef = useRef<HTMLInputElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);
    const addressRef = useRef<HTMLInputElement>(null);
    const [address0Ref, setAddress0Ref] = useState("");
    const [address1Ref, setAddress1Ref] = useState("");
    const [address2Ref, setAddress2Ref] = useState("");
    const [cityRef, setCityRef] = useState("");
    const [stateRef, setStateRef] = useState("");
    const [zipRef, setZipRef] = useState("");
    const [countryRef, setCountryRef] = useState("");

    const [searchResult, setSearchResult] = useState<google.maps.places.Autocomplete>();

    const { isLoaded } = useLoadScript({
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_KEY || "",
      libraries: ["places"]
    });

    function onLoad(autocomplete:google.maps.places.Autocomplete) {
      setSearchResult(autocomplete);
    }

    function onPlaceChanged() {
      if (searchResult != null) {
        const place = searchResult.getPlace();
        place?.address_components?.forEach((component) => {
            const types = component.types;

            if (types.includes('street_number')) { setAddress0Ref(component.long_name); }
            if (types.includes('route')) { setAddress1Ref(component.long_name); }
            if (types.includes('sublocality_level_1')) { setAddress2Ref(component.long_name); }
            if (types.includes('locality')) { setCityRef(component.long_name); }
            if (types.includes('administrative_area_level_1')) { setStateRef(component.short_name); }
            if (types.includes('postal_code')) { setZipRef(component.long_name); }
            if (types.includes('country') || types.includes('political')) { setCountryRef(component.short_name); }
          });
      }
    }


    function doNextStep() {
        if(usernameRef.current?.value &&
           nameRef.current?.value &&
           emailRef.current?.value &&
           phoneRef.current?.value &&
           address1Ref &&
           cityRef &&
           stateRef &&
           zipRef &&
           countryRef) {
            setContact({
                username: usernameRef.current?.value,
                name: nameRef.current?.value,
                email: emailRef.current?.value,
                phone: phoneRef.current?.value,
                address_1: address0Ref + ' ' + address1Ref,
                address_2: address2Ref,
                city: cityRef,
                state: stateRef,
                zip: zipRef,
                country: countryRef,
            })
            if(nextStep)
                nextStep();
        } else {
            SweetAlert.fire({
                icon: 'error',
                title: 'Please fill in all fields before continuing.',
                showConfirmButton: false,
                timer: 1500
              })
        }
    }

    if (!isLoaded) { return <></>; }
    return (
        <div className='Contact'>
            <div className="half">
                <h3><span className="material-symbols-outlined">contacts</span>Contact Information:</h3>
                <label>Name:</label>
                <input ref={usernameRef} name='username' type='name' autoComplete="name"/>
                <label>E-mail:</label>
                <input ref={emailRef} name='email' type='email' autoComplete="email"/>
                <label>Phone:</label>
                <input ref={phoneRef} name='phone' type='tel' autoComplete="tel"/>
            </div>
            <div className="half">
                <h3><span className="material-symbols-outlined">home</span>Shipping Address:</h3>
                <label>Name:</label>
                <input ref={nameRef} type='text'/>
                <Autocomplete onPlaceChanged={onPlaceChanged} onLoad={onLoad}>
                    <>
                        <label>Address:</label>
                        <input
                            ref={addressRef}
                            type="text"
                            placeholder="Search for address"
                            autoComplete="address"
                        />
                    </>
                </Autocomplete>
            </div>
            <div className="buttons">
                <MaterialButton className="next" onClick={doNextStep} name="arrow_forward"/>
            </div>
      </div>
    )
}

export default StoreCheckoutContact;