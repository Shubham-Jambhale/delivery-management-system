import "./courier.css";
import { useCallback, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "react-bootstrap";

import sg from "../../resources/cycle.jpeg";
import 'animate.css';
import TrackVisibility from 'react-on-screen';

/*import { Dropdown, DropdownButton, SplitButton, Button } from "react-bootstrap";*/
const Banner = () => {
    const [loopNum, setLoopNum] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [text, setText] = useState('');
    const [delta, setDelta] = useState(300 - Math.random() * 100);
    const [index, setIndex] = useState(1);
    const toRotate = [ "Bloomington", "IndianaUniversity" ];
    const period = 2000;
  
    useEffect(() => {
      let ticker = setInterval(() => {
        tick();
      }, delta);
  
      return () => { clearInterval(ticker) };
    }, [text])
  
    function tick() {
        let i = loopNum % toRotate.length;
        let fullText = toRotate[i];
        let updatedText = isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1);

        setText(updatedText);

        if (isDeleting) {
            setDelta(prevDelta => prevDelta / 2);
        }

        if (!isDeleting && updatedText === fullText) {
            setIsDeleting(true);
            setIndex(prevIndex => prevIndex - 1);
            setDelta(period);
        } else if (isDeleting && updatedText === '') {
            setIsDeleting(false);
            setLoopNum(loopNum + 1);
            setIndex(1);
            setDelta(500);
        } else {
            setIndex(prevIndex => prevIndex + 1);
        }
    }
  
 

  return (
    <><section className="banner">
        <Container>
            <Row className="align-items-center">
                <Col xs={12} md={6} xl={7}>
                <TrackVisibility>
                    {({ isVisible }) =>
                     <div className={isVisible ? "animate__animated animate__fadeIn" : ""}>
                        <span className="Tagline">Largest and Reliable Courier Service </span>
                         <h1>{'HoosierTrack '}<span className="wrap">{text}</span></h1>
                            <p>Track your PACKAGE here!</p>
                        <div className="enter">
                        <textarea placeholder="Enter Tracking Number" className="whole"/>
                        <button onClick={ () => window.open("http://www.fedx.com")} className="checkrec">
                            <h1>Check</h1>
                        </button>
                    </div>
                    </div>}
                </TrackVisibility>
                </Col>
                <Col xs={12} md={6} xl={5}>
                    <img src={sg} alt="Map image" />
                </Col>

            </Row>

        </Container>
    </section> 
    </>

  );
  }
export default Banner;