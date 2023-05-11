import React, { useState, useEffect } from "react";

const ShippoRates = () => {
  const [rates, setRates] = useState([]);

  const myStyle = {
    marginTop: "5rem",
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "blue",
  };

  useEffect(() => {
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
            street1: "123 Main St",
            city: "San Francisco",
            state: "CA",
            zip: "94105",
            country: "US",
          },
          address_to: {
            street1: "456 Park Ave",
            city: "New York",
            state: "NY",
            zip: "10022",
            country: "US",
          },
          parcels: [
            {
              length: "10",
              width: "8",
              height: "6",
              distance_unit: "in",
              weight: "60",
              mass_unit: "lb",
            },
          ],
          async: false,
        }),
      });

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
  }, []);

  return (
    <div>
      <h2 style={myStyle}>Shippo Rates</h2>
      {/* Render the rates data */}
      <ul>
        {rates.map((rate) => (
          <li key={rate.object_id}>
            {rate.provider} {rate.servicelevel.name} - {rate.amount}{" "}
            {rate.currency}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShippoRates;
