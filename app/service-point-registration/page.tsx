"use client";

import { useState } from "react";
import Link from "next/link";
import { useBikeWash } from "../context/BikeWashContext";

export default function ServicePointRegistrationPage() {
  const { addServicePoint } = useBikeWash();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [bikesPerDay, setBikesPerDay] = useState("20");
  const [slotsPerDay, setSlotsPerDay] = useState("6");
  const [offDays, setOffDays] = useState("Fri");

  const [lat, setLat] = useState<string>("");
  const [lng, setLng] = useState<string>("");
  const [finding, setFinding] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFindLocation = async () => {
    if (!address.trim()) return;
    setFinding(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address + ", Bangladesh"
        )}`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        setLat(parseFloat(data[0].lat).toFixed(5));
        setLng(parseFloat(data[0].lon).toFixed(5));
      } else {
        setLat("23.81030");
        setLng("90.41250");
      }
    } catch {
      setLat("23.81030");
      setLng("90.41250");
    }
    setFinding(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalLat = parseFloat(lat);
    let finalLng = parseFloat(lng);

    if (isNaN(finalLat) || isNaN(finalLng)) {
      finalLat = 23.8103;
      finalLng = 90.4125;
    }

    addServicePoint({
      name,
      address,
      phone,
      bikesPerDay: Number(bikesPerDay),
      slotsPerDay: Number(slotsPerDay),
      offDays: offDays.trim() || "None",
      lat: finalLat,
      lng: finalLng,
    });

    setSubmitted(true);
  };

  return (
    <div className="max-w-lg mx-auto px-6 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Service Point Registration</h1>
        <p className="text-xs text-gray-500 mt-1">
          Enter the address and click Find location to get its latitude and longitude.
        </p>
      </div>

      {submitted ? (
        <div className="border border-green-200 bg-green-50/70 rounded-lg p-6 space-y-2">
          <h2 className="text-sm font-bold text-gray-900">Submitted for verification</h2>
          <p className="text-xs text-gray-600">
            An admin will review your service point. It will appear on the map once verified.
          </p>
          <div className="pt-2">
            <Link
              href="/service-points"
              className="text-xs font-medium text-gray-900 underline hover:text-blue-600"
            >
              Back to Service Points
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="border border-gray-200 rounded-lg p-6 space-y-4 text-xs">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Service Point Name</label>
            <input
              required
              placeholder="e.g., Uttara Iubat"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Address</label>
            <div className="flex gap-2">
              <input
                required
                placeholder="e.g., IUBAT, Uttara"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="flex-1 border border-gray-300 rounded px-3 py-2"
              />
              <button
                type="button"
                onClick={handleFindLocation}
                disabled={finding}
                className="px-3 py-2 border border-gray-300 rounded bg-gray-50 hover:bg-gray-100 font-medium text-gray-800 whitespace-nowrap"
              >
                {finding ? "Finding..." : "Find location"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Latitude</label>
              <input
                required
                placeholder="23.88785"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Longitude</label>
              <input
                required
                placeholder="90.38962"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              required
              placeholder="01761931215"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Bikes per day</label>
              <input
                type="number"
                required
                min={1}
                value={bikesPerDay}
                onChange={(e) => setBikesPerDay(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Slots per day</label>
              <input
                type="number"
                required
                min={1}
                value={slotsPerDay}
                onChange={(e) => setSlotsPerDay(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Off Day(s)</label>
            <input
              placeholder="e.g., Fri"
              value={offDays}
              onChange={(e) => setOffDays(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-md transition"
          >
            Submit Service Point
          </button>
        </form>
      )}
    </div>
  );
}