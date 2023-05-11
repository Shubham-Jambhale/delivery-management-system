import React, { useContext } from "react";
import "./Navbar.css"; // import the CSS file
import Navba from "react-bootstrap/Navbar";
import Container_Boot from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import { AuthContext } from "../Auth/Authprovider";

const Navbar = () => {
  const { logout } = useContext(AuthContext);
  const handleLogout = () => {
    logout();
  };

  return (
    <Navba bg="dark" variant="dark">
      <Container_Boot>
        <Navba.Brand href="/"> HoosierTrack</Navba.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/#about" id="aboutus">
            About Us
          </Nav.Link>
          <Nav.Link href="/#contact" id="contactus">
            Contact Us
          </Nav.Link>
          <Nav.Link href="./calculate" id="shipwithus">
            Ship With Us
          </Nav.Link>
        </Nav>
        <Nav className="ms-auto">
          <Nav.Link href="./#contact" id="letsconnect">
            Let's Connect
          </Nav.Link>
          <Nav.Link href="./login" id="Login-button">
            Login
          </Nav.Link>
          <Nav.Link href="./signup" id="Signup-button">
            Sign Up
          </Nav.Link>
          <Nav.Link href="/" id="logout-button" onClick={handleLogout}>
            Logout
          </Nav.Link>
        </Nav>
      </Container_Boot>
    </Navba>
  );
};
export default Navbar;
