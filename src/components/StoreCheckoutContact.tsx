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
    const [form, setForm] = useState<StoreContact>(defaultStoreContact);
    const [searchResult, setSearchResult] = useState<google.maps.places.Autocomplete>();
    const { isLoaded } = useLoadScript({googleMapsApiKey: apiKey, libraries: libraries});

    function onLoad(autocomplete: google.maps.places.Autocomplete) { setSearchResult(autocomplete); }
    function onUpdate(event: React.ChangeEvent<HTMLInputElement>, field: string) {
        const values:Dictionary = {};
        values[field] = event.target.value;
        setForm({...form, ...values})
    }

    return (
        <div className='Contact'>
            <div className="half">
                <Heading icon="contacts" level={3}>Contact Information:</Heading>
                <Input label="Name:" name='username' type='text' autoComplete="name" value={form.username} onChange={(e:any) => onUpdate(e, "username")} />
                <Input label="E-mail:" name='email' type='email' autoComplete="email" value={form.email} onChange={(e:any) => onUpdate(e, "email")} />
                <Input label="Phone:" name='phone' type='tel' autoComplete="tel" value={form.phone} onChange={(e:any) => onUpdate(e, "phone")} />
            </div>
            <div className="half">
                <Heading icon="home" level={3}>Shipping Address:</Heading>
                <Input label="Name:" name='name' type='text' value={form.name} onChange={(e:any) => onUpdate(e, "name")}/>
                <Optional condition={isLoaded}>
                    <Autocomplete onPlaceChanged={() => handleAddressAutofill(searchResult, form)} onLoad={onLoad}>
                        <Input label="Address:" name='address' type='text'/>
                    </Autocomplete>
                </Optional>
            </div>
            <div className="buttons">
                <MaterialButton className="next" onClick={() => handleContactNextStep(form, setContact, nextStep)} name="arrow_forward" />
            </div>
        </div>
    )
}

export default StoreCheckoutContact;