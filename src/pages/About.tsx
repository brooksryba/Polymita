import Header from 'components/Header'
import Footer from 'components/Footer'
import 'App.scss';

function AboutPage() {
    return (
        <div className="About">
            <Header />
            <section>
                <h3>Biography</h3>
                <h3>Artist Statement</h3>
                <h3>Process</h3>
            </section>
            <Footer />
        </div>
    )
}

export default AboutPage;