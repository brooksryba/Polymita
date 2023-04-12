import { Header, Footer } from 'components/Base'
import StoreFront from 'components/StoreFront'


function StorePage() {
    return (
        <div className="Store">
            <Header/>
            <StoreFront/>
            <Footer/>
        </div>
    )
}

export default StorePage;