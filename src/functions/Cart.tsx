import { StoreItem, CurrencyType } from 'types/Store';

export function getCartTotal(cartItems: Array<StoreItem>) {
    const reducer = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    return CurrencyType.format(Number(reducer));
}

export function removeItemFromCart(item: StoreItem, items: Array<StoreItem>, cartItems: Array<StoreItem>,
                            setIsCheckout: Function, setCartItems: Function, setItems: Function) {
    const cartIndex = cartItems.findIndex((ref) => ref.id === item.id);
    const itemIndex = items.findIndex((ref) => ref.id === item.id);

    if (cartIndex !== -1) {
        const updatedCart = [...cartItems];
        const updatedItems = [...items];

        if (updatedCart[cartIndex].quantity > 1) {
            updatedCart[cartIndex].quantity--;
            if (updatedItems[itemIndex].quantity !== -1)
                updatedItems[itemIndex].quantity++;
        } else {
            updatedCart.splice(cartIndex, 1);
            if (updatedItems[itemIndex].quantity !== -1)
                updatedItems[itemIndex].quantity++;
        }

        if (updatedCart.length === 0) { setIsCheckout(false); }
        setCartItems(updatedCart);
        setItems(updatedItems);
    }
}
