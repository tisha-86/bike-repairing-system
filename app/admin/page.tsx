"use client";

import { useState } from "react";
import { useBikeWash } from "../context/BikeWashContext";

const ADMIN_PASSCODE = "admin123";

export default function AdminPortalPage() {
  const {
    servicePoints,
    bikers,
    notifications,
    unreadCount,
    verifyServicePoint,
    rejectServicePoint,
    verifyBiker,
    rejectBiker,
    toggleBikerStatus,
    markAllNotificationsRead,
  } = useBikeWash();

  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"points" | "bikers">("points");

  const pendingPointsCount = servicePoints.filter((p) => p.status === "pending").length;
  const pendingBikersCount = bikers.filter((b) => b.verificationStatus === "pending").length;

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
      <div className="max-w-md mx-auto px-6 py-16">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-5">
          <div className="space-y-1">
            <span className="inline-block bg-blue-50 text-blue-700 border border-blue-100 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
              Admin Access
            </span>
            <h1 className="text-2xl font-bold text-slate-900">Admin Portal</h1>
            <p className="text-xs text-slate-500">
              Sign in with your admin passcode to review and verify service points and bikers.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="password"
              required
              placeholder="Admin passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 rounded-lg px-3.5 py-2.5 text-sm outline-none"
            />
            {error && <p className="text-xs font-medium text-red-600">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 rounded-lg shadow-xs transition"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Admin Portal
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review and verify service points and bikers.
        </p>
      </div>

      {/* Notifications Panel */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            Notifications ({unreadCount} new)
          </h2>
          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="text-xs font-medium text-slate-700 underline hover:text-blue-600 transition"
            >
              Mark all read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <p className="text-xs text-slate-400 py-2">No notifications yet.</p>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`rounded-lg px-4 py-3 text-xs transition ${
                  notif.read
                    ? "bg-slate-50 border border-slate-100 text-slate-600"
                    : "bg-blue-50/80 border border-blue-100 text-slate-800"
                }`}
              >
                <p className="font-semibold text-slate-900">{notif.title}</p>
                <p className="mt-0.5 text-slate-600">{notif.message}</p>
                <p className="mt-1 text-[11px] text-slate-400">{notif.timestamp}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filter Tabs + Sign Out */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setActiveTab("points")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
              activeTab === "points"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            Service Points ({servicePoints.length}) · {pendingPointsCount} pending
          </button>

          <button
            onClick={() => setActiveTab("bikers")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
              activeTab === "bikers"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            Bikers ({bikers.length}) · {pendingBikersCount} pending
          </button>
        </div>

        <button
          onClick={() => {
            setIsAuthenticated(false);
            setPasscode("");
          }}
          className="text-xs font-medium text-slate-600 underline hover:text-red-600 transition"
        >
          Sign out
        </button>
      </div>

      {/* Tab 1: Service Points List */}
      {activeTab === "points" && (
        <div className="space-y-4">
          {servicePoints.map((pt) => (
            <div
              key={pt.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:border-slate-300 transition space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900">{pt.name}</h3>
                  <p className="text-xs text-slate-500">{pt.address}</p>
                  <p className="text-xs text-slate-600">
                    {pt.phone} · Lat {pt.lat.toFixed(5)}, Lon {pt.lng.toFixed(5)}
                  </p>
                  <p className="text-xs text-slate-800">
                    {pt.bikesPerDay} bikes/day · {pt.slotsPerDay} slots/day · Off: {pt.offDays}
                  </p>
                </div>

                <span
                  className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium ${
                    pt.status === "pending"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : pt.status === "verified"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {pt.status}
                </span>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                {pt.status === "pending" ? (
                  <>
                    <button
                      onClick={() => verifyServicePoint(pt.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-md transition"
                    >
                      Verify
                    </button>
                    <button
                      onClick={() => rejectServicePoint(pt.id)}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-md transition"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  pt.isSample && (
                    <span className="text-xs text-slate-400">Sample data</span>
                  )
                )}

                <a
                  href={`https://www.openstreetmap.org/?mlat=${pt.lat}&mlon=${pt.lng}#map=16/${pt.lat}/${pt.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-slate-800 underline hover:text-blue-600 transition"
                >
                  Check location
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Bikers List */}
      {activeTab === "bikers" && (
        <div className="space-y-4">
          {bikers.map((biker) => (
            <div
              key={biker.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:border-slate-300 transition space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900">{biker.name}</h3>
                  <p className="text-xs text-slate-500">Zone: {biker.area}</p>
                  <p className="text-xs text-slate-600">
                    {biker.phone} · ★ {biker.rating.toFixed(1)} · {biker.jobs} jobs
                  </p>
                </div>

                <span
                  className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium ${
                    biker.verificationStatus === "pending"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : biker.verificationStatus === "verified"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {biker.verificationStatus}
                </span>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                {biker.verificationStatus === "pending" ? (
                  <>
                    <button
                      onClick={() => verifyBiker(biker.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-md transition"
                    >
                      Verify
                    </button>
                    <button
                      onClick={() => rejectBiker(biker.id)}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-md transition"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <>
                    {biker.isSample && (
                      <span className="text-xs text-slate-400">Sample data</span>
                    )}
                    <button
                      onClick={() => toggleBikerStatus(biker.id)}
                      className="text-xs font-medium text-blue-600 underline hover:text-blue-800"
                    >
                      Duty: {biker.status} (Switch)
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}