import { useState } from "react";
import { StepWizardChildProps } from "react-step-wizard";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";

import { StoreCheckoutContactProps, StoreContact, defaultStoreContact } from "types/Store";
import { Optional, Heading, Input, MaterialButton } from "components/Base";

import { handleAddressAutofill, handleContactNextStep } from "functions/Checkout";

const apiKey:string = process.env.REACT_APP_GOOGLE_KEY || "";
const libraries:("places" | "drawing" | "geometry" | "localContext" | "visualization")[] = ["places"];

interface Dictionary {
    [key: string]: string;
}


const StoreCheckoutContact: React.FC<StoreCheckoutContactProps & Partial<StepWizardChildProps>> = ({ setContact, nextStep }) => {
    const [contactInfo, setContactInfo] = useState<StoreContact>(defaultStoreContact);
    const [searchResult, setSearchResult] = useState<google.maps.places.Autocomplete>();
    const { isLoaded } = useLoadScript({googleMapsApiKey: apiKey, libraries: libraries});

    function onLoad(autocomplete: google.maps.places.Autocomplete) { setSearchResult(autocomplete); }
    function onUpdate(event: React.ChangeEvent<HTMLInputElement>, field: string) {
        const values:Dictionary = {};
        values[field] = event.target.value;
        setContactInfo({...contactInfo, ...values})
    }

    return (
        <div className='Contact'>
            <div className="half">
                <Heading icon="contacts" level={3}>Contact Information:</Heading>
                <Input label="Name:" name='username' type='text' autoComplete="name" value={contactInfo.username} onChange={(e:any) => onUpdate(e, "username")} />
                <Input label="E-mail:" name='email' type='email' autoComplete="email" value={contactInfo.email} onChange={(e:any) => onUpdate(e, "email")} />
                <Input label="Phone:" name='phone' type='tel' autoComplete="tel" value={contactInfo.phone} onChange={(e:any) => onUpdate(e, "phone")} />
            </div>
            <div className="half">
                <Heading icon="home" level={3}>Shipping Address:</Heading>
                <Input label="Name:" name='name' type='text' value={contactInfo.name} onChange={(e:any) => onUpdate(e, "name")}/>
                <Optional condition={isLoaded}>
                    <Autocomplete onPlaceChanged={() => handleAddressAutofill(searchResult, contactInfo)} onLoad={onLoad}>
                        <>
                            <label>Address:</label>
                            <input
                                type="text"
                                placeholder="Search for address"
                                autoComplete="address"
                            />
                        </>
                    </Autocomplete>
                </Optional>
            </div>
            <div className="buttons">
                <MaterialButton className="next" onClick={() => handleContactNextStep(contactInfo, setContact, nextStep)} name="arrow_forward" />
            </div>
        </div>
    )
}

export default StoreCheckoutContact;