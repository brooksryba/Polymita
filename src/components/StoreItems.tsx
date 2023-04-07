import { StoreItem, StoreItemsProps } from 'types/Store'

const StoreItems: React.FC<StoreItemsProps> = ({ items, cartItems, setCartItems }) => {
    function addItemToCart(item: StoreItem) {
        const existingItemIndex = cartItems.findIndex(
            (cartItem) => cartItem.id === item.id
        );

        const existingItemRefIndex = items.findIndex(
            (cartItem) => cartItem.id === item.id
        );

        const updatedCartItems = [...cartItems];
        if (existingItemIndex !== -1) {
            if (updatedCartItems[existingItemIndex].quantity < items[existingItemRefIndex].quantity) {
                updatedCartItems[existingItemIndex].quantity++;
            } else {

            }
        } else {
            updatedCartItems.push({ ...item, quantity: 1 });
        }
        setCartItems(updatedCartItems);
    }

    return (
        <div className="StoreItems">
            {items.map((item: StoreItem) => (
            <div key={item.id} className="item" onClick={() => addItemToCart(item)}>
                <div className="image">
                    <img alt="" src={require.context("images/pottery", false, /\.(webp)$/)(item.image)}/>
                </div>
                <hr/>
                <span className="title">{item.name}</span><br/>
                Price: <span className="price">${item.price}</span><br/>
                Added: <span className="date">{new Date(item.date*1000).toLocaleDateString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: '2-digit',
                    })}</span>
            </div>
            ))}
        </div>
    );
}

export default StoreItems;