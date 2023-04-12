import React, { useRef, useState } from 'react';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';


export const ContactUs: React.FC = () => {
    const form = useRef<HTMLFormElement>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        emailjs.sendForm('service_f93v6k2', 'template_bvxc3bv', form.current!, 'fsNy-2mIY3UcPyt1_')
            .then((result: EmailJSResponseStatus) => {
                console.log(result.text);
                setIsSubmitted(true);
            }, (error: EmailJSResponseStatus) => {
                console.log(error.text);
                alert("Could not submit the form! Please try again later")
            });
    };

    return (
        <>
            {isSubmitted ? (
                <p className='submitted'>Thank you for your message! A confirmation email has been delivered to your inbox.</p>
            ) : (
                <form id="ContactForm" ref={form} onSubmit={sendEmail}>
                    <label>Name:</label>
                    <input type="text" name="user_name" /><br />
                    <label>Email:</label>
                    <input type="email" name="user_email" /><br />
                    <label>Message:</label>
                    <textarea name="message" /><br />
                    <div className="submit">
                        <input type="submit" value="Send" />
                    </div>
                </form>
            )}
        </>
    );
};