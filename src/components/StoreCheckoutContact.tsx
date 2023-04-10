import { useState, useRef } from "react";
import { StepWizardChildProps } from "react-step-wizard";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";

import { StoreCheckoutContactProps } from "types/Store";
import SweetAlert from 'components/Swal';

const StoreCheckoutContact: React.FC<StoreCheckoutContactProps & Partial<StepWizardChildProps>> = ({ setContact, nextStep }) => {
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
        if(nameRef.current?.value &&
           emailRef.current?.value &&
           phoneRef.current?.value &&
           address1Ref &&
           cityRef &&
           stateRef &&
           zipRef &&
           countryRef) {
            setContact({
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
                <label>E-mail:</label>
                <input ref={emailRef} name='email' type='email' autoComplete="email"/>
                <label>Phone:</label>
                <input ref={phoneRef} name='phone' type='text' autoComplete="phone"/>
            </div>
            <div className="half">
                <h3><span className="material-symbols-outlined">home</span>Shipping Address:</h3>
                <label>Name:</label>
                <input ref={nameRef} type='text' autoComplete="name"/>
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
                <button className="next" onClick={doNextStep}>
                    <span className="material-symbols-outlined">arrow_forward</span>
                </button>
            </div>
      </div>
    )
}

export default StoreCheckoutContact;