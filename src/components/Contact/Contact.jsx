import React from "react";
import "./Contact.css";
import { IoIosMail } from "react-icons/io";
import { FaFacebookMessenger } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { useRef } from "react";
import emailjs from "emailjs-com";

const Contact = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_zws9x5h",
        "template_70zjj0h",
        form.current,
        "bVAAc51xVAArNcmxj"
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );

    e.target.reset();
  };
  return (
    <div className="section_contact" id="contact">
      <h5>Get in Touch</h5>
      <h2>Contact Us</h2>

      <div className="container contact__container">
        <div className="contact__options">
          <article className="contact__option">
            <IoIosMail className="contact__option-icon" />
            <h4>Email</h4>
            <h5>iuhoosiertrack@gmail.com</h5>
            <a href="mailto:iuhoosiertrack@gmail.com">Send a message</a>
          </article>

          <article className="contact__option">
            <FaFacebookMessenger className="contact__option-icon" />
            <h4>Messenger</h4>
            <h5>HoosierTrack</h5>
            <a href="https://m.me/HoosierTrack">Send a message</a>
          </article>

          <article className="contact__option">
            <FaLinkedin className="contact__option-icon" />
            <h4>Linkedin</h4>
            <h5>HoosierTrack</h5>
            <a href="https://www.linkedin.com/in/HoosierTrack/">
              Send a message
            </a>
          </article>
        </div>
        <form  className="contact-form" ref={form} onSubmit={sendEmail}>
          <input
            type="text"
            name="name"
            placeholder="Your Full Name"
            required
          />
          <input type="email" name="email" placeholder="Your Email" required />
          <textarea
            name="message"
            rows="7"
            placeholder="Your Message"
            required></textarea>
          <button type="submit" className="btn btn-primary">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
