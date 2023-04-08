import { useEffect, useState } from "react";

import { StoreItem, StoreFilters, defaultStoreFilters } from 'types/Store'
import StoreFilter from 'components/StoreFilter'
import StoreItems from 'components/StoreItems'
import StoreCart from 'components/StoreCart'


function StoreFront() {
    const [filter, setFilter] = useState<StoreFilters>(defaultStoreFilters);
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
                <StoreFilter filter={filter} setFilter={setFilter} />
                <StoreCart cartItems={cartItems} setCartItems={setCartItems} items={items} setItems={setItems}/>
            </div>
            <StoreItems filter={filter} cartItems={cartItems} setCartItems={setCartItems} items={items} setItems={setItems}/>
        </section>
    )
}

export default StoreFront;