import React from "react";
import "./About.css";
import ME from "../../resources/Hoosier Track.jpg";
import { RiAwardFill } from "react-icons/ri";
import { ImUsers } from "react-icons/im";
import { VscFolderLibrary } from "react-icons/vsc";

const About = () => {
  return (
    <div className="section_about" id="about">
      <h5>Get to Know</h5>
      <h2>About Us</h2>

      <div className="container about__container">
        <div className="about__me">
          <div className="about__me-image">
            <img src={ME} alt="About Image" />
          </div>
        </div>

        <div className="about__content">
          <div className="about__cards">
            <article className="about__card">
              <RiAwardFill className="about__icon" />
              <h5>Experienced Team</h5>
              <small></small>
            </article>
            <article className="about__card">
              <ImUsers className="about__icon" />
              <h5>Deliveries Completed</h5>
              <small>100000+ Worldwide</small>
            </article>
            <article className="about__card">
              <VscFolderLibrary className="about__icon" />
              <h5>Exceptional Service</h5>
              <small>
                24/7 Online Support <br></br>
              </small>
              <small>555-555-555</small>
            </article>
          </div>

          <p>
            Hoosier Track Company was founded in 2023 with the mission of
            helping businesses streamline their delivery operations and improve
            their bottom line. We provide a comprehensive delivery management
            system that includes everything from real-time tracking to delivery
            analytics, all designed to help businesses optimize their delivery
            operations and provide the best possible customer experience.
          </p>
          <p>
            Our team has years of experience in the delivery and logistics
            industry, which has allowed us to develop a deep understanding of
            the challenges faced by businesses that rely on delivery operations.
            Our expertise includes everything from route optimization to
            real-time tracking, and we use this knowledge to continually improve
            our delivery management system and provide the best possible service
            to our customers.{" "}
          </p>
          <p>
            What sets Hoosier Track Company apart is our commitment to
            innovation and customer service. Our delivery management system is
            constantly evolving to meet the changing needs of our customers, and
            we offer exceptional support to ensure our customers get the most
            out of our system. Additionally, our system is designed to be
            flexible and customizable, so businesses can tailor it to their
            specific needs and requirements.
          </p>
          <a href="#contact" className="btn btn-primary">
            Let's Talk
          </a>
        </div>
      </div>
    </div>
  );
};
export default About;
