import { Header, Heading, Footer } from 'components/Base'


function HomePage() {
    return (
        <div className="Home">
            <Header />
            <section>
                <Heading level={1}>Welcome to the Studio:</Heading>
                <p>
                    Welcome to Brooks' Studio, where the worlds of precision and creativity converge. We are thrilled to announce the launch of our brand new website,
                    showcasing a stunning portfolio of macro photography, handmade ceramics, and photorealistic digital paintings.<br/><br/>

                    We believe in the beauty of the unseen. Macro, from the Greek word "makros" meaning "large" or "long," allows us to explore
                    the world in a way that is often overlooked. Through our macro photography, we capture the intricate details of everyday objects, revealing a
                    world of texture, color, and complexity that is often hidden from view.<br/><br/>
                </p>
                <img src={require('images/Studio.webp')} alt="Studio"/>
                <p className="accent">
                    In addition to our photography, we offer handmade ceramics and photorealistic digital paintings, all crafted with the same level of precision
                    and attention to detail. We welcome you to use our contact form to inquire about commissioned work.
                    We are passionate about collaborating with our clients to create unique and personalized pieces.<br/><br/>

                    Don't forget to visit our gallery page to stay up-to-date with our latest projects and inspiration. You can also follow us on Instagram and
                    Facebook for even more behind-the-scenes glimpses into our process. Thank you for visiting Brooks' Studio, and we can't wait to hear from you.
                </p>
            </section>
            <Footer />
        </div>
    )
}

export default HomePage;