function StoreFilter() {
    return (
        <div className="StoreFilter">
            <span className="material-symbols-outlined">tune</span>
            <h3>Filters:</h3><br/>

            <label>
                <span className="material-symbols-outlined">
                    category
                </span>Product Type:</label><br />
            <select id="type">
                <option>All</option>
                <option>Paintings</option>
                <option>Pottery</option>
                <option>Photography</option>
            </select><br />
            <hr />

            <label><span className="material-symbols-outlined">
                price_change
            </span>Price Range:</label><br />
            <span className="price">$0</span>
            <input type="range" id="price" name="rangeInput" min="0" max="100" step="1" />
            <span className="price">$100</span><br/>
            <hr />

            <button>Reset</button>
        </div>
    )
}

export default StoreFilter;