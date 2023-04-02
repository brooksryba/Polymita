import Header from 'components/Header'
import Footer from 'components/Footer'
import 'App.scss';

function AboutPage() {
    return (
        <div className="About">
            <Header />
            <section>
                <h3>Biography</h3>
                <p>Brooks was born in and currently resides in south-east Michigan. He is a self-taught Software Engineer with a background in graphics design,
                    which lead to a passion for fine arts. His past experience and ability to learn new technology ensures reliable, timely delivery of projects.
                    In his ceramics, digital paintings, and macro photography he combines his love for technical precision with the fluidity of art. Brooks has
                    studied ceramics online and under Kay Yourist of the Yourist Pottery Studio in Ann Arbor, MI. With a proficient skill range and a desire to
                    learn, he has created an at home studio to develop his craft and sell work to the public.<br/>
                </p>
                <h3>Artist Statement</h3>
                <p>
                    As an artist, Brooks is driven by a passion for precision and technical design, which is evident in their diverse body of work. From macro
                    photography to handmade ceramic mugs to photorealistic digital paintings, they strive to create pieces that are not only visually striking
                    but also meticulously crafted.<br/><br/>

                    His love for technical design is reflected in their macro photography, where they explore the intricate details of the natural world. Through
                    their lens, they capture the smallest of details, revealing the beauty and complexity of everyday objects. In their handmade ceramic mugs,
                    they combine their technical skills with a love for tactile craftsmanship. Each mug is carefully crafted, reflecting their commitment to precision
                    and attention to detail.<br/><br/>

                    Finally, Brooks' photorealistic digital paintings showcase their technical abilities in a different medium. Using digital tools, they create
                    hyper-realistic images that challenge the viewer's perceptions and invite them to engage with the work on a deeper level. Whether through
                    their macro photography, handmade ceramics, or digital paintings, Brooks' goal as an artist is to create pieces that are both visually
                    stunning and technically impressive. They are constantly striving to push the boundaries of their craft and explore new ways to express
                    themselves through their art.
                </p>
                <h3>Process</h3>
                <p>
                    As a ceramic artist working from their home studio, Brooks' process is deeply rooted in the tactile nature of working with clay. Using their
                    Skutt-818 kiln and spare bedroom turned pottery studio, they are able to fully immerse themselves in the creative process. Each piece they create
                    begins on the wheel, where they carefully mold and shape the clay into the desired form. From there, they move on to the glazing process, carefully
                    selecting colors and finishes that will enhance the piece's texture and shape.<br/><br/>

                    When it's time to fire the kiln, Brooks approaches the process with a mixture of excitement and anticipation. Watching the transformation of the
                    pieces as they are fired is a deeply satisfying experience, and they are always thrilled to see the final product emerge from the kiln. Working
                    from their home studio allows them to fully engage with the creative process on their own terms, without the distractions or limitations of a
                    traditional studio. Whether they are experimenting with new glazes or perfecting their throwing technique, Brooks is constantly pushing themselves
                    to explore new possibilities and create work that is both beautiful and functional.
                </p>
            </section>
            <Footer />
        </div>
    )
}

export default AboutPage;