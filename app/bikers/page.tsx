"use client";

import Link from "next/link";
import { useBikeWash } from "../context/BikeWashContext";

export default function BikersPage() {
  const { bikers } = useBikeWash();

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bikers</h1>
          <p className="text-xs text-gray-500 mt-1">Meet the people who wash your bike.</p>
        </div>

        <Link
          href="/biker-registration"
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2.5 rounded-md transition"
        >
          Register Biker
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {bikers.map((biker) => (
          <div key={biker.id} className="border border-gray-200 rounded-lg p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
                {biker.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">{biker.name}</h2>
                <p className="text-xs text-gray-500">{biker.area}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="font-medium text-gray-800">★ {biker.rating.toFixed(1)}</span>
              <span className="text-gray-500">{biker.jobs} jobs</span>
              <span
                className={`px-2.5 py-0.5 rounded-full font-medium ${
                  biker.status === "Available"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {biker.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}