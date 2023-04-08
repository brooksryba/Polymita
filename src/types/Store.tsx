export type StoreItem = {
    id: number;
    name: string;
    date: number;
    price: number;
    image: string;
    size: string;
    weight: number;
    quantity: number;
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

export type StoreItemsProps = {
    items: Array<StoreItem>;
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