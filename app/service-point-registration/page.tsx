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

  const handleSubmit = (e: React.FormEvent) => {
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
        <h1 className="text-2xl font-extrabold text-slate-900">
          Service Point Registration
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Enter the address and click Find location to get its latitude and longitude.
        </p>
      </div>

      {submitted ? (
        <div className="border border-emerald-200 bg-emerald-50 rounded-xl p-6 space-y-2 shadow-xs">
          <h2 className="text-sm font-bold text-emerald-900">
            Submitted for verification
          </h2>
          <p className="text-xs text-emerald-700">
            An admin will review your service point. It will appear on the map once verified.
          </p>
          <div className="pt-2 flex items-center gap-4">
            <Link
              href="/service-points"
              className="text-xs font-semibold text-blue-600 underline hover:text-blue-800"
            >
              Back to Service Points
            </Link>
            <Link
              href="/admin"
              className="text-xs font-semibold text-slate-700 underline hover:text-slate-900"
            >
              Go to Admin Portal →
            </Link>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs space-y-4 text-xs"
        >
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Service Point Name
            </label>
            <input
              required
              placeholder="e.g., Uttara Iubat"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Address
            </label>
            <div className="flex gap-2">
              <input
                required
                placeholder="e.g., IUBAT, Uttara"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="flex-1 border border-slate-300 rounded-lg px-3 py-2 outline-none"
              />
              <button
                type="button"
                onClick={handleFindLocation}
                disabled={finding}
                className="px-3.5 py-2 border border-blue-200 rounded-lg bg-blue-50 hover:bg-blue-100 font-semibold text-blue-700 whitespace-nowrap transition"
              >
                {finding ? "Finding..." : "Find location"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Latitude
              </label>
              <input
                required
                placeholder="23.88785"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-slate-50"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Longitude
              </label>
              <input
                required
                placeholder="90.38962"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-slate-50"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Phone Number
            </label>
            <input
              required
              placeholder="01761931215"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Bikes per day
              </label>
              <input
                type="number"
                required
                min={1}
                value={bikesPerDay}
                onChange={(e) => setBikesPerDay(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Slots per day
              </label>
              <input
                type="number"
                required
                min={1}
                value={slotsPerDay}
                onChange={(e) => setSlotsPerDay(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Off Day(s)
            </label>
            <input
              placeholder="e.g., Fri"
              value={offDays}
              onChange={(e) => setOffDays(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2.5 rounded-lg shadow-xs transition"
          >
            Submit Service Point
          </button>
        </form>
      )}
    </div>
  );
}