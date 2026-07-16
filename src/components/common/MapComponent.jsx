import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons in Leaflet with Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const MapComponent = ({
  cars,
  onPickupLocation,
  onDropoffLocation,
  interactive = true,
}) => {
  const mapRef = useRef();

  // If we need to set view to fit all markers
  const FitBounds = ({ positions }) => {
    const map = useMap();
    useEffect(() => {
      if (positions && positions.length > 0) {
        const bounds = L.latLngBounds(positions);
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }, [positions, map]);
    return null;
  };

  const positions =
    cars?.filter((c) => c.lat && c.lng).map((c) => [c.lat, c.lng]) || [];

  return (
    <div className="h-96 w-full rounded-lg shadow">
      <MapContainer
        center={[9.032, 38.746]} // Addis Ababa
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds positions={positions} />
        {cars?.map(
          (car) =>
            car.lat &&
            car.lng && (
              <Marker
                key={car.id}
                position={[car.lat, car.lng]}
                draggable={interactive && car.status === "available"}
                eventHandlers={{
                  dragend: (e) => {
                    const { lat, lng } = e.target.getLatLng();
                    if (onPickupLocation)
                      onPickupLocation(car.id, { lat, lng });
                  },
                }}
              >
                <Popup>
                  <strong>{car.name}</strong>
                  <br />
                  Status: {car.status}
                  <br />
                  {car.currentBooking?.returnTime && (
                    <>
                      Return:{" "}
                      {new Date(car.currentBooking.returnTime).toLocaleString()}
                    </>
                  )}
                </Popup>
              </Marker>
            ),
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
