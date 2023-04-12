import SweetAlert from 'components/Swal';
import { StoreContact } from 'types/Store';


export function handleAddressAutofill(searchResult: google.maps.places.Autocomplete | undefined, contactInfo: StoreContact) {
    if (searchResult != null) {
        const place = searchResult.getPlace();
        place?.address_components?.forEach((component) => {
            const types = component.types;

            if (types.includes('street_number')) { contactInfo.address_0 = component.long_name; }
            if (types.includes('route')) { contactInfo.address_1 = component.long_name; }
            if (types.includes('sublocality_level_1')) { contactInfo.address_2 = component.long_name; }
            if (types.includes('locality')) { contactInfo.city = component.long_name; }
            if (types.includes('administrative_area_level_1')) { contactInfo.state = component.short_name; }
            if (types.includes('postal_code')) { contactInfo.zip = component.long_name; }
            if (types.includes('country') || types.includes('political')) { contactInfo.country = component.short_name; }
        });
    }
}


export function handleContactNextStep(contactInfo: StoreContact, setContact: Function, nextStep: Function | undefined) {
    if (contactInfo.username &&
        contactInfo.name &&
        contactInfo.email &&
        contactInfo.phone &&
        contactInfo.address_1 &&
        contactInfo.city &&
        contactInfo.state &&
        contactInfo.zip &&
        contactInfo.country) {
        setContact(contactInfo)
        if (nextStep)
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