function StoreItems() {
    return (
       <div className="StoreItems">
        <div className="item">
            <img alt="" src={require("images/pottery/IMG_6770.webp")}/>
            <hr/>
            <span className="title">Mossy Oak Mug</span><br/>
            Price: <span className="price">$30.00</span><br/>
            Added: <span className="date">04/05/2023</span>
        </div>
        <div className="item">
            <img alt="" src={require("images/pottery/IMG_6763.webp")}/>
            <hr/>
            <span className="title">Cobalt Dreams Mug</span><br/>
            Price: <span className="price">$30.00</span><br/>
            Added: <span className="date">04/05/2023</span>
        </div>
        <div className="item">
            <img alt="" src={require("images/pottery/IMG_6776.webp")}/>
            <hr/>
            <span className="title">Inkwell Mug</span><br/>
            Price: <span className="price">$30.00</span><br/>
            Added: <span className="date">04/05/2023</span>
        </div>
        <div className="item">
            <img alt="" src={require("images/pottery/IMG_6797.webp")}/>
            <hr/>
            <span className="title">Ocean Sands Mug</span><br/>
            Price: <span className="price">$30.00</span><br/>
            Added: <span className="date">04/05/2023</span>
        </div>
        <div className="item">
            <div className="image">
                <img alt="" src={require("images/pottery/IMG_6799_.webp")}/>
            </div>
            <hr/>
            <span className="title">Toasted Mallow Planter</span><br/>
            Price: <span className="price">$30.00</span><br/>
            Added: <span className="date">04/05/2023</span>
        </div>
        <div className="item">
            <img alt="" src={require("images/pottery/IMG_6792.webp")}/>
            <hr/>
            <span className="title">Autumn Rush Mug</span><br/>
            Price: <span className="price">$30.00</span><br/>
            Added: <span className="date">04/05/2023</span>
        </div>
        </div>
    )
}

export default StoreItems;