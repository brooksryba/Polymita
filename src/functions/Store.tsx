import SweetAlert from 'components/Swal';
import { StoreContextType, StoreFilters, StoreItem } from 'types/Store'


export function mapStoreItems(items: Array<StoreItem>, filter: StoreFilters) {
    return items
        .sort((a: StoreItem, b: StoreItem) => (
            a[filter.sort as keyof StoreItem] === b[filter.sort as keyof StoreItem] ? 0 :
            a[filter.sort as keyof StoreItem] < b[filter.sort as keyof StoreItem] ? -1 : 1))
        .filter((item: StoreItem) => (filter.type === "all" ? true : item.category === filter.type))
        .filter((item: StoreItem) => item.price <= filter.price)
}

export function handleAddItemToCart(item: StoreItem, context: StoreContextType) {
    const cartIndex = context.cartItems.findIndex((cartItem) => cartItem.id === item.id);
    const itemIndex = context.items.findIndex((cartItem) => cartItem.id === item.id);
    const updatedCartItems = [...context.cartItems];
    const updatedItems = [...context.items];

    if (cartIndex !== -1) {
        if (updatedCartItems[cartIndex].quantity <= context.items[itemIndex].quantity || context.items[itemIndex].quantity === -1) {
            updatedCartItems[cartIndex].quantity++;
            if(updatedItems[itemIndex].quantity !== -1)
                updatedItems[itemIndex].quantity--;
        } else {

        }
    } else {
        updatedCartItems.push({ ...item, quantity: 1 });
        if(updatedItems[itemIndex].quantity !== -1)
            updatedItems[itemIndex].quantity--;
    }

    context.setCartItems(updatedCartItems);
    context.setItems(updatedItems);
}

export function handleShowItemDetails(item: StoreItem, context: StoreContextType) {
    SweetAlert.fire({
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
            handleAddItemToCart(item, context)
            SweetAlert.fire({
                icon: 'success',
                title: 'Item added to the cart',
                showConfirmButton: false,
                timer: 1500
              })
        }
      })
}