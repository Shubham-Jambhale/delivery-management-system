import React from "react";
import { Container, Button, Row, Form } from "react-bootstrap";
import "./Footer.css";


const Footer = () => {
  return (
    <footer>
      <div className="footer_container">
        <p >&copy; {new Date().getFullYear()} Made with ❤️ </p>
        <p > Team 33 </p>
      </div>
    </footer>
  );
};

export default Footer;
