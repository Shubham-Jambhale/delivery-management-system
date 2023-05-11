import React, { useState,useEffect, useContext  } from 'react';
import { Table, Form } from 'react-bootstrap';
import { get_driver,updateBookingStatus } from '../../firebase_setup/firebase';


import './Driver.css';
import { AuthContext } from "../Auth/Authprovider";

const AssignedPackagesDetails = () => {
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

  const [packages, setPackages] = useState([]);

useEffect(() => {
  async function fetchDriverPackages() {
    const driverPackages = await get_driver("driver");
    const filteredPackages = driverPackages.filter((p) => p.status !== "Delivered");
    setPackages(filteredPackages);
  }
  fetchDriverPackages();
}, []);
console.log(packages);
// Added the logic for delivered
const handleStatusChange = (index, newStatus,pack) => {
  const updatedPackages = [...packages];
  updatedPackages[index].status = newStatus;
  setPackages(updatedPackages);
  updateBookingStatus(updatedPackages[index].id, newStatus, pack);

if (newStatus === "Delivered") {
  setPackages(packages.filter((p) => p.id !== updatedPackages[index].id));
}
};
  


  return (
    <div className="b_container_driver">
      <div className="header_driver">Assigned Packages Details</div>
      <div className="content_driver">
        <div className="table-container">
          <Table striped bordered hover className="table">
            <thead>
              <tr>
                <th className='.tab-header'><b>Tracking Number</b></th>
                <th className='.tab-header'><b>Pickup Address</b></th>
                <th className='.tab-header'><b>Destination Address</b></th>
                <th className='.tab-header'><b>Service Provider</b></th>
                <th className='.tab-header'><b>Service Details</b></th>
                <th className='.tab-header'><b>Status</b></th>
             
              </tr>
            </thead>
            <tbody>
              {packages.map((p, index) => (
                <tr key={index}>
                  <td>{p.id}</td>
                  <td>{p.sourceaddress}</td>
                  <td>{p.destinationaddress}</td>
                  <td>{p.serviceprovider}</td>
                  <td>{p.servicedetails}</td>
                  
                  <td>
                  
                    <Form.Select
                      value={p.status}
                      onChange={(e) => {
                        handleStatusChange(index, e.target.value,p);
                        // const updatedPackages = [...packages];
                        // updatedPackages[index].status = e.target.value;
                        // setPackages(updatedPackages);
                        // updateBookingStatus(p.id, e.target.value,p);
                      }}
                    >
                      <option value="In-Transit">In-Transit</option>
                      <option value="Delivered">Delivered</option>
                      <option value="pending">Pending</option>
                    </Form.Select>
                  </td>
                
</tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AssignedPackagesDetails;