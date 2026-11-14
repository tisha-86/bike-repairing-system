"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useBikeWash, ServicePoint } from "../context/BikeWashContext";

const MapComponent = dynamic(() => import("../components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[460px] rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center text-sm text-gray-400">
      Loading map...
    </div>
  ),
});

export default function ServicePointsPage() {
  const { servicePoints } = useBikeWash();
  const [selected, setSelected] = useState<ServicePoint | null>(null);

  useEffect(() => {
    if (servicePoints.length > 0 && !selected) {
      setSelected(servicePoints[0]);
    }
  }, [servicePoints, selected]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
      {/* Header + Register Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Service Points</h1>
          <p className="text-xs text-gray-500 mt-1">
            Click a point or a bubble on the map for details.
          </p>
        </div>

        <Link
          href="/service-point-registration"
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2.5 rounded-md transition"
        >
          Register Service Point
        </Link>
      </div>

      {/* Left Side List + Right Side Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Service Points List */}
        <div className="lg:col-span-4 space-y-3">
          {servicePoints.map((pt) => {
            const isSelected = selected?.id === pt.id;
            return (
              <div
                key={pt.id}
                onClick={() => setSelected(pt)}
                className={`cursor-pointer rounded-lg p-4 border transition-all ${
                  isSelected
                    ? "border-blue-500 ring-1 ring-blue-500 bg-white"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <h2 className="font-semibold text-sm text-gray-900">{pt.name}</h2>
                <p className="text-xs text-gray-500 mt-0.5">{pt.address}</p>
                <p className="text-xs text-gray-700 mt-2">
                  {pt.bikesPerDay} bikes/day · {pt.slotsPerDay} slots/day
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Off: {pt.offDays}</p>
              </div>
            );
          })}
        </div>

        {/* Right Side: Interactive Map with Bubbles */}
        <div className="lg:col-span-8">
          <MapComponent
            points={servicePoints}
            selected={selected}
            onSelect={(pt) => setSelected(pt)}
          />
        </div>
      </div>
    </div>
  );
}