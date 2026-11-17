import Link from "next/link";

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-14">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-500 text-white p-8 sm:p-14 text-center shadow-lg">
        <div className="relative z-10 space-y-4 max-w-xl mx-auto">
          <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Fast & Trusted Bike Care
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Clean bike, every ride.
          </h1>
          <p className="text-sm sm:text-base text-blue-100">
            Book a bike wash or repair at a service point near you, done by trusted bikers.
          </p>
          <div className="pt-3 flex justify-center items-center gap-3">
            <Link
              href="/services"
              className="bg-white text-blue-700 hover:bg-blue-50 text-sm font-bold px-6 py-2.5 rounded-lg shadow-md transition"
            >
              View Services
            </Link>
            <Link
              href="/service-points"
              className="bg-blue-700/50 hover:bg-blue-700/70 text-white border border-white/30 text-sm font-semibold px-6 py-2.5 rounded-lg transition"
            >
              Find a Point
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white border border-blue-100 rounded-xl p-6 shadow-xs space-y-2">
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-md">
              Step 1
            </span>
            <h3 className="text-base font-bold text-slate-900">Choose a service</h3>
            <p className="text-xs text-slate-500">Pick the wash or detailing package that fits your bike.</p>
          </div>

          <div className="bg-white border border-indigo-100 rounded-xl p-6 shadow-xs space-y-2">
            <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-md">
              Step 2
            </span>
            <h3 className="text-base font-bold text-slate-900">Pick a service point</h3>
            <p className="text-xs text-slate-500">Find the nearest open wash point on our live map.</p>
          </div>

          <div className="bg-white border border-emerald-100 rounded-xl p-6 shadow-xs space-y-2">
            <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-md">
              Step 3
            </span>
            <h3 className="text-base font-bold text-slate-900">Get it done</h3>
            <p className="text-xs text-slate-500">A verified biker washes it, and you ride away clean.</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900">Popular services</h2>
          <Link href="/services" className="text-xs font-semibold text-blue-600 hover:underline">
            See all services →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white border-t-4 border-t-blue-500 border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900">Basic Wash</h3>
              <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">
                Tk 150
              </span>
            </div>
            <p className="text-xs text-slate-500">Exterior water wash and dry.</p>
          </div>

          <div className="bg-white border-t-4 border-t-indigo-500 border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900">Foam Wash</h3>
              <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full">
                Tk 250
              </span>
            </div>
            <p className="text-xs text-slate-500">Foam wash, chain clean and dry.</p>
          </div>

          <div className="bg-white border-t-4 border-t-amber-500 border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900">Full Detailing</h3>
              <span className="bg-amber-50 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">
                Tk 600
              </span>
            </div>
            <p className="text-xs text-slate-500">Deep clean, polish and chain lube.</p>
          </div>
        </div>
      </section>
    </div>
  );
}