import { useContext } from 'react';
import { StoreContext, StoreItem } from 'types/Store'

import StoreCartItem from 'components/StoreCartItem';
import { Heading, Optional, MaterialButton } from 'components/Base';

import { getCartTotal, removeItemFromCart } from 'functions/Cart';


const StoreCart: React.FC = () => {
    const context = useContext(StoreContext);
    const { cartItems, isCheckout, setIsCheckout } = context;

    const updateCart = (item: StoreItem) => removeItemFromCart(item, context);

    return (
        <div className="StoreCart">
            <Heading level={3} icon="shopping_cart">Cart:</Heading>

            <Optional condition={cartItems.length > 0}>
                {cartItems.map((item: StoreItem) => (<StoreCartItem key={item.id} item={item} onDelete={updateCart} />))}
                <hr />
                <Optional condition={!isCheckout}>
                    <div className="subtotal">
                        <h4>Sub-total:</h4>
                        <span>{getCartTotal(cartItems)}</span>
                    </div>
                    <hr />
                </Optional>
            </Optional>

            <Optional condition={cartItems.length === 0 && !isCheckout}>
                <div>Cart is empty</div>
            </Optional>

            <Optional condition={cartItems.length > 0 && !isCheckout}>
                <MaterialButton className="blue" name="shopping_bag" onClick={() => setIsCheckout(true)}>Checkout</MaterialButton>
            </Optional>

            <Optional condition={isCheckout}>
                <MaterialButton name="arrow_back" onClick={() => setIsCheckout(false)}>Return to Store</MaterialButton>
            </Optional>
        </div>
    )
}

export default StoreCart;