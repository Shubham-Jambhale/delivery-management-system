import React, { useState, useRef } from "react";
import Navbar from "./components/Navbar/Navbar";
import Login from "./components/Login/Login";
import Landingpage from "./components/Landingpage/LandingPage";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import About from "./components/AboutUs/About";
import "bootstrap/dist/css/bootstrap.min.css";
import Signup from "./components/Signup/Signup";
import Signupcreate from "./components/admin/adminSignup";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/footer";
import Distance from "./components/Distanceapi/Distance";
import AssignedPackages from "./components/DeliveryDriver/AssignedPackages";
import Admin from "./components/admin/admin";
import CustomerLogin from "./components/CustomerLogin/CustomerLogin";
import TrackingTable from "./components/admin/unassignedPackage";
import TrackingTableall from "./components/admin/allbookings";
import PickedTrackingTable from "./components/admin/pickedPackage";
import TrackingTabledelivered from "./components/admin/deliveredPackage";
import Banner from "./components/dashboard/courier";
import Price from "./components/calculate/calculate";
import Kommunicate from "./components/Chat/Chat";
import { AuthProvider } from "./components/Auth/Authprovider";
import StripeContainer from "./components/Payment/stripeContainer";

const App = (props) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <main>
          <Route path="/" component={Landingpage} exact />
          <Route path="/login" component={() => <Login />} exact />
          <Route path="/signup" component={() => <Signup />} exact />
          <Route path="/createuser" component={() => <Signupcreate />} exact />
          <Route path="/distance" component={() => <Distance />} />
          <Route path="/unassignedpackage"component={() => <TrackingTable />}exact />
          <Route path="/allbooking"component={() => <TrackingTableall />}exact />
          <Route path="/pickedpackage" component={() => <PickedTrackingTable />} exact />
          <Route path="/deliveredpackage" component={() => <TrackingTabledelivered />} exact />
          <Route path="/forgotpassword" component={() => <ForgotPassword />} exact />
          <Route path="/driver" component={() => <AssignedPackages  />} exact />
          <Route path="/admin" component={() => <Admin />} exact />
          <Route path="/assigned-packages-details" component={() => <AssignedPackages />} exact />
          <Route path="/#about" component={() => <About />} exact />
          <Route path="/#contact" component={() => <Contact />} exact />
          <Route path="/landingpage" component={Landingpage} exact />
          <Route path="/dashboard" component={() => <Banner />} exact />
          <Route path="/calculate" component={() => <Price />} exact />
          <Route
            path="/customerLogin"
            component={() => <CustomerLogin />}
            exact
          />
          <Route path="/payment" component={() => <StripeContainer />} exact />
        </main>
        <Footer />
        <Kommunicate />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
