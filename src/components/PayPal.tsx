import {useEffect} from "react";

import {
    PayPalButtons,
    usePayPalScriptReducer
} from "@paypal/react-paypal-js";


const amount = "2";
const style = {};

export const ButtonWrapper: React.FC<{ showSpinner: boolean, cartItems: any }> = ({ showSpinner, cartItems }) => {
    const [{ options, isPending }, dispatch] = usePayPalScriptReducer();

    useEffect(() => {
        dispatch({
            type: "resetOptions",
            value: {
                ...options,
            },
        });
    }, [showSpinner, dispatch, options]);


    return (<>
            { (showSpinner && isPending) && <div className="spinner" /> }
            <PayPalButtons
                style={style}
                disabled={false}
                forceReRender={[amount, style]}
                fundingSource={undefined}
                createOrder={() => {
                    return fetch("http://localhost:5000/purchase", {
                        method: "POST",
                        headers: {"Content-Type": "application/json",},
                        body: JSON.stringify({
                            cart: cartItems,
                            zip: "95131",
                            service: "Priority"
                        }),
                    })
                    .then((response) => response.json())
                    .then((order) => order.id);
                }}
                onApprove={function (data) {
                    return fetch("http://localhost:5000/confirm", {
                        method: "POST",
                        headers: {"Content-Type": "application/json",},
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