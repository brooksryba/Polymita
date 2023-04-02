import Header from 'components/Header'
import Footer from 'components/Footer'
import { ContactUs } from 'components/ContactUs';
import 'App.scss';

function ContactPage() {
    return (
        <div className="Contact">
            <Header />
            <ContactUs />
            <Footer />
        </div>
    )
}

export default ContactPage;