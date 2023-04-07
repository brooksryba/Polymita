import {
    PayPalScriptProvider,
} from "@paypal/react-paypal-js";

import { ButtonWrapper } from 'components/PayPal'

function StoreCart() {
    return (
        <div className="StoreCart">
            <span className="material-symbols-outlined">shopping_cart</span>
            <PayPalScriptProvider
                options={{
                    "client-id": "AdM6JkIjifqsGLOGVJ5N3CjAtTnTegXdd8w_jCJhS8x2RlRsfaDS_85a_UkQObCdnsQk9D7rL1xajRxs",
                    components: "buttons",
                    currency: "USD"
                }}
            >
				<ButtonWrapper
                    showSpinner={true}
                />
			</PayPalScriptProvider>
        </div>
    )
}

export default StoreCart;