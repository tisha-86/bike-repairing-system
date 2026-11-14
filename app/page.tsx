import Link from "next/link";

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">
      {/* Hero Section */}
      <section className="text-center pt-6 pb-2 space-y-4">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
          Clean bike, every ride.
        </h1>
        <p className="text-sm sm:text-base text-gray-500 max-w-lg mx-auto">
          Book a bike wash at a service point near you, done by trusted bikers.
        </p>
        <div className="pt-2 flex justify-center items-center gap-3">
          <Link
            href="/services"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-md transition"
          >
            View Services
          </Link>
          <Link
            href="/service-points"
            className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 text-sm font-medium px-5 py-2.5 rounded-md transition"
          >
            Find a Point
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-5 space-y-1.5">
            <p className="text-xs text-gray-400">Step 1</p>
            <h3 className="text-sm font-semibold text-gray-900">Choose a service</h3>
            <p className="text-xs text-gray-500">Pick the wash that fits your bike.</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-5 space-y-1.5">
            <p className="text-xs text-gray-400">Step 2</p>
            <h3 className="text-sm font-semibold text-gray-900">Pick a service point</h3>
            <p className="text-xs text-gray-500">Find the nearest open point.</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-5 space-y-1.5">
            <p className="text-xs text-gray-400">Step 3</p>
            <h3 className="text-sm font-semibold text-gray-900">Get it done</h3>
            <p className="text-xs text-gray-500">A biker washes it, you ride away clean.</p>
          </div>
        </div>
      </section>

      {/* Popular services */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Popular services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-5 space-y-2">
            <h3 className="text-sm font-semibold text-gray-900">Basic Wash</h3>
            <p className="text-xs text-gray-500">Exterior water wash and dry.</p>
            <p className="text-sm font-bold text-gray-900 pt-1">Tk 150</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-5 space-y-2">
            <h3 className="text-sm font-semibold text-gray-900">Foam Wash</h3>
            <p className="text-xs text-gray-500">Foam wash, chain clean and dry.</p>
            <p className="text-sm font-bold text-gray-900 pt-1">Tk 250</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-5 space-y-2">
            <h3 className="text-sm font-semibold text-gray-900">Full Detailing</h3>
            <p className="text-xs text-gray-500">Deep clean, polish and chain lube.</p>
            <p className="text-sm font-bold text-gray-900 pt-1">Tk 600</p>
          </div>
        </div>
      </section>
    </div>
  );
}