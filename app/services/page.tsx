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

  const handleOpenBooking = (pointName: string, serviceId = 1) => {
    setSelectedPoint(pointName);
    setSelectedServiceId(serviceId);
    setBookingAlert(null);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const available = getAvailableSlots(selectedPoint, checkDate);
    if (available <= 0) {
      setBookingAlert("Sorry! No slots left at this service point on " + checkDate);
      return;
    }

    const srv = servicesList.find((s) => s.id === selectedServiceId) || servicesList[0];
    const created = addBooking({
      serviceName: srv.name,
      price: srv.price,
      numericPrice: srv.numericPrice,
      servicePoint: selectedPoint,
      customerName,
      customerPhone,
      bikeModel,
      date: checkDate,
      timeSlot,
    });

    if (created.fraudAnalysis.isFraud) {
      setBookingAlert(
        `Booking submitted, but flagged by AI Fraud Detector (${created.fraudAnalysis.riskLevel} Risk): ${created.fraudAnalysis.reasons[0]}`
      );
    } else {
      setSelectedPoint("");
      setCustomerName("");
      setCustomerPhone("");
      setBikeModel("");
    }
  };

  const handleSSLCommerzPayment = async (
    bookingId: number,
    amount: number,
    customerName: string,
    customerPhone: string,
    serviceName: string,
    paidBy: "Biker" | "Service Point"
  ) => {
    const target = bookings.find((b) => b.id === bookingId);
    if (!target || target.paymentStatus === "Paid") return;

    setPayingId(bookingId);
    try {
      const res = await fetch("/api/sslcommerz/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          amount,
          customerName,
          customerPhone,
          serviceName,
          paidBy,
        }),
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch {
      alert("SSLCommerz Sandbox connection failed.");
    } finally {
      setPayingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
      {/* Step 1: Search Service Point & Check Available Slots */}
      <section className="space-y-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Search Service Point & Book Available Slot
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Search by area or point name, check live slot availability for your date, and book instantly.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">
              Search Service Point / Area
            </label>
            <input
              placeholder="Search e.g., Uttara, Dhanmondi, Gulshan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3.5 py-2 outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Select Date to Check Slots
            </label>
            <input
              type="date"
              value={checkDate}
              onChange={(e) => setCheckDate(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredPoints.map((pt) => {
            const availableSlots = getAvailableSlots(pt.name, checkDate);
            const isFull = availableSlots === 0;
            return (
              <div
                key={pt.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <h2 className="text-sm font-bold text-slate-900">{pt.name}</h2>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        isFull
                          ? "bg-red-100 text-red-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {availableSlots} / {pt.slotsPerDay} slots free
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{pt.address}</p>
                  <p className="text-[11px] text-slate-400">Off Day: {pt.offDays}</p>
                </div>

                <button
                  disabled={isFull}
                  onClick={() => handleOpenBooking(pt.name, 1)}
                  className={`w-full py-2 rounded-lg text-xs font-semibold transition ${
                    isFull
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-2xs"
                  }`}
                >
                  {isFull ? "No Slots Available" : "Book Available Slot"}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Step 2: Services Catalog */}
      <section className="space-y-4">
        <h2 className="text-lg font-extrabold text-slate-900">Available Wash & Repair Packages</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {servicesList.map((srv) => (
            <div
              key={srv.id}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-900">{srv.name}</h3>
                  <span className="text-xs font-bold text-blue-600">{srv.price}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{srv.description}</p>
                <p className="text-[11px] text-slate-400 mt-1">⏱ {srv.time}</p>
              </div>
              <button
                onClick={() =>
                  handleOpenBooking(verifiedPoints[0]?.name || "Uttara Wash Point", srv.id)
                }
                className="text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 py-1.5 rounded-lg transition"
              >
                Select & Book
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Step 3: Bookings & Mutual-Exclusion SSLCommerz Payment */}
      <section className="space-y-4 pt-4 border-t border-slate-200">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">
            Bookings & SSLCommerz Payment ({bookings.length})
          </h2>
          <p className="text-xs text-slate-500">
            Once service is marked <strong>Completed</strong> by Admin, either the <strong>Biker</strong> OR the <strong>Service Point</strong> can complete payment via SSLCommerz Sandbox (strictly one-time lock).
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-6 text-xs text-slate-500">
            No bookings yet. Search a service point above and book a slot!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookings.map((b) => {
              const isCompleted = b.status === "Completed";
              const isPaid = b.paymentStatus === "Paid";

              return (
                <div
                  key={b.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3 text-xs"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {b.serviceName} · <span className="text-blue-600">{b.price}</span>
                      </h3>
                      <p className="text-slate-600 mt-0.5">
                        📍 <strong>{b.servicePoint}</strong> · 📅 {b.date} ({b.timeSlot})
                      </p>
                      <p className="text-slate-500 mt-0.5">
                        🏍️ {b.bikeModel} · 👤 {b.customerName} ({b.customerPhone})
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          b.status === "Completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : b.status === "Confirmed"
                            ? "bg-blue-100 text-blue-700"
                            : b.status === "Cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {b.status}
                      </span>

                      {b.fraudAnalysis?.isFraud && (
                        <span className="bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded text-[10px] font-bold">
                          AI Fraud Flag ({b.fraudAnalysis.score}%)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Payment Section (Only after Service is Done/Completed) */}
                  <div className="pt-3 border-t border-slate-100">
                    {!isCompleted ? (
                      <p className="text-[11px] text-slate-400">
                        Payment via SSLCommerz unlocks once Admin marks this service as <strong>Completed</strong>.
                      </p>
                    ) : isPaid ? (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-emerald-800">
                            ✓ Paid via SSLCommerz by {b.paidBy}
                          </p>
                          <p className="text-[11px] text-emerald-700">
                            TranID: {b.transactionId} · Other party payment locked
                          </p>
                        </div>
                        <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded">
                          LOCKED
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-[11px] font-semibold text-slate-700">
                          Service Done! Choose who completes the SSLCommerz Sandbox payment (Only one allowed):
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            disabled={payingId === b.id}
                            onClick={() =>
                              handleSSLCommerzPayment(
                                b.id,
                                b.numericPrice,
                                b.customerName,
                                b.customerPhone,
                                b.serviceName,
                                "Biker"
                              )
                            }
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-lg transition text-center"
                          >
                            {payingId === b.id ? "Redirecting..." : "Pay as Biker"}
                          </button>

                          <button
                            disabled={payingId === b.id}
                            onClick={() =>
                              handleSSLCommerzPayment(
                                b.id,
                                b.numericPrice,
                                b.customerName,
                                b.customerPhone,
                                b.serviceName,
                                "Service Point"
                              )
                            }
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-3 rounded-lg transition text-center"
                          >
                            {payingId === b.id ? "Redirecting..." : "Pay as Service Point"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Slot Booking Modal */}
      {selectedPoint && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Book Slot at {selectedPoint}</h3>
                <p className="text-xs text-emerald-600 font-semibold">
                  Date: {checkDate} · Available Slots: {getAvailableSlots(selectedPoint, checkDate)}
                </p>
              </div>
              <button
                onClick={() => setSelectedPoint("")}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {bookingAlert && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-3 text-xs">
                {bookingAlert}
              </div>
            )}

            <form onSubmit={handleConfirmBooking} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Service</label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none"
                >
                  {servicesList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.price})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Your Name</label>
                  <input
                    required
                    placeholder="e.g., Tanvir Hasan"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    required
                    placeholder="01712345678"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none"
                  />
                </div>
              </div>

              </div>
                <label className="block font-semibold text-slate-700 mb-1">Bike Model</label>