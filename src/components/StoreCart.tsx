import { useState } from "react";

import {
    PayPalScriptProvider,
} from "@paypal/react-paypal-js";

import { ButtonWrapper } from 'components/PayPal'

import { StoreItem, StoreCartProps } from 'types/Store'

const StoreCart: React.FC<StoreCartProps> = ({ cartItems, setCartItems }) => {
    const [isCheckout, setIsCheckout] = useState<boolean>(false);

    function removeItemFromCart(item: StoreItem) {
        const existingItemIndex = cartItems.findIndex(
            (cartItem) => cartItem.id === item.id
        );

        if (existingItemIndex !== -1) {
        const updatedCartItems = [...cartItems];
        if (updatedCartItems[existingItemIndex].quantity > 1) {
            updatedCartItems[existingItemIndex].quantity--;
        } else {
            updatedCartItems.splice(existingItemIndex, 1);
        }
        setCartItems(updatedCartItems);
        }
    }

    function doCheckout() {
        setIsCheckout(true);
    }

    return (
        <div className="StoreCart">
            <span className="material-symbols-outlined">shopping_cart</span><h3>Cart:</h3>
            {cartItems.length > 0 ?
                <>
                    {cartItems.map((item: StoreItem) => (
                        <div key={item.id} className="item" onClick={() => removeItemFromCart(item)}>
                            <div className="image">
                                <img alt="" src={require.context("images/pottery", false, /\.(webp)$/)(item.image)}/>
                            </div>
                            <div className="data">
                                <span className="title">{item.name}</span><br/>
                                Price: <span className="price">${item.price}</span><br/>
                                Quantity: <span className="date">{item.quantity}</span>
                            </div>
                        </div>
                        ))}
                    <hr/>
                    {isCheckout ?
                    <PayPalScriptProvider
                        options={{
                            "client-id": "AdM6JkIjifqsGLOGVJ5N3CjAtTnTegXdd8w_jCJhS8x2RlRsfaDS_85a_UkQObCdnsQk9D7rL1xajRxs",
                            components: "buttons",
                            currency: "USD"
                        }}
                    >
                        <ButtonWrapper
                            cartItems={cartItems}
                            showSpinner={true}
                        />
                    </PayPalScriptProvider>
                    : <button onClick={()=> doCheckout()}>Checkout</button>}
                </>

            :
                <><br/><span>Cart is empty</span></>
            }

        </div>
    )
}

export default StoreCart;