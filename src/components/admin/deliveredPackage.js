import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { signUpUser, get_user, get_phone } from "../../firebase_setup/firebase";
import ReactDOM from "react-dom/client";
import Login from "../Login/Login";
import "./unassignedPackage.css";
import { createTracking, getTrackingIds } from '../../firebase_setup/firebase';
import { database } from "../../firebase_setup/firebase";

const TrackingTabledelivered = () => {
  const [trackingIds, setTrackingIds] = useState([]);
  const [driverNames, setDriverNames] = useState([]);
  const [selectedTrackingId, setSelectedTrackingId] = useState("");
  const [selectedDriverName, setSelectedDriverName] = useState("");

  useEffect(() => {
    const fetchTrackingIds = async () => {
      const trackingIdsRef = database.ref("Bookings");
      const snapshot = await trackingIdsRef.once("value");
      const ids = [];
      snapshot.forEach((idSnapshot) => {
        const id = idSnapshot.val();
        ids.push(id);
      });
      setTrackingIds(ids);
    };
    fetchTrackingIds();

    const fetchDriverNames = async () => {
      const usersRef = database.ref("users");
      const snapshot = await usersRef.once("value");
      const driverNames = [];
      snapshot.forEach((userSnapshot) => {
        const user = userSnapshot.val();
        if (user.userType === "driver") {
          driverNames.push(user.name);
        }
      });
      setDriverNames(driverNames);
      console.log(driverNames);
      const loginButton = document.getElementById("Login-button");
      const signupButton = document.getElementById("Signup-button");
      const logoutButton = document.getElementById("logout-button");     
        if (loginButton && signupButton && logoutButton) {
        loginButton.style.display = "none";
        signupButton.style.display = "none";
        logoutButton.style.display = "block";
        }
    };
    fetchDriverNames();
  }, []);

  

  const assignDriver = () => {      
    const trackingIdsRef = database.ref("Bookings");
    console.log("hello");
    console.log(selectedTrackingId)
    //trackingIdsRef.child(selectedTrackingId).update({ driver: selectedDriverName });
    trackingIdsRef.once("value").then((snapshot) => {
      snapshot.forEach((userSnapshot) => {
        const user = userSnapshot.val();
        console.log(user.id)
        if (user.id === selectedTrackingId) {
          console.log("in update")
          console.log(user.id)
          const trackingIdsRef= userSnapshot.ref;
          trackingIdsRef.update({
            driver: selectedDriverName
          }).then(() => {
           
            // Refresh the page
            window.location.reload().then(function() {
                  const loginButton = document.getElementById("Login-button");
                  const signupButton = document.getElementById("Signup-button");
                  const logoutButton = document.getElementById("logout-button");
                  console.log("hellooooo logout")       
                  if (loginButton && signupButton && logoutButton) {
                    loginButton.style.display = "none";
                    
                    signupButton.style.display = "none";
                    logoutButton.style.display = "block";
                  }
                 // 2 second delay
              });
              
              
              
          });
        }
      });
    });
  };
  

  return (
    <body>
    <div>
      <h1>Tracking IDs</h1>
      <table>
        <thead>
          <tr>
            <th>Tracking ID</th>
            <th>Status</th>
            <th>Driver</th>
            {/* <th>Action</th> */}
          </tr>
        </thead>
        <tbody>
        {trackingIds
          .filter((trackingId) => trackingId.status === "Delivered")
          .map((trackingId) => (
            <tr key={trackingId.id}>
              <td>{trackingId.id}</td>
              <td>{trackingId.status}</td>
              <td>{trackingId.driver || "Unassigned"}</td>
              {/* <td>
                <button onClick={() => setSelectedTrackingId(trackingId.id) }>Assign Driver</button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
      {selectedTrackingId && (
        <div>
          <h2>Assign Driver</h2>
          <label htmlFor="driver-select">Select a driver:</label>
          
          <select id="driver-select" value={selectedDriverName} onChange={(e) => setSelectedDriverName(e.target.value)}>
            <option value="">Select a driver</option>
            {driverNames.map((driverName) => (
              <option key={driverName} value={driverName}>
                {driverName}
              </option>
            ))}
          </select>
          <button onClick={assignDriver}>Assign</button>
        </div>
      )}
    </div>
    </body>
  );
};

export default TrackingTabledelivered;
