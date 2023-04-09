import { useState, useRef, useEffect } from "react";


import { StoreItem, StoreEstimate, StoreCartProps, StoreShippingService } from 'types/Store'

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            REACT_APP_PAYPAL_CLIENT_ID: string;
        }
    }
}


const StoreCart: React.FC<StoreCartProps> = ({ isCheckout, setIsCheckout, items, setItems, cartItems, setCartItems }) => {
    const [estimate, setEstimate] = useState<StoreEstimate>();
    const estimateRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        doEstimate();
    }, [cartItems]);

    function removeItemFromCart(item: StoreItem) {
        const existingItemIndex = cartItems.findIndex(
            (cartItem) => cartItem.id === item.id
        );

        const existingItemRefIndex = items.findIndex(
            (cartItem) => cartItem.id === item.id
        );


        if (existingItemIndex !== -1) {
            const updatedCartItems = [...cartItems];
            const updatedItems = [...items];

            if (updatedCartItems[existingItemIndex].quantity > 1) {
                updatedCartItems[existingItemIndex].quantity--;
                if(updatedItems[existingItemRefIndex].quantity !== -1)
                    updatedItems[existingItemRefIndex].quantity++;
            } else {
                updatedCartItems.splice(existingItemIndex, 1);
                if(updatedItems[existingItemRefIndex].quantity !== -1)
                    updatedItems[existingItemRefIndex].quantity++;
            }

            if(updatedCartItems.length === 0) {
                setIsCheckout(false);
            }

            setCartItems(updatedCartItems);
            setItems(updatedItems);
        }
    }

    function doCheckout() {
        setIsCheckout(true);
    }

    function doStore() {
        setIsCheckout(false);
    }

    function doEstimate() {
        if (estimateRef.current && estimateRef.current.value) {
            const weight = cartItems.reduce((total, item) => total + item.weight, 0)
            fetch(`${process.env.REACT_APP_BACKEND}/estimate?dest=${estimateRef.current.value}&weight=${weight}`)
                .then((response) => response.json())
                .then((data: StoreEstimate) => {
                    setEstimate(data);
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                });
        }
    }

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    });

    return (
        <div className="StoreCart">
            <span className="material-symbols-outlined">shopping_cart</span>
            <h3>Cart:</h3>
            {cartItems.length > 0 ?
                <>
                    {cartItems.map((item: StoreItem) => (
                        <div key={item.id} className="item" >
                            <div className="image">
                                <img alt="" src={require.context("images/", true, /\.(webp)$/)(item.image)} />
                            </div>
                            <div className="data">
                                <span className="title">{item.name}</span><br />
                                Price: <span className="price">${item.price}</span><br />
                                Quantity: <span className="date">{item.quantity}</span>
                            </div>
                            <span onClick={() => removeItemFromCart(item)} className="remove material-symbols-outlined">delete</span>
                        </div>
                    ))}
                    {!isCheckout ? <>
                    <hr />
                    <div className="shipping">
                        <h4>Shipping:</h4>
                        <ul>
                        {(estimate ? estimate.rates
                                        .sort((a: StoreShippingService, b: StoreShippingService) => a.delivery_days - b.delivery_days)
                                        .map((rate: StoreShippingService) =>
                                            <li key={rate.service}>
                                                ({rate.delivery_days}-{Math.ceil(rate.delivery_days*1.5)} day) {rate.service} - {formatter.format(Number(rate.rate))}
                                            </li>
                        ) : <></>)}
                        </ul>
                        <div>
                            <label>ZIP:</label>
                            <input id="estimate" ref={estimateRef} type="text" size={5} />
                            <button id="doEstimate" onClick={() => doEstimate()}>Estimate</button>
                        </div>
                    </div>
                    <hr />
                    <div className="subtotal">
                        <h4>Sub-total:</h4>
                        <span>{formatter.format(Number(cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)))}</span>
                    </div>
                    </> :<>
                        </>
                    }

                </>
                :
                <>
                    <br />
                    <span>Cart is empty</span>
                </>
            }

            {!isCheckout ? <>
                {cartItems.length > 0 ?
                    <><hr/><button onClick={() => doCheckout()}>Checkout</button></> : <></>
                }
            </> : <>
                <hr/><button onClick={() => doStore()}>Return to Store</button>
            </>}
        </div>
    )
}

export default StoreCart;