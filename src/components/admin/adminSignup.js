import React, { useContext, useState } from "react";
// import { UserExistContext } from "./UserExistContext.js";
import "./adminSignup.css";
import { Button } from "react-bootstrap";
import { signUpUser, get_user, get_email } from "../../firebase_setup/firebase";
import ReactDOM from "react-dom/client";
import Login from "../Login/Login";

//const root = ReactDOM.createRoot(document.getElementById("root"));

const Signupcreate = () => {
  const [isSignupComplete, setIsSignupComplete] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const [errors, setFormError] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [userType, setUserType] = useState("");
  const [userTypeError, setUserTypeError] = useState("");

  const [quest1, setQuest1] = useState("");
  const [questError1, setQuestError1] = useState("");

  const [ans1, setAns1] = useState("");

  const [quest2, setQuest2] = useState("");
  const [questError2, setQuestError2] = useState("");

  const [ans2, setAns2] = useState("");

  const handleusernameChange = (event) => {
    setUsernameError("");
  };

  const handleQuestionBlur1 = (event) => {
    setQuest1(event.target.value);
    setFormError("");
    if (quest1 === "select") {
      setQuestError1("Please select a Question");
    } else {
      setQuestError1("");
    }
  };

  const handleQuestionBlur2 = (event) => {
    setQuest2(event.target.value);
    setFormError("");
    if (quest2 === "select") {
      setQuestError2("Please select a Question");
    } else if (quest1 === quest2) {
      setQuestError2("Please select two different security questions");
    } else {
      setQuestError2("");
    }
  };

  const handleTypeBlur = (event) => {
    setUserType(event.target.value);
    setFormError("");
    if (userType === "select") {
      setUserTypeError("Please select a User Type");
    } else {
      setUserTypeError("");
    }
  };

  const handleUsernameBlur = (event) => {
    const usernameValue = event.target.value;
    if (usernameValue.length == 0) {
      setUsernameError("");
      return;
    }
    if (!isUsernameValid(usernameValue)) {
      setUsernameError("Username should contain only letters and numbers.");
    } else {
      setUsernameError("");
    }
  };

  const isUsernameValid = (username) => {
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    return usernameRegex.test(username);
  };

  const handleEmailBlur = (event) => {
    const emailValue = event.target.value;
    setFormError("");
    if (emailValue.length == 0) {
      setEmailError("");
      return;
    }
    if (!isEmailValid(emailValue)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

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

  const validateForm = async (event) => {
    event.preventDefault();
    if (
      email === "" ||
      password === "" ||
      username === "" ||
      confirmPassword === "" ||
      userType === "select" ||
      userType === "" ||
      ans1 === "" ||
      ans2 === "" ||
      quest1 === "select" ||
      quest2 === "select" ||
      quest1 === "" ||
      quest2 === "" 
    ) {
      setFormError("Please fill all the fields");
    } else if (
      emailError !== "" ||
      passwordError !== "" ||
      usernameError !== "" ||
      confirmPasswordError !== "" ||
      userTypeError !== "" ||
      questError1 !== "" ||
      questError2 !== "" 
    ) {
      setFormError("Please fill in each field correctly");
    } else if (
      emailError === "" &&
      passwordError === "" &&
      usernameError === "" &&
      confirmPasswordError === "" &&
      userTypeError === "" &&
      questError1 === "" &&
      questError2 === "" &&
      usernameError === ""
    ) {
      const user_exist = await get_user(username);
	  const email_exist = await get_email(email);
      if (user_exist) {
        setUsernameError(
          "This username is taken"
        );
      }
	  if (email_exist){
	     setEmailError(
		   "There is already an account associated with this email address"
		 );
	  }  
	  if (usernameError === "" && emailError === "") {
        setUsernameError("");
        setFormError("");
        signUpUser(
          username,
          email,
          password,
          userType,
          quest1,
          ans1,
          quest2,
          ans2
        );
      }
      setIsSignupComplete(true);
      <div id="trackingStatus">"Sign Up Done"</div>
      event.target.reset();
      if (isSignupComplete) {
        setFormError(" Signup Done");
      }
    } else {
      event.target.reset();
    }
  };

  return (
    <div className="b_container">
      <div className="header1">Create User</div>
      <div className="content">
        <div className="form">
          <div className="form-group">
          <label>
              Create Account for :&ensp;
              <select
                value={userType}
                onChange={(event) => setUserType(event.target.value)}
                onBlur={handleTypeBlur}>
                <option value="select">SELECT</option>
                <option value="customer">Customer</option>
                <option value="driver">Delivery Driver</option>
                <option value="admin">Delivery Manager</option>
              </select>
            </label>
            <div className="validation_box">
              {userTypeError && (
                <span style={{ color: "red" }}>{userTypeError}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="username">UserName</label>
            <input
              type="text"
              value={username}
              className="username"
              onChange={(event) => {
                setUsername(event.target.value);
                handleusernameChange();
              }}
              onBlur={handleUsernameBlur}
            />
            <div className="validation_box">
              {usernameError && (
                <span style={{ color: "red" }}>{usernameError}</span>
              )}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              value={email}
              className="email"
              onChange={(event) => setEmail(event.target.value)}
              onBlur={handleEmailBlur}
            />
            <div className="validation_box">
              {emailError && <span style={{ color: "red" }}>{emailError}</span>}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
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
          </div>
          <div className="form-group">
            <label htmlFor="password"> Confirm Password</label>
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
          <div className="form-group">
            <label htmlFor="quest1">Select primary security question:</label>
            <select
              value={quest1}
              onChange={(event) => setQuest1(event.target.value)}
              onBlur={handleQuestionBlur1}>
              <option value="select">Select primary security question</option>
              <option value="In what city were you born?">
                In what city were you born?
              </option>
              <option value="What is the name of your favorite pet?">
                What is the name of your favorite pet?
              </option>
              <option value="What is your mother's maiden name?">
                What is your mother's maiden name?
              </option>
              <option value="What high school did you attend?">
                What high school did you attend?
              </option>
              <option value="What was the make of your first car?">
                What was the make of your first car?
              </option>
              <option value="What was your favorite food as a child?">
                What was your favorite food as a child?
              </option>
              <option value="Where did you meet your spouse?">
                Where did you meet your spouse?
              </option>
              <option value="What year was your father born?">
                What year was your father born?
              </option>
            </select>
            <div className="validation_box">
              {questError1 && (
                <span style={{ color: "red" }}>{questError1}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="ans1">Answer</label>
            <input
              type="text"
              value={ans1}
              className="username"
              onChange={(event) => setAns1(event.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="quest1">Select secondary security question:</label>
            <select
              value={quest2}
              onChange={(event) => setQuest2(event.target.value)}
              onBlur={handleQuestionBlur2}>
              <option value="select">Select secondary security question</option>
              <option value="In what city were you born?">
                In what city were you born?
              </option>
              <option value="What is the name of your favorite pet?">
                What is the name of your favorite pet?
              </option>
              <option value="What is your mother's maiden name?">
                What is your mother's maiden name?
              </option>
              <option value="What high school did you attend?">
                What high school did you attend?
              </option>
              <option value="What was the make of your first car?">
                What was the make of your first car?
              </option>
              <option value="What was your favorite food as a child?">
                What was your favorite food as a child?
              </option>
              <option value="Where did you meet your spouse?">
                Where did you meet your spouse?
              </option>
              <option value="What year was your father born?">
                What year was your father born?
              </option>
            </select>
            <div className="validation_box">
              {questError2 && (
                <span style={{ color: "red" }}>{questError2}</span>
              )}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="ans2">Answer</label>
            <input
              type="text"
              value={ans2}
              className="username"
              onChange={(event) => setAns2(event.target.value)}
            />
          </div>
          <div className="footer">
            <Button 
              onClick={(event) => validateForm(event)}
              type="button"
              className="Createbutton">
              Create
            </Button>
            <div className="validation_box">
              {errors && (
                <span
                  style={{ color: "red", display: "block", marginTop: "5px" }}>
                  {errors}
                </span>
              )}
            </div>
            <br />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signupcreate;
