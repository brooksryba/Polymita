import StoreFilter from 'components/StoreFilter'
import StoreItems from 'components/StoreItems'
import StoreCart from 'components/StoreCart'

function StoreFront() {
    return (
        <section className='Store'>
            <div className='sidebar'>
                <StoreFilter />
                <StoreCart />
            </div>
            <StoreItems />
        </section>
    )
}

export default StoreFront;