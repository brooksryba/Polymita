export const CurrencyType = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
});

export type StoreContact = {
    username: string;
    name: string;
    email: string;
    phone: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
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
    filter: StoreFilters;
    setFilter: React.Dispatch<React.SetStateAction<StoreFilters>>;
}

export type StoreItemsProps = {
    items: Array<StoreItem>;
    filter: StoreFilters;
    setItems: React.Dispatch<React.SetStateAction<StoreItem[]>>;
    cartItems: Array<StoreItem>;
    setCartItems: React.Dispatch<React.SetStateAction<StoreItem[]>>;
};

export type StoreCartProps = {
    isCheckout: boolean;
    setIsCheckout: React.Dispatch<React.SetStateAction<boolean>>;
    items: Array<StoreItem>;
    setItems: React.Dispatch<React.SetStateAction<StoreItem[]>>;
    cartItems: Array<StoreItem>;
    setCartItems: React.Dispatch<React.SetStateAction<StoreItem[]>>;
};

export type StoreCheckoutContactProps = {
    setContact: React.Dispatch<React.SetStateAction<StoreContact>>;
}

export type StoreCheckoutShippingProps = {
    cartItems: Array<StoreItem>;
    contact: StoreContact | undefined;
    setShipping: React.Dispatch<React.SetStateAction<StoreShippingService>>;
}

export type StoreCheckoutPaymentProps = {
    cartItems: Array<StoreItem>;
    contact: StoreContact | undefined;
    shipping: StoreShippingService | undefined;
    setCartItems: React.Dispatch<React.SetStateAction<StoreItem[]>>;
    setIsCheckout: React.Dispatch<React.SetStateAction<boolean>>;
}