"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { ServicePoint } from "../context/BikeWashContext";

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function FlyToPoint({ point }: { point: ServicePoint | null }) {
  const map = useMap();
  useEffect(() => {
    if (point) {
      map.flyTo([point.lat, point.lng], 14);
    }
  }, [point, map]);
  return null;
}

function PointMarker({
  point,
  isSelected,
  onSelect,
}: {
  point: ServicePoint;
  isSelected: boolean;
  onSelect: (p: ServicePoint) => void;
}) {
  const ref = useRef<L.Marker>(null);

  useEffect(() => {
    if (isSelected && ref.current) {
      ref.current.openPopup();
    }
  }, [isSelected]);

  return (
    <Marker
      ref={ref}
      position={[point.lat, point.lng]}
      icon={markerIcon}
      eventHandlers={{ click: () => onSelect(point) }}
    >
      <Popup>
        <div className="text-xs space-y-1">
          <p className="font-bold text-sm text-gray-900">{point.name}</p>
          <p className="text-gray-500">{point.address}</p>
          <p className="text-gray-700">{point.phone}</p>
          <p>
            Bikes per day: <strong>{point.bikesPerDay}</strong>
          </p>
          <p>
            Slots per day: <strong>{point.slotsPerDay}</strong>
          </p>
          <p>
            Off days: <strong>{point.offDays}</strong>
          </p>
        </div>
      </Popup>
    </Marker>
  );
}

export default function MapComponent({
  points,
  selected,
  onSelect,
}: {
  points: ServicePoint[];
  selected: ServicePoint | null;
  onSelect: (p: ServicePoint) => void;
}) {
  return (
    <MapContainer
      center={[23.8685, 90.3985]}
      zoom={13}
      className="w-full h-[460px] rounded-lg border border-gray-200 z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToPoint point={selected} />
      {points.map((pt) => (
        <PointMarker
          key={pt.id}
          point={pt}
          isSelected={selected?.id === pt.id}
          onSelect={onSelect}
        />
      ))}
    </MapContainer>
  );
}