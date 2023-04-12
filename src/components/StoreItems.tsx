import { useContext } from 'react';
import { StoreContext, StoreItem } from 'types/Store'

import { mapStoreItems, handleShowItemDetails } from 'functions/Store';


const StoreItems: React.FC = () => {
    const context = useContext(StoreContext);
    const { items, filter } = context;

    const onClick = ((item: StoreItem) => { handleShowItemDetails(item, context) })

    const renderItems = mapStoreItems(items, filter)
        .map((item: StoreItem) => ((item.quantity !== 0 ?
            <div key={item.id} className="item" onClick={() => onClick(item)}>
                <div className="image">
                    <img alt="" src={require.context("images/", true, /\.(webp)$/)(item.image)} />
                </div>
                <hr />
                <span className="title">{item.name}</span><br />
                Price: <span className="price">${item.price}</span><br />
                Size: <span className="size">{item.size}</span>
            </div>
            : <span key={item.id}></span>)));

    return (
        <div className="StoreItems">
            {renderItems.length > 0 ? renderItems : (items.length === 0 ?
                <div>Store is currently empty. Please check back soon for a restock!</div> :
                <div>No items matching filter criteria.</div>
            )}
        </div>
    );
}

export default StoreItems;