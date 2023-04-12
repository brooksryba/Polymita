import { useEffect, useState } from "react";

import StepWizard from "react-step-wizard";

import { StoreContext, StoreContact, StoreShippingService, StoreItem, StoreFilters, defaultStoreFilters } from 'types/Store'
import StoreFilter from 'components/StoreFilter'
import StoreItems from 'components/StoreItems'
import StoreCart from 'components/StoreCart'

import StoreCheckoutContact from 'components/StoreCheckoutContact'
import StoreCheckoutShipping from "./StoreCheckoutShipping";
import StoreCheckoutPayment from "./StoreCheckoutPayment";


function StoreFront() {
  const [isCheckout, setIsCheckout] = useState<boolean>(false);
  const [filter, setFilter] = useState<StoreFilters>(defaultStoreFilters);
  const [items, setItems] = useState<StoreItem[]>([]);
  const [cartItems, setCartItems] = useState<StoreItem[]>([]);
  const [contact, setContact] = useState<StoreContact>();
  const [shipping, setShipping] = useState<StoreShippingService>();

  const context = {filter: filter, setFilter: setFilter,
                  items: items, setItems: setItems,
                  cartItems: cartItems, setCartItems: setCartItems,
                 contact: contact, setContact: setContact,
                shipping: shipping, setShipping: setShipping,
              isCheckout: isCheckout, setIsCheckout: setIsCheckout}

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND}/list`)
      .then((response) => response.json())
      .then((data: StoreItem[]) => {
        setItems(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <section className='Store'>
      <StoreContext.Provider value={context}>
        <div className='sidebar'>
          <StoreCart />
          <StoreFilter active={!isCheckout}/>
        </div>
        <div className='content'>
            {isCheckout ?
              <div className='StoreCheckout'>
                <h2><span className="material-symbols-outlined">point_of_sale</span>Checkout:</h2>
                <StepWizard>
                  <StoreCheckoutContact />
                  <StoreCheckoutShipping />
                  <StoreCheckoutPayment />
                </StepWizard>
              </div>
              :
              <StoreItems  />
            }
        </div>
      </StoreContext.Provider>
    </section>
  )
}

export default StoreFront;