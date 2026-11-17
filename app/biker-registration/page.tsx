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
        <h1 className="text-2xl font-extrabold text-slate-900">Biker Registration</h1>
        <p className="text-xs text-slate-500 mt-1">
          Register as a bike wash specialist.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs space-y-4 text-xs"
      >
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Biker Name</label>
          <input
            required
            placeholder="e.g., Arif Hasan"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Service Area / Zone</label>
          <input
            required
            placeholder="e.g., Uttara / Central"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
          <input
            required
            placeholder="e.g., 01800000005"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2.5 rounded-lg shadow-xs transition"
        >
          Register Biker
        </button>
      </form>
    </div>
  );
}