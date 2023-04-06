import Header from 'components/Header'
import Footer from 'components/Footer'
import { ContactUs } from 'components/ContactUs';
import 'App.scss';

function ContactPage() {
    return (
        <div className="Contact">
            <Header />
            <section>
                <h3>Contact:</h3>
                <p>
                    Thank you for your interest in commissioning a custom piece of pottery, photography, or a digital painting from Brooks. Whether
                    you're looking for a unique gift or a one-of-a-kind addition to your home or office, Brooks is eager to collaborate with you to
                    bring your vision to life.<br/><br/>

                    To get started, please use the contact form below to describe your project in as much detail as possible. Please include any
                    particular concerns you may have about getting the project done right, such as color schemes, size specifications, or specific details
                    you'd like included. Brooks will work closely with you to ensure that the final product meets your expectations.<br/><br/>
                </p>
                <section className="info">
                    <h4>Notes:</h4>
                    <p className="accent">
                        For custom pottery pieces, Brooks will begin by discussing the design with you and creating a sketch or prototype for your approval.
                        Once the design is finalized, he will begin the process of throwing, trimming, and glazing the piece to perfection. For photography projects,
                        Brooks will work with you to select the perfect location and ensure that the lighting and composition are just right.
                        And for digital paintings, Brooks will use his technical skills and creativity to bring your vision to life on the screen.<br/><br/>

                        Please note that custom commissions may take several weeks or even months to complete, depending on the complexity of the project.
                        Brooks will provide you with a timeline and regular updates throughout the process to ensure that you are completely satisfied with
                        the final result. Thank you again for considering Brooks for your custom art project, and we look forward to working with you.
                    </p>
                </section>
                <ContactUs />
            </section>
            <Footer />
        </div>
    )
}

export default ContactPage;