import React, { useState, useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { Card, Button, Dropdown } from "react-bootstrap";
import "./admin.css";
import { createTracking, getTrackingIds } from "../../firebase_setup/firebase";
import { database } from "../../firebase_setup/firebase";
import { AuthContext } from "../Auth/Authprovider";

var deliveredCount = 0;
var pendingCount = 0;
var pickedUpCount = 0;
var unassignedCount=0;
var allbookingCount=0;
const databaseRef = database.ref();
const trackingIdsRef = databaseRef.child("Bookings");

trackingIdsRef.on("value", (snapshot) => {
  snapshot.forEach((childSnapshot) => {
    const status = childSnapshot.child("status").val();
    
    if (status === "Delivered") {
      deliveredCount++;
    } else if (status === "pending") {
      pendingCount++;
      allbookingCount++;
    } else if (status === "In-Transit") {
      pickedUpCount++;
      allbookingCount++;
    } else {
      allbookingCount++;
    }
    const Unassigned = childSnapshot.child("driver").val();
    if (Unassigned === "unassigned") {
      unassignedCount++;
    } 
  });

  console.log(`Delivered count: ${deliveredCount}`);
  console.log(`Pending count: ${pendingCount}`);
  console.log(`Picked-up count: ${pickedUpCount}`);
  console.log(`Unassigned count: ${unassignedCount}`);
});

const Admin = () => {
  const [trackingId, setTrackingId] = useState(null);
  const [trackingIds, setTrackingIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [driverNames, setDriverNames] = useState([]);
  const history = useHistory();
  const { userType } = useContext(AuthContext);

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

  useEffect(() => {
    const fetchTrackingIds = async () => {
      const ids = await getTrackingIds();
      setTrackingIds(ids);
    };
    fetchTrackingIds();
  }, []);

  const handleCreateTracking = () => {
    const newTrackingId = createTracking();
    setTrackingId(newTrackingId);
  };
  useEffect(() => {
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
    };
    fetchDriverNames();
  }, []);

  return (
    <div className="containerdrr">
  <div className="header">Package Delivery</div>
  <div className="content">
    <div className="card-container">
      <div className="row">
        <div className="col-sm-3">
          <Card className="card assigned">
            <Card.Body>
              <Card.Title>Unassigned Packages</Card.Title>
              <Card.Text>
                <span className="highlight"><h2>{unassignedCount}</h2></span> 
                {/* packages needs to be assigned for the delivery. */}
              </Card.Text>
              <Link to="/unassignedpackage">
                <Button variant="primary" className="small-button">View Details</Button>
              </Link>
            </Card.Body>
          </Card>
        </div>
        <div className="col-sm-3">
          <Card className="card to-be-picked">
            <Card.Body>
              <Card.Title>In-Transit Packages</Card.Title>
              <Card.Text>
                <span className="highlight"><h2>{pickedUpCount}</h2></span> 
                {/* packages that need to be picked up. */}
              </Card.Text>
              <Link to="/pickedpackage">
              <Button variant="primary" className="small-button">View Details</Button>
              </Link>
            </Card.Body>
          </Card>
        </div>
        <div className="col-sm-3">
          <Card className="card delivered">
            <Card.Body>
              <Card.Title>Delivered Packages</Card.Title>
              <Card.Text>
              
                <span className="highlight"><h2>{deliveredCount}</h2></span> 
                {/* packages had been delivered so far. */}
              </Card.Text>
              <Link to="/deliveredpackage">
              <Button variant="primary" className="small-button" >View Details</Button>
              </Link>
            </Card.Body>
          </Card>
        </div>
        {/* <div className="col-sm-3">
          <Card className="card tracking">
            <Card.Body>
              <Card.Title>Generate Tracking ID</Card.Title>
              <Card.Text>
                <Button variant="primary" className="small-button" onClick={handleCreateTracking}>
                  Generate
                </Button>
              </Card.Text>
              {trackingId && (
                <div>
                  <strong>Tracking ID:</strong> {trackingId}
                </div>
              )}
            </Card.Body>
          </Card>
        </div> */}
      </div>
      <div className="row">
      <div className="col-sm-3">
        <Card className="card createuser">
            <Card.Body>
              <Card.Title>Manage All Booking</Card.Title>
              <Card.Text>
                <span className="highlight"><h2>{allbookingCount}</h2></span> 
                {/* packages needs to be assigned for the delivery. */}
              </Card.Text>
              <Link to="/allbooking">
                <Button variant="primary" className="small-button">VIEW DETAILS</Button>
              </Link>
            </Card.Body>
          </Card>
          </div>
        <div className="col-sm-3">
          <Card className="card driver">
            <Card.Title>Drivers</Card.Title>
            <Dropdown>
              <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                Driver List
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {driverNames.map((driverName, index) => (
                  <Dropdown.Item key={index}>{driverName}</Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Card>
        </div>
        
        <div className="col-sm-3">
        <Card className="card createuser">
            <Card.Body>
              <Card.Title>Create User</Card.Title>
              <Card.Text>
                <span className="highlight"><h2></h2></span> 
                {/* packages needs to be assigned for the delivery. */}
              </Card.Text>
              <Link to="/createuser">
                <Button variant="primary" className="small-button">Create</Button>
              </Link>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div></div></div>
  );
};

export default Admin;
