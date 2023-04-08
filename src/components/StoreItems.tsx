import { StoreItem, StoreItemsProps } from 'types/Store'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


const StoreItems: React.FC<StoreItemsProps> = ({ filter, items, setItems, cartItems, setCartItems }) => {
    const MySwal = withReactContent(Swal)

    function addItemToCart(item: StoreItem) {
        const existingItemIndex = cartItems.findIndex(
            (cartItem) => cartItem.id === item.id
        );

        const existingItemRefIndex = items.findIndex(
            (cartItem) => cartItem.id === item.id
        );

        const updatedCartItems = [...cartItems];
        const updatedItems = [...items];
        if (existingItemIndex !== -1) {
            if (updatedCartItems[existingItemIndex].quantity <= items[existingItemRefIndex].quantity || items[existingItemRefIndex].quantity === -1) {
                updatedCartItems[existingItemIndex].quantity++;
                if(updatedItems[existingItemRefIndex].quantity !== -1)
                    updatedItems[existingItemRefIndex].quantity--;
            } else {

            }
        } else {
            updatedCartItems.push({ ...item, quantity: 1 });
            if(updatedItems[existingItemRefIndex].quantity !== -1)
                updatedItems[existingItemRefIndex].quantity--;
        }
        setCartItems(updatedCartItems);
        setItems(updatedItems);
    }

    function showItemPopup(item: StoreItem) {
        MySwal.fire({
            title: `<strong>${item.name} <i>- $${item.price}</strong>`,
            html:`
                <i class="stock ${(item.quantity === 1 ? "limited" : "")}">${(item.quantity === -1 ? "Unlimited" : (item.quantity === 1 ? `Only ${item.quantity}` : item.quantity))} of this item in stock</i>
                <ul>
                    <li>Weight: ${item.weight} lb(s).</li>
                    <li>Size: ${item.size}</li>
                    <li>Added: ${new Date(item.date*1000).toLocaleDateString('en-US', {
                        month: '2-digit',
                        day: '2-digit',
                        year: '2-digit',
                        })}</li>
                </ul>
            `,
            imageUrl: require.context("images/", true, /\.(webp)$/)(item.image),
            imageAlt: item.name,
            showCancelButton: true,
            confirmButtonText: 'Add to Cart',
          }).then((result) => {
            if (result.isConfirmed) {
                addItemToCart(item)
                MySwal.fire({
                    icon: 'success',
                    title: 'Item added to the cart',
                    showConfirmButton: false,
                    timer: 1500
                  })
            }
          })
    }


    const renderItems = items
        .sort((a: StoreItem, b: StoreItem) => (
            a[filter.sort as keyof StoreItem] === b[filter.sort as keyof StoreItem] ? 0 :
            a[filter.sort as keyof StoreItem] < b[filter.sort as keyof StoreItem] ? -1 : 1))
        .filter((item: StoreItem) => (filter.type === "all" ? true : item.category === filter.type))
        .filter((item: StoreItem) => item.price <= filter.price)
        .map((item: StoreItem) => ((item.quantity !== 0 ?
            <div key={item.id} className="item" onClick={() => showItemPopup(item)}>
            <div className="image">
                <img alt="" src={require.context("images/", true, /\.(webp)$/)(item.image)}/>
            </div>
            <hr/>
            <span className="title">{item.name}</span><br/>
            Price: <span className="price">${item.price}</span><br/>
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