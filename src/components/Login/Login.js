import React, { forwardRef, useState, useRef, useContext } from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { database } from "../../firebase_setup/firebase";
import { useHistory } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from "../Auth/Authprovider";


import emailjs from "emailjs-com";

const linkStyle = {
	textDecoration: "none",
	color: 'black'
};

const LoginForm = () => {
  // const dispatch = useDispatch();

  const { userType, login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [toPush, setToPush] = useState("");
  const [code, setCode] = useState("");
  const [sendCode, setSendCode] = useState(false);
  const [codeGuess, setCodeGuess] = useState("");
  const [codeCount, setCodeCount] = useState("");
  const [data, setData] = useState("");

  // Initialize Firebase Authentication
  const auth = firebase.auth();
  const handleGoogleLogin = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth
      .signInWithPopup(provider)
      .then((result) => {
        setIsLoggedIn(true);
        login("customer");
        history.push("/customerLogin");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const sendOTP = async (user) => {
	var temp = ""+Math.floor(Math.random()*999999);
	temp = "0".repeat(6-temp.length)+temp;
	setCode(temp);
	const parameters = {
  	  email: user.email,
	  otp: temp
	};
	setSendCode(true);
	console.log("Code: "+parameters.otp);
    emailjs
      .send(
        "service_hoosiertrack",
        "login_template",
        parameters,
        "6zkbnurngxzcgeepc"
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

  const handleLogin = (event) => {
    event.preventDefault();
    const usersRef = database.ref("users");
    const emailQuery = usersRef.orderByChild("email").equalTo(email);
    const usernameQuery = usersRef.orderByChild("name").equalTo(name);
    console.log(email);
    console.log(name);
    Promise.all([emailQuery.once("value"), usernameQuery.once("value")])
      .then((snapshots) => {
        const users = [];
        console.log("Promise.all executed ");
        snapshots.forEach((snapshot) => {
          snapshot.forEach((userSnapshot) => {
            const user = userSnapshot.val();
            console.log(user.name, user.password);
            users.push(user);
          });
        });
        const matchingUser = users.find((user) => user.password === password);
        console.log(password);
        if (matchingUser) {
		  setError("");
          // console.log(matchingUser.name)
          console.log("User matched");
          setIsLoggedIn(true);
         
          setIsVerified(sendOTP(matchingUser));
          console.log(matchingUser.userType)
          if (matchingUser.userType === "driver") {
            // redirect to driver page
            login("driver");
            setToPush("/driver");
          }
          else if (matchingUser.userType === "admin") {
            // redirect to admin page
            login("admin");
            setToPush("/admin");
          } else {
            setData(matchingUser.name)
            //console.log("datalogin", data);
            login("customer");
            setToPush("/customerLogin");
            // history.push({
            //   pathname: "/customerLogin",
            //   state: { data },
            // });
          }
        } else {
          setError("Incorrect email or password");
        }
      })
      .catch(() => {
        setError("Incorrect email or password");
      });
  };
  
  const verifyLogin = () => {
	if (code===codeGuess){
	  setCodeCount("");
 	  setSendCode(false);
    if(toPush!= "/customerLogin")
    {
      history.push(toPush);
    }
    else{
      history.push({
              pathname: "/customerLogin",
              state: { data },
            });
    } 
	  
	} else if (codeCount==="1") {
	  setCodeCount("2");
	} else if (codeCount==="2") {
	  setError("Failed to verify your identity");
	  setCodeCount("");
	  setSendCode(false);
	} else {
	  setCodeCount("1");
	}
  }

  const handleAlertClose = () => {
    setError("");
  };

  return (
    <div className="b_container">
      <div className="header_login">Login</div>
      <div className="content">
        {! sendCode && (
		  <div className="form">
		    <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="email">Email/Username</label>
                <input
                  type="text"
                  name="email"
                  placeholder="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setName(event.target.value);
                  }}
                />
			  </div>
			  <div className="form-group">
			    <label htmlFor="password">Password</label>
                <input classname="input-login"
                  type="password"
                  name="password"
                  placeholder="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
              <div className="subscript-r">
                <Link to="/forgotpassword" style={linkStyle}>Forgot Password?</Link>
              </div>
              <div className="footerlogin">
                <Button className="login_btn" onClick={handleLogin}>
                  Login
                </Button>
                <div>
                  <Button className="google_button" onClick={handleGoogleLogin}>
                    <FcGoogle /> Google
                  </Button>
                </div>
              </div>
              <div className="subscript-c">
                Don't have an account? <Link to="/signup">Sign up</Link>
              </div>
            </form>
		  </div>)
		}
		{sendCode && (
		  <div className="form">
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
		    </div>
			<div className="footer">
		      <Button
                onClick={(event) => verifyLogin(event)}
                type="button"
                className="btn">
                Verify
              </Button>
            </div>
	      </div>
		)}
      </div>
      {error && (
        <div className="alert">
          <span className="closebtn" onClick={handleAlertClose}>
            &times;
          </span>
          {error}
        </div>
      )}
    </div>
  );
};

export default LoginForm;
