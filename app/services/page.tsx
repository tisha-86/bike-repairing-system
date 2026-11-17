"use client";

import { useState } from "react";
import { useBikeWash } from "../context/BikeWashContext";

const servicesList = [
  {
    id: 1,
    name: "Basic Wash",
    description: "Exterior water wash and dry.",
    price: "Tk 150",
    time: "20 min",
    accent: "border-l-4 border-l-blue-500",
    badge: "bg-blue-50 text-blue-700",
  },
  {
    id: 2,
    name: "Foam Wash",
    description: "Foam wash, chain clean and dry.",
    price: "Tk 250",
    time: "30 min",
    accent: "border-l-4 border-l-indigo-500",
    badge: "bg-indigo-50 text-indigo-700",
  },
  {
    id: 3,
    name: "Full Detailing",
    description: "Deep clean, polish and chain lube.",
    price: "Tk 600",
    time: "60 min",
    accent: "border-l-4 border-l-amber-500",
    badge: "bg-amber-50 text-amber-700",
  },
  {
    id: 4,
    name: "Chain & Lube",
    description: "Chain degrease and lubrication.",
    price: "Tk 120",
    time: "15 min",
    accent: "border-l-4 border-l-emerald-500",
    badge: "bg-emerald-50 text-emerald-700",
  },
];

export default function ServicesPage() {
  const { verifiedPoints } = useBikeWash();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [bookedMessage, setBookedMessage] = useState(false);

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookedMessage(true);
    setTimeout(() => {
      setBookedMessage(false);
      setSelectedService(null);
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Services</h1>
        <p className="text-xs text-slate-500 mt-1">Choose the wash your bike needs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {servicesList.map((service) => (
          <div
            key={service.id}
            className={`bg-white border border-slate-200/80 ${service.accent} rounded-xl p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4`}
          >
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <h2 className="text-base font-bold text-slate-900">{service.name}</h2>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${service.badge}`}>
                  {service.price}
                </span>
              </div>
              <p className="text-xs text-slate-500">{service.description}</p>
              <p className="text-xs font-medium text-slate-600 pt-1">⏱ Time: {service.time}</p>
            </div>

            <div>
              <button
                onClick={() => setSelectedService(service.name)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-xs transition"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedService && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-slate-100">
            {bookedMessage ? (
              <div className="text-center py-6 space-y-1">
                <p className="text-base font-bold text-emerald-600">Booking Confirmed!</p>
                <p className="text-xs text-slate-500">Your {selectedService} slot is reserved.</p>
              </div>
            ) : (
              <>
                <h3 className="text-base font-bold text-slate-900">Book {selectedService}</h3>
                <form onSubmit={handleConfirmBooking} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Service Point</label>
                    <select className="w-full border border-slate-300 rounded-lg px-3 py-2">
                      {verifiedPoints.map((pt) => (
                        <option key={pt.id} value={pt.name}>
                          {pt.name} ({pt.address})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Your Name</label>
                    <input
                      required
                      placeholder="Enter your name"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Bike Model</label>
                    <input
                      required
                      placeholder="e.g., Yamaha R15"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedService(null)}
                      className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                    >
                      Confirm
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}