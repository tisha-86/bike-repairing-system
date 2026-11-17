"use client";

import Link from "next/link";
import { useBikeWash } from "../context/BikeWashContext";

const avatarColors = [
  "from-blue-600 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-purple-600 to-pink-600",
  "from-amber-500 to-orange-600",
];

export default function BikersPage() {
  const { verifiedBikers } = useBikeWash();

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Bikers</h1>
          <p className="text-xs text-slate-500 mt-1">Meet the people who wash your bike.</p>
        </div>

        <Link
          href="/biker-registration"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xs transition"
        >
          + Register Biker
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {verifiedBikers.map((biker, idx) => {
          const gradient = avatarColors[idx % avatarColors.length];
          return (
            <div
              key={biker.id}
              className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs hover:shadow-md transition space-y-4"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-full bg-gradient-to-br ${gradient} text-white flex items-center justify-center font-bold text-sm shadow-xs`}
                >
                  {biker.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">{biker.name}</h2>
                  <p className="text-xs text-blue-600 font-medium">{biker.area}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                <span className="font-bold text-amber-500">★ {biker.rating.toFixed(1)}</span>
                <span className="text-slate-500 font-medium">{biker.jobs} jobs</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full font-semibold ${
                    biker.status === "Available"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {biker.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}