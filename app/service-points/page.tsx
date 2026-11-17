"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useBikeWash, ServicePoint } from "../context/BikeWashContext";

const MapComponent = dynamic(() => import("../components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[460px] rounded-xl border border-slate-200 bg-white flex items-center justify-center text-sm text-slate-400">
      Loading map...
    </div>
  ),
});

export default function ServicePointsPage() {
  const { verifiedPoints } = useBikeWash();
  const [selected, setSelected] = useState<ServicePoint | null>(null);

  useEffect(() => {
    if (verifiedPoints.length > 0 && !selected) {
      setSelected(verifiedPoints[0]);
    }
  }, [verifiedPoints, selected]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Service Points</h1>
          <p className="text-xs text-slate-500 mt-1">
            Click a point or a bubble on the map for details.
          </p>
        </div>

        <Link
          href="/service-point-registration"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xs transition"
        >
          + Register Service Point
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4 space-y-3">
          {verifiedPoints.map((pt) => {
            const isSelected = selected?.id === pt.id;
            return (
              <div
                key={pt.id}
                onClick={() => setSelected(pt)}
                className={`cursor-pointer rounded-xl p-4 border transition-all shadow-xs ${
                  isSelected
                    ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/60"
                    : "border-slate-200/80 hover:border-blue-300 bg-white"
                }`}
              >
                <div className="flex justify-between items-start">
                  <h2 className="font-bold text-sm text-slate-900">{pt.name}</h2>
                  <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                    Open
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{pt.address}</p>
                <div className="flex flex-wrap gap-1.5 mt-3 text-[11px] font-medium">
                  <span className="bg-blue-100/70 text-blue-700 px-2 py-0.5 rounded">
                    {pt.bikesPerDay} bikes/day
                  </span>
                  <span className="bg-indigo-100/70 text-indigo-700 px-2 py-0.5 rounded">
                    {pt.slotsPerDay} slots/day
                  </span>
                  <span className="bg-rose-100/70 text-rose-700 px-2 py-0.5 rounded">
                    Off: {pt.offDays}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-8 shadow-sm rounded-xl overflow-hidden">
          <MapComponent
            points={verifiedPoints}
            selected={selected}
            onSelect={(pt) => setSelected(pt)}
          />
        </div>
      </div>
    </div>
  );
}