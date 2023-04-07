export type StoreItem = {
    id: number;
    name: string;
    date: number;
    price: number;
    image: string;
    quantity: number;
};

export type CartItem = {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
};

export type StoreItemsProps = {
    items: Array<StoreItem>;
    cartItems: Array<CartItem>;
    setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
};

export type StoreCartProps = {
    cartItems: Array<CartItem>;
    setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
};