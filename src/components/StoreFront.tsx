import { useEffect, useState } from "react";

import { StoreItem } from 'types/Store'
import StoreFilter from 'components/StoreFilter'
import StoreItems from 'components/StoreItems'
import StoreCart from 'components/StoreCart'


function StoreFront() {
    const [items, setItems] = useState<StoreItem[]>([]);
    const [cartItems, setCartItems] = useState<StoreItem[]>([]);

    useEffect(() => {
      fetch("http://localhost:5000/list")
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
                <StoreFilter />
                <StoreCart cartItems={cartItems} setCartItems={setCartItems}/>
            </div>
            <StoreItems cartItems={cartItems} setCartItems={setCartItems} items={items}/>
        </section>
    )
}

export default StoreFront;