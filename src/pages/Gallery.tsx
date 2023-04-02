import Painting from '../components/Painting';
import Photography from 'components/Photography';
import Pottery from 'components/Pottery';
import Header from 'components/Header'
import Footer from 'components/Footer'
import 'App.scss';


function GalleryPage() {
    return (
        <div className="Gallery">
            <Header/>
            <h3>Paintings:</h3>
            <Painting/>
            <h3>Pottery:</h3>
            <Pottery/>
            <h3>Photography:</h3>
            <Photography/>
            <Footer/>
        </div>
    )
}

export default GalleryPage;