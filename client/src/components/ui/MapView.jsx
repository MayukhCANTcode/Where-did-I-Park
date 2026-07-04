import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";


delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// This component moves the map whenever latitude or longitude changes
function ChangeMapView({ latitude, longitude }) {
  const map = useMap();

  useEffect(() => {
    map.setView([latitude, longitude], 16, {
      animate: true,
    });
  }, [latitude, longitude]);

  return null;
}


function MapView({ latitude, longitude }) {

  return (

    <MapContainer
      center={[latitude, longitude]}
      zoom={16}
      style={{
        height: "400px",
        width: "100%",
        borderRadius: "12px",
      }}
    >

      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Move map whenever props change */}
      <ChangeMapView
        latitude={latitude}
        longitude={longitude}
      />

      <Marker position={[latitude, longitude]}>
        <Popup>
          🚗 Parking Location
        </Popup>
      </Marker>

    </MapContainer>

  );
}

export default MapView;
