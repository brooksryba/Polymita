import Header from 'components/Header'
import Footer from 'components/Footer'
import StoreFront from 'components/StoreFront'
import 'App.scss';

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