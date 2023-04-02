import Header from 'components/Header'
import Footer from 'components/Footer'
import 'App.scss';

function HomePage() {
    return (
        <div className="Home">
            <Header />
            <main>
                <section>
                    <h1>Welcome to our Website</h1>
                    <p>
                        Welcome to Brooks' Studio, where precision and creativity meet. We are excited to announce the launch of our brand new website,
                        featuring a stunning portfolio of macro photography, handmade ceramics, and photorealistic digital paintings. Soon, you will be
                        able to purchase prints and ceramics directly from our online shop. In the meantime, please use our contact form to inquire about
                        commissioned work. We would love to collaborate with you to create something beautiful and unique.<br/><br/>

                        Follow us on Instagram and Facebook to stay up-to-date with our latest projects and inspiration. Thank you for visiting our site,
                        and we look forward to connecting with you soon!
                    </p>
                </section>
            </main>
            <Footer />
        </div>
    )
}

export default HomePage;