import { useEffect, useState } from "react";

import StepWizard from "react-step-wizard";

import { StoreContact, StoreShippingService, StoreItem, StoreFilters, defaultStoreFilters } from 'types/Store'
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

  const [userContact, setUserContact] = useState<StoreContact>();
  const [userShipping, setUserShipping] = useState<StoreShippingService>();

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
      <div className='sidebar'>
        <StoreCart
          isCheckout={isCheckout}
          setIsCheckout={setIsCheckout}
          cartItems={cartItems}
          setCartItems={setCartItems}
          items={items}
          setItems={setItems} />
        <StoreFilter active={!isCheckout} filter={filter} setFilter={setFilter} />
      </div>
      <div className='content'>
          {isCheckout ?
            <div className='StoreCheckout'>
              <h2><span className="material-symbols-outlined">point_of_sale</span>Checkout:</h2>
              <StepWizard>
                <StoreCheckoutContact setContact={setUserContact}/>
                <StoreCheckoutShipping cartItems={cartItems} contact={userContact} setShipping={setUserShipping}/>
                <StoreCheckoutPayment cartItems={cartItems} setCartItems={setCartItems} setIsCheckout={setIsCheckout} contact={userContact} shipping={userShipping}/>
              </StepWizard>
            </div>
            :
            <StoreItems filter={filter} cartItems={cartItems} setCartItems={setCartItems} items={items} setItems={setItems} />
          }
      </div>

    </section>
  )
}

export default StoreFront;