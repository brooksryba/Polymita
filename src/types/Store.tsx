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

export type StoreEstimateRate = {
    carrier: string;
    rate: string;
    service: string;
    delivery_days: number;
}

export type StoreEstimate = {
    rates: Array<StoreEstimateRate>;
};

export type StoreFilterProps = {
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
    items: Array<StoreItem>;
    setItems: React.Dispatch<React.SetStateAction<StoreItem[]>>;
    cartItems: Array<StoreItem>;
    setCartItems: React.Dispatch<React.SetStateAction<StoreItem[]>>;
};