import "./calculate.css";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

//import shippo from "shippo";

import React, { useRef, useState, useEffect } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
  LoadScript,
} from "@react-google-maps/api";

const center = { lat: 39.168804, lng: -86.536659 };

const Price = () => {
  const history = useHistory();
  const [map, setMap] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  // const [weight, setWeight] = useState("");
  //const [msg, setMsg] = useState("");
  const [rates, setRates] = useState([]);
  const [buttonclicked, setbuttonclicked] = useState(false);
  const [sourceCityship, setSourceCityship] = useState("");
  const [sourceStateship, setSourceStateship] = useState("");
  const [sourceZipship, setSourceZipship] = useState("");
  const [sourceCountryship, setSourceCountryship] = useState("");
  const [destinationCityship, setdestinationCityship] = useState("");
  const [destinationCountryship, setdestinationCountryship] = useState("");
  const [destinationZipship, setdestinationZipship] = useState("");
  const [destinationStateship, setdestinationStateship] = useState("");
  const [sourcestreetaddress, setsourcestreetaddress] = useState("");
  const [destinationstreetaddress, setdestinationstreetaddress] = useState("");

  const [packageSize, setPackageSize] = useState("10");
  const handleSelectButtonClick = () => {
    // Navigate to the login page
    history.push("/login");
  };

  // Event handler for the onChange event of the select element
  const handlePackageSizeChange = (e) => {
    setPackageSize(e.target.value); // Update the state with the selected package size
  };

  const sourceRef = useRef(null);
  const destinationRef = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBhsHVHsIVw8Vuo_zxwssPTq-uMEozGkZ4",
    libraries: ["places"],
  });

  async function calculateRoute() {
    const directionsService = new window.google.maps.DirectionsService();
    const sourcePlace = sourceRef.current.getPlace();
    const destinationPlace = destinationRef.current.getPlace();

    //alert(sourcePlace);
    const streetAddress = sourcePlace.formatted_address;
    const streetAddress1 = streetAddress.split(",")[0].trim();
    setsourcestreetaddress(streetAddress1);
    const sourceCity = sourcePlace.address_components.find((component) =>
      component.types.includes("locality")
    )?.long_name;
    setSourceCityship(sourceCity);
    const sourceState = sourcePlace.address_components.find((component) =>
      component.types.includes("administrative_area_level_1")
    )?.short_name;
    setSourceStateship(sourceState);
    const sourceZip = sourcePlace.address_components.find((component) =>
      component.types.includes("postal_code")
    )?.long_name;
    setSourceZipship(sourceZip);
    const sourceCountry = sourcePlace.address_components.find((component) =>
      component.types.includes("country")
    )?.short_name;
    setSourceCountryship(sourceCountry);

    const destinationstreet = destinationPlace.formatted_address;
    const destinationstreet1 = destinationstreet.split(",")[0].trim();
    setdestinationstreetaddress(destinationstreet1);
    const destinationCity = destinationPlace.address_components.find(
      (component) => component.types.includes("locality")
    )?.long_name;
    setdestinationCityship(destinationCity);
    const destinationState = destinationPlace.address_components.find(
      (component) => component.types.includes("administrative_area_level_1")
    )?.short_name;
    setdestinationStateship(destinationState);
    const destinationZip = destinationPlace.address_components.find(
      (component) => component.types.includes("postal_code")
    )?.long_name;
    setdestinationZipship(destinationZip);
    const destinationCountry = destinationPlace.address_components.find(
      (component) => component.types.includes("country")
    )?.short_name;
    setdestinationCountryship(destinationCountry);

    if (!sourcePlace || !destinationPlace) {
      alert("Please select source and destination");
      return;
    }
    const results = await directionsService.route(
      {
        origin: sourcePlace.geometry.location,
        destination: destinationPlace.geometry.location,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === "OK") {
          setDirectionsResponse(response);
          setDistance(response.routes[0].legs[0].distance.text);
          // setDuration(response.routes[0].legs[0].duration.text);
          // alert(distance);
        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );
  }
  useEffect(() => {
    if (buttonclicked) {
      const createShipment = async () => {
        const response = await fetch("https://api.goshippo.com/shipments/", {
          method: "POST",
          headers: {
            Authorization:
              "ShippoToken shippo_test_fc4b5901d43dd00badd2d98187c4c27a713382a3",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            object_purpose: "PURCHASE",
            address_from: {
              street1: sourcestreetaddress,
              city: sourceCityship,
              state: sourceStateship,
              zip: sourceZipship,
              country: sourceCountryship,
            },
            address_to: {
              street1: destinationstreetaddress,
              city: destinationCityship,
              state: destinationStateship,
              zip: destinationZipship,
              country: destinationCountryship,
            },
            parcels: [
              {
                length: "10",
                width: "8",
                height: "6",
                distance_unit: "in",
                weight: packageSize,
                mass_unit: "lb",
              },
            ],
            async: false,
          }),
        });
        console.log();
        const shipmentData = await response.json();
        if (!response.ok) {
          console.error(`Error creating shipment: ${shipmentData.detail}`);
          return;
        }

        const shipmentId = shipmentData.object_id;

        const getRates = async () => {
          const currencyCode = "USD"; // Replace with the desired currency code

          const response = await fetch(
            `https://api.goshippo.com/shipments/${shipmentId}/rates/${currencyCode}/`,
            {
              method: "GET",
              headers: {
                Authorization:
                  "ShippoToken shippo_test_fc4b5901d43dd00badd2d98187c4c27a713382a3",
              },
            }
          );

          const data = await response.json();

          if (response.ok) {
            console.log(data.results);
            setRates(data.results);
          } else {
            console.error(`Error fetching rates: ${data.detail}`);
          }
        };
        getRates();
      };
      createShipment();
    }
    setbuttonclicked(false);
  }, [
    buttonclicked,
    sourceCityship,
    sourcestreetaddress,
    sourceStateship,
    sourceZipship,
    sourceCountryship,
    destinationCityship,
    destinationZipship,
    destinationStateship,
    destinationstreetaddress,
    packageSize,
  ]);

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading maps...";
  const handlestate = () => {
    // MapComponent();
    calculateRoute();
    setbuttonclicked(true);
  };

  return (
      <div className="b_container_customer">
        <div className="username_display">HoosierTrack</div>
        <div className="homeTitle">Package Cost</div>
        <div className="content">
          <div className="form">
            <form>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="Source">Source</label>
                    <Autocomplete
                      onLoad={(autocomplete) => {
                        sourceRef.current = autocomplete;
                      }}>
                      <input
                        type="text"
                        name="email"
                        placeholder="Source place"
                      />
                    </Autocomplete>
                </div>
                <div className="form-group">
                  <label htmlFor="destination">Destination</label>
                  <Autocomplete
                    onLoad={(autocomplete) => {
                      destinationRef.current = autocomplete;
                    }}>
                    <input
                      className="input-login"
                      type="text"
                      name="destination"
                      placeholder="Destination Place"
                    />
                  </Autocomplete>
               </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Select Package Size</label>
                  <select
                    className="form-control"
                    value={packageSize}
                    onChange={handlePackageSizeChange}
                    style={{ width: "100%" }}>
                    <option value="" disabled selected>
                      Select package size
                    </option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                    <option value="40">40</option>
                  </select>
                </div>
              </div>
              <div className="login-form_cust">
                <div className="footerlogin_custlogin">
                  <Button className="login_btn_cust" onClick={handlestate}>
                    Calculate
                  </Button>
                </div>
              </div>
              <div className="form-row">
                <div className="distance_google_map_show">
                  <GoogleMap
                    center={center}
                    zoom={14}
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    options={{
                      zoomControl: false,
                      streetViewControl: false,
                      mapTypeControl: false,
                      fullscreenControl: false,
                    }}
                    onLoad={(map) => setMap(map)}>
                    <Marker position={center} />
                    {directionsResponse && (
                      <DirectionsRenderer directions={directionsResponse} />
                    )}
                  </GoogleMap>
                </div>
               </div>
               <div className="form-row">
                  <div className="shippo_rates_customer">
                    <h2>Rates</h2>
                    <div
                      className="rate-container_customer"
                      style={{ overflowY: rates.length > 5 ? "auto" : "unset" }}>
                      <table className="rate-table_customer">
                        <thead>
                          <tr>
                            <th>Id</th>
                            <th>Provider</th>
                            <th>Service Level</th>
                            <th>Amount</th>
                            {/* <th>Action</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {rates.map((rate, index) => (
                            <tr
                              key={rate.object_id}
                              className={
                                index === 0
                                  ? "firstRow"
                                  : index % 2 === 0
                                  ? "evenRow"
                                  : "oddRow"
                              }>
                              <td>{index + 1}</td>
                              <td>{rate.provider}</td>
                              <td>{rate.servicelevel.name}</td>
                              <td>
                                {rate.amount} {rate.currency}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {rates.length > 5 && ( 
                      // Display scroll option only if there are more than 5 items
                      <div className="scroll-option">
                        <p>Scroll to view more</p>
                      </div>
                    )}
                 </div>
              </div>
              <div className="after-rates_cust">
                <div className="after_rates_footerlogin_custlogin">
                  {/* <Button
                    className="after_rates_login_btn_cust"
                    onClick={handleSelectButtonClick}>
                    Book
                  </Button> */}
                </div>
              </div>
            </form> 
          </div>
        </div>
    </div>
  );
};

export default Price;
