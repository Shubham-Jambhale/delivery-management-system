import React, { useState, useEffect , useRef} from 'react';
import { Container, Button, Row, Form } from "react-bootstrap";
import "./landingpage.css";
import { Link, useLocation } from "react-router-dom";
import About from "../AboutUs/About";
import Contact from "../Contact/Contact";
import { createTracking, getTrackingIds } from '../../firebase_setup/firebase';
import { database } from "../../firebase_setup/firebase"

const LandingPage = () => {
  const location = useLocation();
  const aboutRef = useRef(null);
  const contactRef = useRef(null);
  const [trackingStatus, setTrackingStatus] = useState("");

  useEffect(() => {
    if (location.hash === "#about" && aboutRef.current) {
      aboutRef.current.scrollIntoView({ behavior: "smooth" });
    }
    if (location.hash === "#contact" && aboutRef.current) {
      contactRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  const handleTrackPackage = () => {
    const trackingId = document.getElementById("trackingId").value;
    const trackingRef = database.ref("Bookings");

    trackingRef.once("value").then((snapshot) => {
      const trackingIds = snapshot.val();
      const tracking = Object.values(trackingIds).find(
        (t) => t.id === trackingId
      );
      if (tracking) {
        setTrackingStatus(`The status of package ${trackingId} is ${tracking.status}`);
      } else {
        setTrackingStatus(`Invalid tracking Id `);
      }
    });
  };

  return (
    <div>
      <section id="Landing">
        <div className="main">
          <Container>
            <Row>
              <div className="intro-text">
                <div>
                  <h1 className="title">Hoosier Track!</h1>
                  <p className="subtitle">
                    {" "}
                    Solution to all your Delivery Problems{" "}
                  </p>
                </div>
                <div className="searchContainer">
                  <Form className="searchForm">
                    <Form.Control
                      type="text"
                      placeholder="Enter tracking number"
                      className="searchBar"
                      id="trackingId"
                    />
                    <Button
                      size="small"
                      className="searchButton"
                      onClick={handleTrackPackage}
                    >
                      Track
                    </Button>
                  </Form>
                  
                </div>
                <div id="trackingStatus">{trackingStatus}</div>
                {/* <div className="buttonContainer">
                  <Link to="/Login">
                    <Button size="lg" className="landingbutton">
                      Login
                    </Button>
                  </Link>

                  <Link to="/signup">
                    <Button size="lg" className="landingbutton">
                      Sign up
                    </Button>
                  </Link>
                </div> */}
              </div>
            </Row>
          </Container>
        </div>
      </section>
      <section ref={aboutRef}>
        <About />
      </section>
      <section ref={contactRef}>
        <Contact />
      </section>
    </div>
  );
};

export default LandingPage;
