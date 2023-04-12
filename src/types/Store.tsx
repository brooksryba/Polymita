import React from "react";

export const CurrencyType = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
});

export type StoreContact = {
    username: string;
    name: string;
    email: string;
    phone: string;
    address_0: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}

export const defaultStoreContact = {
    username: "",
    name: "",
    email: "",
    phone: "",
    address_0: "",
    address_1: "",
    address_2: "",
    city: "",
    state: "",
    zip: "",
    country: "",
}

export const defaultStoreAddress = {
    address_0: "",
    address_1: "",
    address_2: "",
    city: "",
    state: "",
    zip: "",
    country: "",
}


export type StoreShippingService = {
    carrier: string;
    rate: string;
    service: string;
    delivery_days: number;
}

export type StoreItem = {
    id: number;
    name: string;
    date: number;
    price: number;
    image: string;
    size: string;
    weight: number;
    quantity: number;
    category: string;
};

export type StoreFilters = {
    type: string,
    sort: string,
    price: number
}

export const defaultStoreFilters: StoreFilters = {
    type: "all",
    sort: "date",
    price: 100,
};

export type StoreEstimate = {
    rates: Array<StoreShippingService>;
};

export type StoreFilterProps = {
    active: boolean;
}

export interface StoreContextType {
    filter: StoreFilters;
    setFilter: Function;
    items: Array<StoreItem>;
    setItems: Function;
    cartItems: Array<StoreItem>;
    setCartItems: Function;
    contact: StoreContact | undefined;
    setContact: Function;
    shipping: StoreShippingService | undefined;
    setShipping: Function;
    isCheckout: boolean;
    setIsCheckout: Function;
}

export const StoreContext = React.createContext<StoreContextType>({
    filter: defaultStoreFilters,
    setFilter: (() => {}),
    items: [],
    setItems: (() => {}),
    cartItems: [],
    setCartItems: (() => {}),
    contact: undefined,
    setContact: (() => {}),
    shipping: undefined,
    setShipping: (() => {}),
    isCheckout: false,
    setIsCheckout: (() => {})
});