import { StoreItem, StoreItemsProps } from 'types/Store'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


const StoreItems: React.FC<StoreItemsProps> = ({ items, setItems, cartItems, setCartItems }) => {
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
            if (updatedCartItems[existingItemIndex].quantity <= items[existingItemRefIndex].quantity) {
                updatedCartItems[existingItemIndex].quantity++;
                updatedItems[existingItemRefIndex].quantity--;
            } else {

            }
        } else {
            updatedCartItems.push({ ...item, quantity: 1 });
            updatedItems[existingItemRefIndex].quantity--;
        }
        setCartItems(updatedCartItems);
        setItems(updatedItems);
    }

    function showItemPopup(item: StoreItem) {
        MySwal.fire({
            title: `<strong>${item.name} <i>- $${item.price}</strong>`,
            html:`
                <i class="${(item.quantity === 1 ? "limited-stock" : "")}">${(item.quantity === 1 ? "Only" : "")} ${item.quantity} of this item in stock</i>
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
            imageUrl: require.context("images/pottery", false, /\.(webp)$/)(item.image),
            imageAlt: 'A tall image',
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

    return (
        <div className="StoreItems">
            {items.map((item: StoreItem) => ((item.quantity > 0 ?
            <div key={item.id} className="item" onClick={() => showItemPopup(item)}>
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
            : <span key={item.id}></span>)))}
        </div>
    );
}

export default StoreItems;