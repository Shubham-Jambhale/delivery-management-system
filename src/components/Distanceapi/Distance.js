import React, { useRef, useState } from "react";
import "./diatance.css";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
  LoadScript,
} from "@react-google-maps/api";

const center = { lat: 39.168804, lng: -86.536659 };

const Distance = () => {
  const [map, setMap] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");

  const sourceRef = useRef(null);
  const destinationRef = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBrt_zuGoy_qH2nl9CbN-eiZMsK-mwlXP0",
    libraries: ["places"],
  });

  async function calculateRoute() {
    const directionsService = new window.google.maps.DirectionsService();
    const sourcePlace = sourceRef.current.getPlace();
    const destinationPlace = destinationRef.current.getPlace();

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

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    // setDuration("");
    // setSource("");
    // setDestination("");
  }

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading maps...";

  return (
    <div>
      <div>
        <label htmlFor="source">Source:</label>
        <Autocomplete
          onLoad={(autocomplete) => {
            sourceRef.current = autocomplete;
          }}>
          <input
            id="source"
            type="text"
            placeholder="Enter source address"
            onChange={(event) => {
              // setSource(event.target.value);
            }}
          />
        </Autocomplete>
      </div>
      <div>
        <label htmlFor="destination">Destination:</label>
        <Autocomplete
          onLoad={(autocomplete) => {
            destinationRef.current = autocomplete;
          }}>
          <input
            id="destination"
            type="text"
            placeholder="Enter destination address"
            onChange={(event) => {
              // setDestination(event.target.value);
            }}
          />
        </Autocomplete>
      </div>
      <button onClick={calculateRoute}>Calculate distance</button>
      <div>Distance is :{distance}</div>
      <div className="distance_google_map_show">
        <GoogleMap
          // center={center}
          zoom={5}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            zoomControl: true,
            streetViewControl: true,
            mapTypeControl: true,
            fullscreenControl: true,
          }}
          onLoad={(map) => setMap(map)}>
          <Marker position={center} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </div>
    </div>
  );
};

export default Distance;
