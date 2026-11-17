"use client";

import { useEffect, useRef } from "react";
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

export default function MapComponent({
  points,
  selected,
  onSelect,
}: {
  points: ServicePoint[];
  selected: ServicePoint | null;
  onSelect: (p: ServicePoint) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: number]: L.Marker }>({});

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current).setView([23.8685, 90.3985], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    points.forEach((pt) => {
      const marker = L.marker([pt.lat, pt.lng], { icon: markerIcon }).addTo(map);

      marker.bindPopup(`
        <div style="font-size:12px; line-height:1.5; min-width:150px;">
          <p style="font-weight:700; font-size:14px; margin:0 0 2px 0; color:#111827;">${pt.name}</p>
          <p style="color:#6b7280; margin:0 0 4px 0;">${pt.address}</p>
          <p style="color:#374151; margin:0 0 4px 0;">${pt.phone}</p>
          <p style="margin:0;">Bikes per day: <strong>${pt.bikesPerDay}</strong></p>
          <p style="margin:0;">Slots per day: <strong>${pt.slotsPerDay}</strong></p>
          <p style="margin:0;">Off days: <strong>${pt.offDays}</strong></p>
        </div>
      `);

      marker.on("click", () => {
        onSelect(pt);
      });

      markersRef.current[pt.id] = marker;
    });
  }, [points, onSelect]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selected) return;

    map.flyTo([selected.lat, selected.lng], 14, { duration: 0.8 });
    const marker = markersRef.current[selected.id];
    if (marker) {
      marker.openPopup();
    }
  }, [selected]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[460px] rounded-xl border border-slate-200 z-0"
    />
  );
}