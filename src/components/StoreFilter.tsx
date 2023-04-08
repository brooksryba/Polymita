import { useRef, useState, useEffect } from "react";

import { StoreFilterProps } from "types/Store";

const StoreFilter: React.FC<StoreFilterProps> = ({ filter, setFilter }) => {
    const priceRef = useRef<HTMLInputElement>(null);
    const [price, setPrice] = useState(filter.price);
    const [sort, setSort] = useState(filter.sort);
    const [type, setType] = useState(filter.type);

    useEffect(() => {
        const newFilter = { ...filter };
        newFilter.type = type;
        newFilter.sort = sort;
        newFilter.price = Number(price);
        setFilter(newFilter);
    }, [price, sort, type]);

    return (
        <div className="StoreFilter">
            <span className="material-symbols-outlined">tune</span>
            <h3>Filters:</h3><br />

            <label>
                <span className="material-symbols-outlined">
                    category
                </span>Product Type:</label><br />
            <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="all">All</option>
                <option value="painting">Paintings</option>
                <option value="pottery">Pottery</option>
                <option value="photography">Photography</option>
            </select><br />
            <hr />

            <label>
                <span className="material-symbols-outlined">
                    sort_by_alpha
                </span>Sort By:</label><br />
            <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="date">Release Date</option>
                <option value="price">Price</option>
            </select><br />
            <hr />


            <label><span className="material-symbols-outlined">
                price_change
            </span>Price Range:</label><br />
            <span className="price">$0</span>
            <input ref={priceRef} type="range" id="price" name="rangeInput" defaultValue={100} min="0" max="100" step="1" onChange={(e) => setPrice(Number(e.target.value))} />
            <span className="price">${price}</span><br />
            <hr />

            <button>Reset</button>
        </div>
    )
}

export default StoreFilter;