"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBikeWash } from "../context/BikeWashContext";

export default function BikerRegistrationPage() {
  const router = useRouter();
  const { addBiker } = useBikeWash();

  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addBiker({ name, area, phone });
    router.push("/bikers");
  };

  return (
    <div className="max-w-md mx-auto px-6 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Biker Registration</h1>
        <p className="text-xs text-gray-500 mt-1">
          Register as a bike wash specialist.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="border border-gray-200 rounded-lg p-6 space-y-4 text-xs">
        <div>
          <label className="block font-medium text-gray-700 mb-1">Biker Name</label>
          <input
            required
            placeholder="e.g., Arif Hasan"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Service Area / Zone</label>
          <input
            required
            placeholder="e.g., Uttara / Central"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            required
            placeholder="e.g., 01800000005"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-md transition"
        >
          Register Biker
        </button>
      </form>
    </div>
  );
}