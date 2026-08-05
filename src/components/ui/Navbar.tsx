"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass" id="navbar">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group" id="nav-logo">
            <span className="text-2xl">🏛️</span>
            <span className="font-display font-bold text-green-primary text-lg tracking-tight group-hover:text-green-mid transition-colors">
              Jelajah AR
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/timeline"
              className="px-4 py-2 rounded-lg text-dark font-medium hover:bg-green-light hover:text-green-primary transition-all duration-200"
              id="nav-timeline"
            >
              Timeline
            </Link>
            <Link
              href="/jelajah-virtual"
              className="px-4 py-2 rounded-lg text-dark font-medium hover:bg-green-light hover:text-green-primary transition-all duration-200"
              id="nav-jelajah-virtual"
            >
              Jelajah Virtual
            </Link>
            <Link
              href="/denah"
              className="px-4 py-2 rounded-lg text-dark font-medium hover:bg-green-light hover:text-green-primary transition-all duration-200"
              id="nav-denah"
            >
              Denah Situs
            </Link>
            <Link
              href="/#tentang"
              className="px-4 py-2 rounded-lg text-dark font-medium hover:bg-green-light hover:text-green-primary transition-all duration-200"
              id="nav-tentang"
            >
              Tentang
            </Link>
            <Link
              href="/scan"
              className="btn-primary text-sm ml-2"
              id="nav-cta"
            >
              📱 Scan QR
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-green-light transition-colors touch-target"
            aria-label="Toggle menu"
            id="nav-hamburger"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span
                className={`h-0.5 bg-dark rounded-full transition-all duration-300 ${
                  isOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`h-0.5 bg-dark rounded-full transition-all duration-300 ${
                  isOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`h-0.5 bg-dark rounded-full transition-all duration-300 ${
                  isOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isOpen ? "max-h-80 pb-4" : "max-h-0"
          }`}
        >
          <div className="flex flex-col gap-1 pt-2 border-t border-green-light">
            <Link
              href="/scan"
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 rounded-lg text-green-primary font-semibold hover:bg-green-light transition-colors"
              id="nav-mobile-scan"
            >
              📱 Scan QR Tumpukan
            </Link>
            <Link
              href="/timeline"
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 rounded-lg text-dark font-medium hover:bg-green-light transition-colors"
              id="nav-mobile-timeline"
            >
              📅 Timeline Situs
            </Link>
            <Link
              href="/jelajah-virtual"
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 rounded-lg text-dark font-medium hover:bg-green-light transition-colors"
              id="nav-mobile-jelajah"
            >
              🗺️ Jelajah Virtual
            </Link>
            <Link
              href="/denah"
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 rounded-lg text-dark font-medium hover:bg-green-light transition-colors"
              id="nav-mobile-denah"
            >
              📐 Denah Situs
            </Link>
            <Link
              href="/#tentang"
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 rounded-lg text-dark font-medium hover:bg-green-light transition-colors"
              id="nav-mobile-tentang"
            >
              ℹ️ Tentang Candi
            </Link>
          </div>
        </div>
      </div>

      {/* Kawung accent line */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-green-mid to-transparent opacity-50" />
    </nav>
  );
}
