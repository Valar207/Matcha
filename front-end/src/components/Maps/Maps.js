import React from "react";
import { Map, Circle, GoogleApiWrapper } from "google-maps-react";
import Style from "./MapsStyle.json";

export const MapContainer = ({ lat, lon, height }) => {
  const position = {
    lat: lat,
    lng: lon,
  };
  return (
    <Map
      containerStyle={{ height: `${height}`, position: "relative" }}
      styles={Style}
      google={window.google}
      zoom={15}
      initialCenter={position}
      mapTypeControl={false}
    >
      <Circle radius={300} center={position} strokeColor="transparent" strokeOpacity={0} strokeWeight={5} fillColor="#FF0000" fillOpacity={0.2} />
    </Map>
  );
};

export default GoogleApiWrapper({
  apiKey: "GOOGLEMAP_API_KEY",
})(MapContainer);
