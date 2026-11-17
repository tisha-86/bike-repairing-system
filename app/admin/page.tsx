"use client";

import { useState } from "react";
import { useBikeWash } from "../context/BikeWashContext";

const ADMIN_PASSCODE = "admin123";

export default function AdminPortalPage() {
  const {
    servicePoints,
    bikers,
    verifyServicePoint,
    rejectServicePoint,
    deleteServicePoint,
    toggleBikerStatus,
  } = useBikeWash();

  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"points" | "bikers">("points");

  const pendingPoints = servicePoints.filter((pt) => pt.status === "pending");
  const verifiedPoints = servicePoints.filter((pt) => pt.status === "verified");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === ADMIN_PASSCODE) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid admin passcode. Try: admin123");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-6 py-16">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm space-y-5">
          <div className="space-y-1">
            <span className="inline-block bg-blue-100 text-blue-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
              Restricted Access
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Admin: Service Point Verification
            </h1>
            <p className="text-xs text-slate-500">
              Enter the admin passcode to review and manage service points.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="password"
              required
              placeholder="Admin passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg px-3.5 py-2.5 text-sm outline-none"
            />
            {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold py-2.5 rounded-lg shadow-xs transition"
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Admin: Service Point Verification
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pending: <span className="font-bold text-amber-600">{pendingPoints.length}</span> ·
            Total submitted: <span className="font-bold text-slate-800">{servicePoints.length}</span>
          </p>
        </div>

        <button
          onClick={() => {
            setIsAuthenticated(false);
            setPasscode("");
          }}
          className="self-start text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3.5 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-amber-200/80 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-slate-500">Pending Approval</p>
          <p className="text-2xl font-extrabold text-amber-600 mt-1">{pendingPoints.length}</p>
        </div>
        <div className="bg-white border border-emerald-200/80 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-slate-500">Verified on Map</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">{verifiedPoints.length}</p>
        </div>
        <div className="bg-white border border-blue-200/80 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-slate-500">Registered Bikers</p>
          <p className="text-2xl font-extrabold text-blue-600 mt-1">{bikers.length}</p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab("points")}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTab === "points"
              ? "bg-blue-600 text-white"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Service Points ({servicePoints.length})
        </button>
        <button
          onClick={() => setActiveTab("bikers")}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTab === "bikers"
              ? "bg-blue-600 text-white"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Bikers ({bikers.length})
        </button>
      </div>

      {activeTab === "points" && (
        <div className="space-y-4">
          {servicePoints.map((pt) => (
            <div
              key={pt.id}
              className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-slate-900">{pt.name}</h2>
                  <p className="text-xs text-slate-500">{pt.address}</p>
                  <p className="text-xs text-slate-600">
                    {pt.phone} · Lat {pt.lat}, Lon {pt.lng}
                  </p>
                  <p className="text-xs font-medium text-slate-800">
                    {pt.bikesPerDay} bikes/day · {pt.slotsPerDay} slots/day · Off: {pt.offDays}
                  </p>
                </div>

                <span
                  className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold capitalize ${
                    pt.status === "pending"
                      ? "bg-amber-100 text-amber-800"
                      : pt.status === "verified"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {pt.status}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                {pt.status !== "verified" && (
                  <button
                    onClick={() => verifyServicePoint(pt.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition"
                  >
                    Verify
                  </button>
                )}

                {pt.status !== "rejected" && (
                  <button
                    onClick={() => rejectServicePoint(pt.id)}
                    className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition"
                  >
                    Reject
                  </button>
                )}

                <a
                  href={`https://www.openstreetmap.org/?mlat=${pt.lat}&mlon=${pt.lng}#map=16/${pt.lat}/${pt.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-blue-600 underline hover:text-blue-800 ml-1"
                >
                  Check location
                </a>

                {pt.id > 3 && (
                  <button
                    onClick={() => deleteServicePoint(pt.id)}
                    className="ml-auto text-xs text-slate-400 hover:text-rose-600"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "bikers" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {bikers.map((biker) => (
            <div
              key={biker.id}
              className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs flex items-center justify-between"
            >
              <div>
                <h3 className="text-sm font-bold text-slate-900">{biker.name}</h3>
                <p className="text-xs text-slate-500">
                  {biker.area} · {biker.phone}
                </p>
                <p className="text-xs text-amber-500 font-semibold mt-1">
                  ★ {biker.rating.toFixed(1)} · {biker.jobs} jobs
                </p>
              </div>

              <button
                onClick={() => toggleBikerStatus(biker.id)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full transition ${
                  biker.status === "Available"
                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                    : "bg-rose-100 text-rose-700 hover:bg-rose-200"
                }`}
              >
                {biker.status}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}