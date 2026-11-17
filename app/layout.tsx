"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./globals.css";
import { BikeWashProvider, useBikeWash } from "./context/BikeWashContext";

function HeaderNavbar() {
  const pathname = usePathname();
  const { unreadCount } = useBikeWash();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Service Points", href: "/service-points" },
    { name: "Services", href: "/services" },
    { name: "Bikers", href: "/bikers" },
    { name: "Admin", href: "/admin" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-5xl mx-auto px-6 py-4 flex flex-wrap justify-between items-center gap-3">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-extrabold text-xs shadow-xs">
            BW
          </span>
          <span className="text-lg font-extrabold tracking-tight text-slate-900">
            BikeWash
          </span>
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          <nav className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    isActive
                      ? "bg-blue-50 text-blue-700 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Notification Bell Icon with Unread Badge */}
          <Link
            href="/admin"
            title="Admin Notifications"
            className="relative p-2 rounded-full text-slate-600 hover:bg-slate-100 transition"
          >
            <svg
              className="w-5 h-5 text-amber-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                {unreadCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="bg-slate-50 text-slate-900 min-h-screen flex flex-col justify-between font-sans"
      >
        <BikeWashProvider>
          <HeaderNavbar />
          <main className="flex-grow">{children}</main>
          <footer className="w-full py-6 text-center text-xs text-slate-500 bg-white border-t border-slate-200/70">
            © 2026 <span className="font-semibold text-blue-600">BikeWash</span> · Clean Bike, Every Ride.
          </footer>
        </BikeWashProvider>
      </body>
    </html>
  );
}