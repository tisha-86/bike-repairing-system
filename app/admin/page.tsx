"use client";

import { useState } from "react";
import { useBikeWash } from "../context/BikeWashContext";

const ADMIN_PASSCODE = "admin123";

export default function AdminVerificationPage() {
  const { servicePoints, verifyServicePoint, rejectServicePoint } = useBikeWash();
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  // শুধু নতুন সাবমিট হওয়া (id > 3) বা পেন্ডিং/ভেরিফায়েড পয়েন্টগুলো দেখানোর জন্য
  const submittedPoints = servicePoints.filter((pt) => pt.id > 3);
  const pendingCount = submittedPoints.filter((pt) => pt.status === "pending").length;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === ADMIN_PASSCODE) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid passcode (Hint: admin123)");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-6 py-12 space-y-5">
        <h1 className="text-2xl font-bold text-gray-900">
          Admin: Service Point Verification
        </h1>

        <form onSubmit={handleLogin} className="space-y-3">
          <input
            type="password"
            placeholder="Admin passcode"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="w-full border border-blue-500 ring-1 ring-blue-500 rounded-md px-3.5 py-2 text-sm focus:outline-none"
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-md transition"
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Admin: Service Point Verification
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Pending: {pendingCount} · Total submitted: {submittedPoints.length}
        </p>
      </div>

      {submittedPoints.length === 0 ? (
        <div className="border border-gray-200 rounded-lg p-6 text-xs text-gray-500">
          No new service points submitted yet.
        </div>
      ) : (
        <div className="space-y-4">
          {submittedPoints.map((pt) => (
            <div
              key={pt.id}
              className="border border-gray-200 rounded-lg p-5 space-y-3 bg-white"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h2 className="text-sm font-bold text-gray-900">{pt.name}</h2>
                  <p className="text-xs text-gray-500">{pt.address}</p>
                  <p className="text-xs text-gray-600">
                    {pt.phone} · Lat {pt.lat}, Lon {pt.lng}
                  </p>
                  <p className="text-xs text-gray-800">
                    {pt.bikesPerDay} bikes/day · {pt.slotsPerDay} slots/day · Off: {pt.offDays}
                  </p>
                </div>

                <span
                  className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium ${
                    pt.status === "pending"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : pt.status === "verified"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {pt.status}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => verifyServicePoint(pt.id)}
                  className="bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-3.5 py-1.5 rounded transition"
                >
                  Verify
                </button>
                <button
                  onClick={() => rejectServicePoint(pt.id)}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-medium px-3.5 py-1.5 rounded transition"
                >
                  Reject
                </button>
                <a
                  href={`https://www.openstreetmap.org/?mlat=${pt.lat}&mlon=${pt.lng}#map=16/${pt.lat}/${pt.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-700 underline hover:text-blue-600 ml-1"
                >
                  Check location
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}