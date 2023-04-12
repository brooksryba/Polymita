import { StoreItem, StoreCartProps } from 'types/Store'

import MaterialIcon from 'components/MaterialIcon';
import StoreCartItem from 'components/StoreCartItem';
import { Optional } from 'components/Base';

import { getCartTotal, removeItemFromCart } from 'functions/Cart';


const StoreCart: React.FC<StoreCartProps> = ({ isCheckout, setIsCheckout, items, setItems, cartItems, setCartItems }) => {
    const updateCart = (item: StoreItem) => removeItemFromCart(item, items, cartItems, setIsCheckout, setCartItems, setItems);

    return (
        <div className="StoreCart">
            <MaterialIcon name="shopping_cart" />
            <h3>Cart:</h3>
            <Optional condition={cartItems.length > 0}>
                {cartItems.map((item: StoreItem) => (<StoreCartItem item={item} onDelete={updateCart} />))}

                <Optional condition={!isCheckout}>
                    <hr />
                    <div className="subtotal">
                        <h4>Sub-total:</h4>
                        <span>{getCartTotal(cartItems)}</span>
                    </div>
                    <hr />
                </Optional>
            </Optional>

            <Optional condition={cartItems.length == 0 && !isCheckout}>
                <div>Cart is empty</div>
            </Optional>

            <Optional condition={cartItems.length > 0 && !isCheckout}>
                <button onClick={() => setIsCheckout(true)}>Checkout</button>
            </Optional>

            <Optional condition={isCheckout}>
                <button onClick={() => setIsCheckout(false)}>Return to Store</button>
            </Optional>
        </div>
    )
}

export default StoreCart;