"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./globals.css";
import { BikeWashProvider } from "./context/BikeWashContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Service Points", href: "/service-points" },
    { name: "Services", href: "/services" },
    { name: "Bikers", href: "/bikers" },
    { name: "Point Reg", href: "/service-point-registration" },
    { name: "Biker Reg", href: "/biker-registration" },
    { name: "Admin", href: "/admin" },
  ];

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="bg-slate-50 text-slate-900 min-h-screen flex flex-col justify-between font-sans"
      >
        <BikeWashProvider>
          <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-blue-100 shadow-xs">
            <div className="max-w-5xl mx-auto px-6 py-4 flex flex-wrap justify-between items-center gap-3">
              <Link href="/" className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
                  BW
                </span>
                <span className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  BikeWash
                </span>
              </Link>

              <nav className="flex flex-wrap gap-2 text-xs sm:text-sm">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-3 py-1.5 rounded-full transition-all ${
                        isActive
                          ? "bg-blue-600 text-white font-semibold shadow-sm"
                          : "text-slate-600 hover:bg-blue-50 hover:text-blue-600 font-medium"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </header>

          <main className="flex-grow">{children}</main>

          <footer className="w-full py-6 text-center text-xs text-slate-500 bg-white border-t border-slate-200/70">
            © 2026 <span className="font-semibold text-blue-600">BikeWash</span> · Clean Bike, Every Ride.
          </footer>
        </BikeWashProvider>
      </body>
    </html>
  );
}