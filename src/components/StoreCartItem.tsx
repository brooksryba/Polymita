import { FC } from 'react';

import { StoreItem } from 'types/Store';

import { MaterialIcon } from 'components/Base';


interface StoreCartItemProps {
    item: StoreItem,
    onDelete: Function
}

const StoreCartItem: FC<StoreCartItemProps> = ({ item, onDelete }) => {
    return (
        <div className="item" >
            <div className="image">
                <img alt="" src={require.context("images/", true, /\.(webp)$/)(item.image)} />
            </div>
            <div className="data">
                <span className="title">{item.name}</span><br />
                Price: <span className="price">${item.price}</span><br />
                Quantity: <span className="date">{item.quantity}</span>
            </div>
            <MaterialIcon name="delete" onClick={() => onDelete(item)} />
        </div>
    );
};

export default StoreCartItem;
