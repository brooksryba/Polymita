import {useEffect} from "react";

import {
    PayPalButtons,
    usePayPalScriptReducer
} from "@paypal/react-paypal-js";

const amount = "2";
const style = {};

export const ButtonWrapper: React.FC<{ showSpinner: boolean }> = ({ showSpinner }) => {
    // usePayPalScriptReducer can be use only inside children of PayPalScriptProviders
    // This is the main reason to wrap the PayPalButtons in a new component
    const [{ options, isPending }, dispatch] = usePayPalScriptReducer();

    useEffect(() => {
        dispatch({
            type: "resetOptions",
            value: {
                ...options,
            },
        });
    }, [showSpinner]);


    return (<>
            { (showSpinner && isPending) && <div className="spinner" /> }
            <PayPalButtons
                style={style}
                disabled={false}
                forceReRender={[amount, style]}
                fundingSource={undefined}
                createOrder={() => {
                    // Order is created on the server and the order id is returned
                    return fetch("http://localhost:5000/purchase", {
                        method: "POST",
                        headers: {"Content-Type": "application/json",},
                        body: JSON.stringify({
                            cart: [
                                {
                                sku: "YOUR_PRODUCT_STOCK_KEEPING_UNIT",
                                quantity: "YOUR_PRODUCT_QUANTITY",
                                },
                            ],
                        }),
                    })
                    .then((response) => response.json())
                    .then((order) => order.id);
                }}
                onApprove={function (data) {
                    return fetch("http://localhost:5000/confirm", {
                        method: "POST",
                        headers: {
                        "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            orderID: data.orderID
                        })
                    })
                    .then((response) => response.json());
                }}
            />
        </>
    );
}