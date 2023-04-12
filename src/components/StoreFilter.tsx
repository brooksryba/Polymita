import { useContext } from "react";

import { StoreContext, StoreFilterProps, defaultStoreFilters } from "types/Store";


const StoreFilter: React.FC<StoreFilterProps> = ({ active }) => {
    const { filter, setFilter } = useContext(StoreContext);

    return (
        <div className={active ? "StoreFilter" : "StoreFilter disable"}>
            <span className="material-symbols-outlined">tune</span>
            <h3>Filters:</h3><br />

            <label>
                <span className="material-symbols-outlined">
                    category
                </span>Product Type:</label><br />
                <select id="type" value={filter.type} onChange={(e) => setFilter({...filter, type: e.target.value})}>
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
                <select id="sort" value={filter.sort} onChange={(e) => setFilter({...filter, sort: e.target.value})}>
                <option value="date">Release Date</option>
                <option value="price">Price</option>
                <option value="category">Type</option>
            </select><br />
            <hr />


            <label><span className="material-symbols-outlined">
                price_change
            </span>Price Range:</label><br />
            <span className="price">$0</span>
            <input  type="range" id="price" name="rangeInput" value={filter.price} min="0" max="100" step="1" onChange={(e) => setFilter({...filter, price: Number(e.target.value)})} />
            <span className="price">${filter.price}</span><br />
            <hr />

            <button className="half" onClick={() => setFilter(defaultStoreFilters)}>Reset</button>
        </div>
    )
}

export default StoreFilter;