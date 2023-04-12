import emailjs from '@emailjs/browser';
import SweetAlert from 'components/Swal';

import { StoreItem, StoreContact, StoreEstimate, StoreContextType } from 'types/Store';


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

export function handleShippingFetch(contact: StoreContact | undefined, cartItems: Array<StoreItem>, setEstimate: Function, setSelection: Function) {
    if (!contact)
        return
    setEstimate(undefined);
    setSelection("");
    const weight = cartItems.reduce((total, item) => total + (item.weight * item.quantity), 0)
    fetch(`${process.env.REACT_APP_BACKEND}/estimate?dest=${contact.zip}&weight=${weight}`)
        .then((response) => response.json())
        .then((data: StoreEstimate) => {
            setEstimate(data);
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
}

export function handleShippingSelection(estimate: StoreEstimate | undefined, selection: string, setShipping: Function, nextStep: Function | undefined) {
    if (!estimate)
        return
    const rate = estimate.rates.find((rate) => rate.service === selection)
    if (rate) {
        setShipping({
            carrier: rate.carrier,
            service: rate.service,
            rate: rate.rate,
            delivery_days: rate.delivery_days,
        });

        if (nextStep)
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

export let paymentError: string = "";

export function handlePaymentError(e?: string) {
    if (e !== undefined) { paymentError = e }
    SweetAlert.fire({
        icon: 'error',
        title: (paymentError !== "" ? `An error occurred:<br>${paymentError}` : 'Error occurred during checkout. Please try again shortly.'),
        showConfirmButton: false,
        timer: 5000
    })
}

export function handlePaymentCreateOrder(context: Partial<StoreContextType>) {
    return fetch(`${process.env.REACT_APP_BACKEND}/purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify({
            cart: context.cartItems,
            name: context.contact?.name,
            email: context.contact?.email,
            phone: context.contact?.phone,
            address_1: context.contact?.address_0 + ' ' + context.contact?.address_1,
            address_2: context.contact?.address_2,
            city: context.contact?.city,
            state: context.contact?.state,
            zip: context.contact?.zip,
            country: context.contact?.country,
            service: context.shipping?.service
        }),
    })
        .then((response) => {
            return response.json()
        })
        .then((order) => {
            if (order.error)
                paymentError = order.error
            return order.id
        });

}

export function handlePaymentOrderApprove(data: any, context: Partial<StoreContextType>) {
    return fetch(`${process.env.REACT_APP_BACKEND}/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify({
            orderID: data.orderID
        })
    })
        .then((response) => {
            return response.json()
        }).then(function (order) {
            if (order.error) {
                handlePaymentError(order.error)
            } else {
                SweetAlert.fire({
                    icon: 'success',
                    title: 'Your order has been placed!',
                    showConfirmButton: false,
                    timer: 3000
                }).then(() => {
                    if (context.setIsCheckout !== undefined && context.setCartItems !== undefined) {
                        context.setCartItems([]);
                        context.setIsCheckout(false);
                    }
                })

                emailjs.send('service_f93v6k2', 'template_0jy2vhm', {
                    "user_email": context.contact?.email,
                    "user_name": context.contact?.username,
                    "tracking_url": order.tracker
                }, 'fsNy-2mIY3UcPyt1_')
            }
        });

}