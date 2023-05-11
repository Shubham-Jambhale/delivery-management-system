import { React, useState, useContext } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
// import axios from "axios";
import "./paymentForm.css";
import Stripe from "stripe";
import { useHistory, withRouter } from "react-router-dom";
import { bookinginsert, get_email_val } from "../../firebase_setup/firebase";
import { AuthContext } from "../Auth/Authprovider";
import emailjs from "emailjs-com";

const PaymentForm = (props) => {
  const history = useHistory();
  const { userType } = useContext(AuthContext);

  // Check if user is logged in
  const isLoggedIn = !!userType;
  const loginButton = document.getElementById("Login-button");
  const signupButton = document.getElementById("Signup-button");
  const logoutButton = document.getElementById("logout-button");
  const aboutus = document.getElementById("aboutus");
  const contactus = document.getElementById("contactus");
  const shipwithus = document.getElementById("shipwithus");
  const letsconnect = document.getElementById("letsconnect");
  if (isLoggedIn) {
    loginButton.style.display = "none";
    signupButton.style.display = "none";
    aboutus.style.display = "none";
    contactus.style.display = "none";
    shipwithus.style.display = "none";
    letsconnect.style.display = "none";
    logoutButton.style.display = "block";
  }
  if (!isLoggedIn) {
    history.push("/login");
  }
  const send_payment = props.location.state
    ? props.location.state.send_payment
    : null;
  //   console.log("payment", send_payment);

  const CARD_OPTIONS = {
    iconStyle: "solid",
    style: {
      base: {
        marginTop: "2rem", // Add margin to push CVV and ZIP to the next row
        iconColor: "#c4f0ff",
        color: "#fff",
        fontWeight: 500,
        fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
        fontSize: "16px",
        fontSmoothing: "antialiased",
        ":-webkit-autofill": { color: "#fce883" },
        "::placeholder": { color: "#87bbfd" },
      },
      invalid: {
        iconColor: "#ffc7ee",
        color: "#ffc7ee",
      },
    },
  };

  const stripe1 = new Stripe(
    "sk_test_51MweU9DZWei9mX2RB1OY8YpUBUI5vvziOQ3oNKbSKsUARrfxiEvGJy65WcgmtX7WTn5vK2qLT9U6QVX9Z4VwKjIj00Him1Ef1o"
  );
  const [success, setSuccess] = useState(false);
  const [identer, setidenter] = useState();
  const stripe = useStripe();
  const Elements = useElements();
  // const amount = 100;
  const [successpayment, setsuccesspayment] = useState(true);

  const handleClick = () => {
    const data = send_payment.data;
    history.push({
      pathname: "/customerLogin",
      state: { data },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: Elements.getElement(CardElement),
    });
    const { id } = paymentMethod;
    if (!error) {
      try {
        // console.log("id", id);
        // setidenter(id);
        const amountInCents = Math.round(send_payment.amount * 100);
        const payment = await stripe1.paymentIntents.create({
          amount: amountInCents,
          currency: "USD",
          description: "Hoosier Track payment",
          payment_method: id,
          confirm: true,
        });
        setidenter(payment);
      } catch (error) {
        console.log("Error", error);
        setsuccesspayment(false);
      }
    } else {
      console.log(error.message);
      setsuccesspayment(false);
    }

    if (successpayment) {
      // const { payment_id } = paymentMethod;
      // console.log("payment_id", payment_id);
      setSuccess(true);
      // alert("calling");
      // console.log(identer);
      bookinginsert(
        send_payment.data,
        send_payment.packageSize,
        send_payment.sourceaddress,
        send_payment.destinationaddress,
        send_payment.serviceLevel,
        send_payment.provider,
        "unassigned",
        send_payment.amount,
        "pending",
        send_payment.geneterate_tracking,
        id
      );

      const send_parameters = {
        name: send_payment.data,
        amount: send_payment.amount,
        tracking_id: send_payment.geneterate_tracking,
        email: await get_email_val(send_payment.data),
      };
      emailjs
        .send(
          "service_ddp53q2",
          "template_pafqkeg",
          send_parameters,
          "drC2SNMSqcuDcCb-f"
        )
        .then(
          (result) => {
            console.log("emailjs", result.text);
          },
          (error) => {
            console.log("emailjs", error.text);
          }
        );
    }
  };

  return (
    <div className="container_payment">
      {!success ? (
        <form class="payment_form" onSubmit={handleSubmit}>
          <fieldset className="FormGroup">
            <div className="FormRow">
              <CardElement options={CARD_OPTIONS} />
            </div>
          </fieldset>
          <button type="submit">Pay</button>
        </form>
      ) : (
        <div>
          <h2>Done with the payment</h2>
          <h3>Your tracking id is: {send_payment.geneterate_tracking}</h3>
          <h5>
            <a href="" onClick={handleClick}>
              Click here to go back
            </a>
          </h5>
        </div>
      )}
    </div>
  );
};

export default withRouter(PaymentForm);
