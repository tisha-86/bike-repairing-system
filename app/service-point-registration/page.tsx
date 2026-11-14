"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBikeWash } from "../context/BikeWashContext";

export default function ServicePointRegistrationPage() {
  const router = useRouter();
  const { addServicePoint } = useBikeWash();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [bikesPerDay, setBikesPerDay] = useState("20");
  const [slotsPerDay, setSlotsPerDay] = useState("6");
  const [offDays, setOffDays] = useState("Fri");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Address theke automatic lat & lon ber kora (OpenStreetMap Nominatim API)
    let lat = 23.8103 + (Math.random() - 0.5) * 0.04; // Fallback Dhaka coordinates
    let lng = 90.4125 + (Math.random() - 0.5) * 0.04;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address + ", Bangladesh"
        )}`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        lat = parseFloat(data[0].lat);
        lng = parseFloat(data[0].lon);
      }
    } catch {
      // Fallback coordinates will be used if offline
    }

    addServicePoint({
      name,
      address,
      phone,
      bikesPerDay: Number(bikesPerDay),
      slotsPerDay: Number(slotsPerDay),
      offDays: offDays.trim() || "None",
      lat,
      lng,
    });

    setLoading(false);
    router.push("/service-points");
  };

  return (
    <div className="max-w-md mx-auto px-6 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Register Service Point</h1>
        <p className="text-xs text-gray-500 mt-1">
          Enter address and daily capacity to add a point on the map.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="border border-gray-200 rounded-lg p-6 space-y-4 text-xs">
        <div>
          <label className="block font-medium text-gray-700 mb-1">Service Point Name</label>
          <input
            required
            placeholder="e.g., Mirpur Wash Point"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Address (for Map Location)</label>
          <input
            required
            placeholder="e.g., Mirpur 10, Dhaka"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            required
            placeholder="e.g., 01700000004"
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
            placeholder="e.g., Fri or Fri, Sat or None"
            value={offDays}
            onChange={(e) => setOffDays(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-md transition disabled:opacity-50"
        >
          {loading ? "Finding location & saving..." : "Register Service Point"}
        </button>
      </form>
    </div>
  );
}