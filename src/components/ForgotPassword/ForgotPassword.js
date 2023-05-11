import React, { forwardRef, useState, useRef } from "react";
import "../Login/Login.css";
import { Button } from "react-bootstrap";
import { get_email, get_question1, get_question2, get_answer1, get_answer2, getNameFromEmail, changePassword} from "../../firebase_setup/firebase";
import emailjs from "emailjs-com";
import { Link } from "react-router-dom";

const ForgotPassword = (props) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [name, setName] = useState("");
  const [q1, setQ1] = useState("");
  const [a1, setA1] = useState("");
  const [q2, setQ2] = useState("");
  const [a2, setA2] = useState("");
  const [errors, setFormError] = useState("");
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [guess1, setGuess1] = useState("");
  const [guess1Count, setGuess1Count] = useState("");
  const [guess2Count, setGuess2Count] = useState("");
  const [guess2, setGuess2] = useState("");
  const [sendCode, setSendCode] = useState(false);
  const [code, setCode] = useState("");
  const [codeGuess, setCodeGuess] = useState("");
  const [codeCount, setCodeCount] = useState("");
  const [resetPassword, setResetPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [complete, setComplete] = useState(false);
  
  const handlePasswordBlur = (event) => {
    const passwordValue = event.target.value;
    setFormError("");
    let errorMessages = [];
    if (passwordValue.length == 0) {
      setPasswordError("");
      return;
    }
    if (passwordValue.length < 8) {
      errorMessages.push("Password should be more than 8 characters.");
    }
    if (!/[A-Z]/.test(passwordValue)) {
      errorMessages.push(
        "Password should contain at least 1 uppercase letter."
      );
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passwordValue)) {
      errorMessages.push(
        "Password should contain at least 1 special character."
      );
    }
    setPasswordError(errorMessages.join(" "));
  };

  const handleConfirmPasswordBlur = (event) => {
    const confirmPasswordValue = event.target.value;
    setFormError("");
    if (confirmPasswordValue.length == 0) {
      setConfirmPasswordError("");
      return;
    }
    if (confirmPassword != password) {
      setConfirmPasswordError("Password Mismatch");
    } else {
      setConfirmPasswordError("");
    }
  };
  
  const sendOTP = async () => {
	//e.preventDefault();
	var temp = ""+Math.floor(Math.random()*999999);
	temp = "0".repeat(6-temp.length)+temp;
	setCode(temp);
	const parameters = {
		email: email,
		otp: temp
	}
	setSendCode(true);
	emailjs
      .send(
        "service_hoosiertrack",
        "otp_template",
        parameters,
        "6zkBNUrNgXZCgEePc"
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
	  return;
  }

  async function validateForm(event){
    event.preventDefault();
	if (show1==false && show2==false && sendCode==false && resetPassword==false){
		if (
		  email === ""
		) {
		  setFormError("Please enter your email address");
		} else {
		  const user_exist = await get_email(email);
		  if (!user_exist) {
			setFormError(
			  "We do not have an account associated with that email address"
			);
		  }
		  else {
			setFormError("");
			setName(await getNameFromEmail(email));
			setQ1(await get_question1(email));
			setA1(await get_answer1(email));
			setQ2(await get_question2(email));
			setA2(await get_answer2(email));
			setShow1(true);
		}}
	} else if (show1==true){
		if (guess1===a1){
			setGuess1Count("");
			sendOTP();
			setShow1(false);
		} else if (guess1Count==="1") {
			setGuess1Count("2");
		} else if (guess1Count==="2") {
			setGuess1Count("");
			setShow1(false);
			setShow2(true);
		} else {
			setGuess1Count("1");
		}
	} else if (show2 == true) {
		if (guess2===a2){
			setGuess2Count("");
			sendOTP();
			setShow2(false);
		} else if (guess2Count==="1") {
			setGuess2Count("2");
		} else if (guess2Count==="2") {
			setFormError("Failed to answer security questions. Please try again later");
			setGuess2Count("");
			setShow2(false);
		} else {
			setGuess2Count("1");
		}
	} else if (sendCode == true) {
		if (code===codeGuess){
			setCodeCount("");
			setResetPassword(true);
			setSendCode(false);
		} else if (codeCount==="1") {
			setCodeCount("2");
		} else if (codeCount==="2") {
			setFormError("Failed to verify your identity");
			setCodeCount("");
			setSendCode(false);
		} else {
			setCodeCount("1");
		}
	} else if (resetPassword== true){
		if (password==="" || confirmPassword===""){
			setFormError("Please enter and confirm your new password");
		} else if (passwordError!=="" || confirmPasswordError !=="") {
			setFormError("Please fix form errors");
		} else {
			setFormError("");
			await changePassword(email, password);
			setComplete(true);
			setResetPassword(false);
		}
	}
  };

  return (
    <div className="b_container" ref={props.loginrender}>
      <div className="header">Forgot Password</div>
      <div className="content">
	  {!complete && (<form onSubmit={(event)=>{validateForm(event)}}>
        <div className="form">
          <div className="form-group">
            <label htmlFor="email">Enter your email address:</label>
            <input
              type="text"
              value={email}
			  name="email"
              className="email"
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
		  {show1 && (
			<div className="form-group">
				<label htmlFor="security1">Please provide the answer to the following security question:&nbsp;{q1}</label>
				<input
				  type="text"
				  value={guess1}
				  className="security1"
				  onChange = { (event) => setGuess1(event.target.value)} />
			  <div className="validation_box">
              {guess1Count && (
                <span
                  style={{ color: "red", display: "block", marginTop: "5px" }}>
                  You have incorrectly guessed {guess1Count}/3 times
                </span>
              )}
			  </div>
		    </div>) }
			{show2 && (
			<div className="form-group">
				<span style={{ color: "red", display: "block", marginTop: "5px" }} >You have failed to answer primary security question. </span>
				<label htmlFor="security2">Please provide the answer to your secondary security question:&nbsp;{q2}</label>
				<input
				  type="text"
				  value={guess2}
				  className="security2"
				  onChange = { (event) => setGuess2(event.target.value)} />
			  <div className="validation_box">
              {guess2Count && (
                <span
                  style={{ color: "red", display: "block", marginTop: "5px" }}>
                  You have incorrectly guessed {guess2Count}/3 times
                </span>
              )}
			  </div>
		    </div>) }
			{sendCode && (
			<div className="form-group">
				<label htmlFor="verification">Please enter the verification code sent to your email:</label>
				<input
				  type="text"
				  value={codeGuess}
				  className="verification"
				  onChange = { (event) => setCodeGuess(event.target.value)} />
			  <div className="validation_box">
              {codeCount && (
                <span
                  style={{ color: "red", display: "block", marginTop: "5px" }}>
                  You have incorrectly guessed {codeCount}/3 times
                </span>
              )}
			  </div>
		    </div>) }
			{resetPassword && (
			<div className="form-group">
              <label htmlFor="password">New Password</label>
              <input
                type="password"
                value={password}
                className="password"
                onChange={(event) => setPassword(event.target.value)}
                onBlur={handlePasswordBlur}
              />
              <div className="validation_box">
                {passwordError && (
                  <span
                    style={{ color: "red", display: "block", marginTop: "5px" }}>
                    {passwordError}
                  </span>
                )}
              </div>
            </div>)}
			{resetPassword && (
            <div className="form-group">
              <label htmlFor="password"> Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                className="confirmpassword"
                onChange={(event) => setConfirmPassword(event.target.value)}
                onBlur={handleConfirmPasswordBlur}
              />
              <div className="validation_box">
                {confirmPasswordError && (
                  <span
                    style={{ color: "red", display: "block", marginTop: "5px" }}>
                    {confirmPasswordError}
                  </span>
                )}
              </div>
            </div>
			)}
			
          <div className="footer_button">
		    <button type="submit" className="forgot_btn">
            Submit
          </button>
			<div className="validation_box">
              {errors && (
                <span
                  style={{ color: "red", display: "block", marginTop: "5px" }}>
                  {errors}
                </span>
              )}
			</div>
          </div>
		</div>
	  </form>)}
	  {complete && (
		<div className="footer-inline">
		<br/>
		  Your password has been reset! <br/>
		  Continue to <Link to="/login">Login</Link>
		</div>)}
      </div>
    </div>
  );
};

export default ForgotPassword;
