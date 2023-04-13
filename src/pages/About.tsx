import { Header, Footer } from 'components/Base'


function AboutPage() {
    return (
        <div className="About">
            <Header />
            <section>
                <h3>Biography:</h3>
                <p>
                    Brooks, who currently resides in south-east Michigan, was inspired to pursue art from a young age thanks to the encouragement and support
                    of his parents. Though he is a self-taught Software Engineer with a background in graphics design, his passion for fine arts has led him to
                    explore ceramics, digital paintings, and macro photography. With his ability to quickly learn and adapt to new technology, Brooks is able to
                    reliably deliver projects on time.<br/><br/>

                    In his creative work, Brooks seamlessly combines technical precision with the fluidity of art. He has studied ceramics both online and under
                    the guidance of Kay Yourist of the Yourist Pottery Studio in Ann Arbor, MI. His proficient skill range and desire to continue learning have
                    led him to create an at-home studio, where he is able to hone his craft and offer his work for sale to the public.
                </p>
                <h3>Artist Statement:</h3>
                <p className="accent">
                    As an artist, Brooks is driven by a passion for precision and technical design, which is evident in his diverse body of work. From macro
                    photography to handmade ceramic mugs to photorealistic digital paintings, he strives to create pieces that are not only visually striking
                    but also meticulously crafted.<br/><br/>

                    His love for technical design is reflected in his macro photography, where he explores the intricate details of the natural world. Through
                    the macro lens, Brooks captures the smallest of details, revealing the beauty and complexity of everyday objects. In his handmade ceramic mugs,
                    he combines his technical skills with a love for tactile craftsmanship. Each mug is carefully crafted, reflecting his commitment to precision
                    and attention to detail.<br/><br/>

                    Finally, Brooks' photorealistic digital paintings showcase his technical abilities in a different medium. Using digital tools, he creates
                    hyper-realistic images that challenge the viewer's perceptions and invite them to engage with the work on a deeper level. Whether through
                    his macro photography, handmade ceramics, or digital paintings, Brooks' goal as an artist is to create pieces that are both visually
                    stunning and technically impressive. Brooks is constantly striving to push the boundaries of his craft and explore new ways to express
                    themselves through his art.
                </p>
                <h3>Process:</h3>
                <p className="accentSecondary">
                    As a ceramic artist working from a home studio, Brooks' process is deeply rooted in the tactile nature of working with clay. Using a
                    Skutt-818 kiln and spare bedroom turned pottery studio, he is able to fully immerse themselves in the creative process. Each piece Brooks create
                    begins on the wheel, where he carefully mold and shape the clay into the desired form. From there, he moves on to the glazing process, selecting colors
                    and finishes that will enhance the piece's texture and shape.<br/><br/>

                    When it's time to fire the kiln, Brooks approaches the process with a mixture of excitement and anticipation. Watching the transformation of the
                    pieces as they are fired is a deeply satisfying experience, and he is always thrilled to see the final product emerge from the kiln. Working
                    from the home studio allows Brooks to fully engage with the creative process on his own terms, without the distractions or limitations of a
                    traditional studio. Whether experimenting with new glazes or perfecting his throwing technique, Brooks is constantly pushing themselves
                    to explore new possibilities and create work that is both beautiful and functional.
                </p>
            </section>
            <Footer />
        </div>
    )
}

export default AboutPage;