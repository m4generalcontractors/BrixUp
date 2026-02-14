"use client";

import { useState, useEffect } from "react";

const navLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "For Investors", href: "#for-investors" },
  { label: "For Builders", href: "#for-builders" },
  { label: "Tokenomics", href: "#tokenomics" },
  { label: "Team", href: "#team" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-dark/95 backdrop-blur-md shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <span className="font-[var(--font-display)] text-2xl font-bold tracking-tight text-offwhite">
              Brix<span className="text-gold">Up</span>
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-offwhite/70 transition-colors hover:text-gold"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <a
              href="#"
              className="inline-flex items-center rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-dark transition-all hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20"
            >
              Launch App
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex flex-col gap-1.5 md:hidden"
            aria-label="Toggle navigation menu"
          >
            <span
              className={`block h-0.5 w-6 bg-offwhite transition-all duration-300 ${
                mobileOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-offwhite transition-all duration-300 ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-offwhite transition-all duration-300 ${
                mobileOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden transition-all duration-300 md:hidden ${
          mobileOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="bg-dark/95 backdrop-blur-md px-4 pb-6 pt-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-base font-medium text-offwhite/70 transition-colors hover:text-gold"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#"
            className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-gold px-5 py-3 text-sm font-semibold text-dark transition-all hover:bg-gold-light"
          >
            Launch App
          </a>
        </div>
      </div>
    </nav>
  );
}
