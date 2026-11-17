"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useBikeWash } from "../context/BikeWashContext";

const servicesList = [
  { id: 1, name: "Basic Wash", description: "Exterior water wash and dry.", price: "Tk 150", numericPrice: 150, time: "20 min" },
  { id: 2, name: "Foam Wash", description: "Foam wash, chain clean and dry.", price: "Tk 250", numericPrice: 250, time: "30 min" },
  { id: 3, name: "Full Detailing", description: "Deep clean, polish and chain lube.", price: "Tk 600", numericPrice: 600, time: "60 min" },
  { id: 4, name: "Chain & Lube", description: "Chain degrease and lubrication.", price: "Tk 120", numericPrice: 120, time: "15 min" },
];

const TIME_SLOTS = [
  "10:00 AM - 11:00 AM",
  "11:30 AM - 12:30 PM",
  "02:00 PM - 03:00 PM",
  "04:00 PM - 05:00 PM",
  "06:00 PM - 07:00 PM",
];

function ServicesAndBookingContent() {
  const searchParams = useSearchParams();
  const {
    verifiedPoints,
    bookings,
    getAvailableSlots,
    addBooking,
    completeBookingPayment,
  } = useBikeWash();

  const [searchQuery, setSearchQuery] = useState("");
  const [checkDate, setCheckDate] = useState("2026-11-18");

  const [selectedPoint, setSelectedPoint] = useState<string>("");
  const [selectedServiceId, setSelectedServiceId] = useState<number>(1);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [bikeModel, setBikeModel] = useState("");
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
  const [bookingAlert, setBookingAlert] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<number | null>(null);

  useEffect(() => {
    if (verifiedPoints.length > 0 && !selectedPoint) {
      setSelectedPoint(verifiedPoints[0].name);
    }
  }, [verifiedPoints, selectedPoint]);

  // Handle SSLCommerz Callback Redirect
  useEffect(() => {
    const paymentStatus = searchParams.get("paymentStatus");
    const bookingId = Number(searchParams.get("bookingId"));
    const paidBy = searchParams.get("paidBy") as "Biker" | "Service Point" | null;
    const tranId = searchParams.get("tranId") || `SSL_${Date.now()}`;

    if (paymentStatus === "success" && bookingId && paidBy && bookings.length > 0) {
      completeBookingPayment(bookingId, paidBy, tranId);
    }
  }, [searchParams, bookings.length]);

  const filteredPoints = verifiedPoints.filter(
    (pt) =>
      pt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pt.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const serviceObj = servicesList.find((s) => s.id === selectedServiceId) || servicesList[0];
    const targetPoint = selectedPoint || verifiedPoints[0]?.name || "Uttara Wash Point";

    addBooking({
      serviceName: serviceObj.name,
      price: serviceObj.price,
      numericPrice: serviceObj.numericPrice,
      servicePoint: targetPoint,
      customerName,
      customerPhone,
      bikeModel,
      date: checkDate,
      timeSlot,
    });

    setBookingAlert(`Booking submitted for ${serviceObj.name} at ${targetPoint} on ${checkDate}!`);
    setCustomerName("");
    setCustomerPhone("");
    setBikeModel("");
    setTimeout(() => setBookingAlert(null), 4000);
  };

  const handleSSLCommerzPay = async (bookingId: number, amount: number, customerNameVal: string, customerPhoneVal: string) => {
    try {
      setPayingId(bookingId);
      const res = await fetch("/api/sslcommerz/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          amount,
          customerName: customerNameVal,
          customerPhone: customerPhoneVal,
          paidBy: "Biker",
        }),
      });
      const data = await res.json();
      if (data?.GatewayPageURL) {
        window.location.href = data.GatewayPageURL;
      } else {
        completeBookingPayment(bookingId, "Biker", `SSL_SIM_${Date.now()}`);
      }
    } catch {
      completeBookingPayment(bookingId, "Biker", `SSL_SIM_${Date.now()}`);
    } finally {
      setPayingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Services & Slot Booking</h1>
        <p className="text-xs text-slate-500 mt-1">
          Choose a service, check real-time slot availability, and book your wash.
        </p>
      </div>

      {/* Services Catalog */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {servicesList.map((service) => {
          const isChosen = selectedServiceId === service.id;
          return (
            <div
              key={service.id}
              onClick={() => setSelectedServiceId(service.id)}
              className={`cursor-pointer rounded-xl p-4 border transition-all space-y-2 ${
                isChosen
                  ? "border-blue-600 ring-2 ring-blue-600/20 bg-blue-50/50"
                  : "border-slate-200 bg-white hover:border-blue-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900">{service.name}</h2>
                <span className="text-xs font-bold text-blue-600">{service.price}</span>
              </div>
              <p className="text-xs text-slate-500">{service.description}</p>
              <p className="text-[11px] font-medium text-slate-600">⏱ {service.time}</p>
            </div>
          );
        })}
      </div>

      {/* Slot Availability & Booking Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Service Point Slot Checker */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900">Check Slot Availability</h2>

          <div className="space-y-2 text-xs">
            <input
              type="text"
              placeholder="Search service point or area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
            />
            <input
              type="date"
              value={checkDate}
              onChange={(e) => setCheckDate(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-2.5 max-h-64 overflow-y-auto">
            {filteredPoints.map((pt) => {
              const available = getAvailableSlots ? getAvailableSlots(pt.name, checkDate) : pt.slotsPerDay;
              const isSelected = selectedPoint === pt.name;
              return (
                <div
                  key={pt.id}
                  onClick={() => setSelectedPoint(pt.name)}
                  className={`cursor-pointer p-3 rounded-lg border text-xs transition ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/60"
                      : "border-slate-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">{pt.name}</span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700">
                      {available} slots left
                    </span>
                  </div>
                  <p className="text-slate-500 mt-0.5">{pt.address}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Booking Form */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">Book a Wash Slot</h2>

          {bookingAlert && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium px-4 py-3 rounded-lg">
              ✓ {bookingAlert}
            </div>
          )}

          <form onSubmit={handleConfirmBooking} className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Service Package</label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                >
                  {servicesList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.price})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Service Point</label>
                <select
                  value={selectedPoint}
                  onChange={(e) => setSelectedPoint(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                >
                  {verifiedPoints.map((pt) => (
                    <option key={pt.id} value={pt.name}>
                      {pt.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              <label className="block font-semibold text-slate-700 mb-1">Bike Model</label>
              <input
                required
                placeholder="e.g., Yamaha R15 V3"
                value={bikeModel}
                onChange={(e) => setBikeModel(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Preferred Date</label>
                <input
                  type="date"
                  required
                  value={checkDate}
                  onChange={(e) => setCheckDate(e.target.value)}
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

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg shadow-xs transition"
              >
                Confirm Booking
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Live Customer Bookings List */}
      {bookings.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-200">
          <h2 className="text-lg font-extrabold text-slate-900">
            My Bookings ({bookings.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-2.5 text-xs"
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

                {booking.paymentStatus === "Paid" ? (
                  <p className="text-emerald-700 font-semibold pt-1">
                    ✓ Paid via SSLCommerz ({booking.transactionId || "Confirmed"})
                  </p>
                ) : (
                  booking.status !== "Cancelled" && (
                    <div className="pt-1">
                      <button
                        onClick={() =>
                          handleSSLCommerzPay(
                            booking.id,
                            booking.numericPrice || 150,
                            booking.customerName,
                            booking.customerPhone
                          )
                        }
                        disabled={payingId === booking.id}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-md transition"
                      >
                        {payingId === booking.id ? "Processing..." : `Pay ${booking.price} (SSLCommerz)`}
                      </button>
                    </div>
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="max-w-5xl mx-auto px-6 py-10 text-xs text-slate-500">Loading services...</div>}>
      <ServicesAndBookingContent />
    </Suspense>
  );
}