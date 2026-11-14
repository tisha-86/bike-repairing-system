"use client";

import { useState } from "react";

const servicesList = [
  {
    id: 1,
    name: "Basic Wash",
    description: "Exterior water wash and dry.",
    price: "Tk 150",
    time: "20 min",
  },
  {
    id: 2,
    name: "Foam Wash",
    description: "Foam wash, chain clean and dry.",
    price: "Tk 250",
    time: "30 min",
  },
  {
    id: 3,
    name: "Full Detailing",
    description: "Deep clean, polish and chain lube.",
    price: "Tk 600",
    time: "60 min",
  },
  {
    id: 4,
    name: "Chain & Lube",
    description: "Chain degrease and lubrication.",
    price: "Tk 120",
    time: "15 min",
  },
];

export default function ServicesPage() {
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
        <h1 className="text-2xl font-bold text-gray-900">Services</h1>
        <p className="text-xs text-gray-500 mt-1">Choose the wash your bike needs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {servicesList.map((service) => (
          <div
            key={service.id}
            className="border border-gray-200 rounded-lg p-5 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-semibold text-gray-900">{service.name}</h2>
                <span className="text-sm font-bold text-gray-900">{service.price}</span>
              </div>
              <p className="text-xs text-gray-500">{service.description}</p>
              <p className="text-xs text-gray-500">Time: {service.time}</p>
            </div>

            <div>
              <button
                onClick={() => setSelectedService(service.name)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-md transition"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Book Now Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-sm w-full p-6 space-y-4">
            {bookedMessage ? (
              <div className="text-center py-6 space-y-1">
                <p className="text-base font-bold text-green-600">Booking Confirmed!</p>
                <p className="text-xs text-gray-500">Your {selectedService} slot is reserved.</p>
              </div>
            ) : (
              <>
                <h3 className="text-base font-bold text-gray-900">Book {selectedService}</h3>
                <form onSubmit={handleConfirmBooking} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-gray-600 mb-1">Service Point</label>
                    <select className="w-full border border-gray-300 rounded px-3 py-2">
                      <option>Uttara Wash Point</option>
                      <option>Dhanmondi Wash Point</option>
                      <option>Gulshan Wash Point</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">Your Name</label>
                    <input
                      required
                      placeholder="Enter your name"
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">Bike Model</label>
                    <input
                      required
                      placeholder="e.g., Yamaha R15"
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedService(null)}
                      className="px-4 py-2 border border-gray-200 rounded text-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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