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
  ];

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="bg-white text-gray-900 min-h-screen flex flex-col justify-between font-sans"
      >
        <BikeWashProvider>
          {/* Top Navbar */}
          <header className="w-full border-b border-gray-100">
            <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
              <Link href="/" className="text-lg font-bold tracking-tight text-gray-900">
                BikeWash
              </Link>
              <nav className="flex flex-wrap gap-5 text-sm">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`pb-0.5 transition ${
                        isActive
                          ? "text-gray-900 font-semibold border-b-2 border-gray-900"
                          : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-grow">{children}</main>

          {/* Footer */}
          <footer className="w-full py-6 text-center text-xs text-gray-500 border-t border-gray-100">
            © BikeWash
          </footer>
        </BikeWashProvider>
      </body>
    </html>
  );
}