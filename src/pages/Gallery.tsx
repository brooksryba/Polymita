import { Header, Footer } from 'components/Base'
import GallerySet from 'components/GallerySet';


function GalleryPage() {
    return (
        <div className="Gallery">
            <Header/>
            <section>
                <h3>Paintings:</h3>
                <GallerySet source={require.context("images/painting", false, /\.(webp)$/)}/>
                <h3>Pottery:</h3>
                <GallerySet source={require.context("images/pottery", false, /\.(webp)$/)}/>
                <h3>Photography:</h3>
                <GallerySet source={require.context("images/photography", false, /\.(webp)$/)}/>
            </section>
            <Footer/>
        </div>
    )
}

export default GalleryPage;