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

const TIME_SLOTS = [
  "10:00 AM - 11:00 AM",
  "11:30 AM - 12:30 PM",
  "02:00 PM - 03:00 PM",
  "04:00 PM - 05:00 PM",
  "06:00 PM - 07:00 PM",
];

export default function ServicesPage() {
  const { verifiedPoints, bookings, addBooking } = useBikeWash();

  const [selectedService, setSelectedService] = useState<{ name: string; price: string } | null>(null);
  const [servicePoint, setServicePoint] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [bikeModel, setBikeModel] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
  const [bookedSuccess, setBookedSuccess] = useState(false);

  const openBookingModal = (service: { name: string; price: string }) => {
    setSelectedService(service);
    setServicePoint(verifiedPoints[0]?.name || "Uttara Wash Point");
    setBookedSuccess(false);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

addBooking({
      serviceName: selectedService.name,
      price: selectedService.price,
      numericPrice: Number(String(selectedService.price).replace(/\D/g, "")) || 150,
      servicePoint,
      customerName,
      customerPhone,
      bikeModel,
      date,
      timeSlot,
    });

    setBookedSuccess(true);
    setTimeout(() => {
      setBookedSuccess(false);
      setSelectedService(null);
      setCustomerName("");
      setCustomerPhone("");
      setBikeModel("");
      setDate("");
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Services</h1>
        <p className="text-xs text-slate-500 mt-1">Choose the wash your bike needs and book a slot.</p>
      </div>

      {/* Service Cards */}
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
                onClick={() => openBookingModal({ name: service.name, price: service.price })}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-xs transition"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Live Customer Bookings List */}
      {bookings.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900">
              My Bookings ({bookings.length})
            </h2>
            <span className="text-xs text-slate-500">Live status synced with Admin</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{booking.serviceName}</span>
                    <span className="font-bold text-blue-600">{booking.price}</span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                      booking.status === "Pending"
                        ? "bg-amber-100 text-amber-800"
                        : booking.status === "Confirmed"
                        ? "bg-blue-100 text-blue-700"
                        : booking.status === "Completed"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                <p className="text-slate-600">
                  📍 <span className="font-medium text-slate-800">{booking.servicePoint}</span>
                </p>
                <p className="text-slate-600">
                  🏍️ {booking.bikeModel} · 👤 {booking.customerName} ({booking.customerPhone})
                </p>
                <p className="text-slate-500">
                  📅 {booking.date} · 🕒 {booking.timeSlot}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-100">
            {bookedSuccess ? (
              <div className="text-center py-8 space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>
                <p className="text-base font-bold text-slate-900">Booking Submitted!</p>
                <p className="text-xs text-slate-500">
                  Your {selectedService.name} slot at {servicePoint} is pending confirmation.
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Book {selectedService.name}
                    </h3>
                    <p className="text-xs text-blue-600 font-semibold">{selectedService.price}</p>
                  </div>
                  <button
                    onClick={() => setSelectedService(null)}
                    className="text-slate-400 hover:text-slate-700 text-sm font-bold"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleConfirmBooking} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Select Service Point
                    </label>
                    <select
                      value={servicePoint}
                      onChange={(e) => setServicePoint(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                    >
                      {verifiedPoints.map((pt) => (
                        <option key={pt.id} value={pt.name}>
                          {pt.name} ({pt.address})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Your Name</label>
                      <input
                        required
                        placeholder="e.g., Tanvir Ahmed"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                      <input
                        required
                        placeholder="017XXXXXXXX"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Bike Model & Registration
                    </label>
                    <input
                      required
                      placeholder="e.g., Yamaha R15 V3 - Dhaka Metro La 12-3456"
                      value={bikeModel}
                      onChange={(e) => setBikeModel(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Date</label>
                      <input
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Time Slot</label>
                      <select
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                      >
                        {TIME_SLOTS.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setSelectedService(null)}
                      className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-xs transition"
                    >
                      Confirm Booking
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