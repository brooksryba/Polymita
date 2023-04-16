import { Header, Heading, Footer } from 'components/Base'
import GallerySet from 'components/GallerySet';


function GalleryPage() {
    return (
        <div className="Gallery">
            <Header/>
            <section>
                <Heading icon="" level={1}>Welcome to the Gallery:</Heading>
                <p>
                    Welcome to the gallery, where you'll find a collection of Brooks' favorite photos, pottery, and paintings.
                    As an artist, Brooks has always been captivated by the beauty of the world around him, and is thrilled to be
                    able to share some of that beauty with you.<br/><br/>

                    To view an item in more detail, simply click on it to enlarge the image. Please note that all photos are copyright
                    the owner, and you must seek approval before republishing or printing them. We take great pride in our work and would
                    appreciate your cooperation in ensuring that our images are used with respect and in accordance with copyright laws.
                </p>
                <hr/>
                <Heading icon="brush" level={2}>Paintings:</Heading>
                <GallerySet source={require.context("images/painting", false, /\.(webp)$/)}/>
                <hr/>
                <Heading icon="coffee" level={2}>Pottery:</Heading>
                <GallerySet source={require.context("images/pottery", false, /\.(webp)$/)}/>
                <hr/>
                <Heading icon="camera" level={2}>Photography:</Heading>
                <GallerySet source={require.context("images/photography", false, /\.(webp)$/)}/>
            </section>
            <Footer/>
        </div>
    )
}

export default GalleryPage;