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
                    <p>We are a company that specializes in providing high-quality products and services to our customers. Our mission is to exceed your expectations and provide you with the best possible experience.</p>
                </section>
                <section>
                    <h2>Featured Products</h2>
                    <article>
                        <h3>Product 1</h3>
                        <img src="product1.jpg" alt="Product 1" />
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla auctor magna a lacus ultrices convallis.</p>
                        <a href="/">Learn more</a>
                    </article>
                    <article>
                        <h3>Product 2</h3>
                        <img src="product2.jpg" alt="Product 2" />
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla auctor magna a lacus ultrices convallis.</p>
                        <a href="/">Learn more</a>
                    </article>
                    <article>
                        <h3>Product 3</h3>
                        <img src="product3.jpg" alt="Product 3" />
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla auctor magna a lacus ultrices convallis.</p>
                        <a href="/">Learn more</a>
                    </article>
                </section>
            </main>
            <Footer />
        </div>
    )
}

export default HomePage;