"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { authClient } from "@/lib/authClient";
import ThemeToggle from "../theme-toggle";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = authClient.useSession();
  const isAuthenticated = !!session?.user;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 1);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change / resize
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const ctaHref = isAuthenticated ? "/client/planner" : "/sign-up";

  return (
    <>
      <header
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/80 border-border border-b shadow-sm backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <Image
              src="/logo.png"
              alt="Mealio.ai logo"
              width={30}
              height={30}
              className="rounded-lg"
            />
            <span className="text-foreground text-lg font-bold tracking-tight">
              Mealio
              <span style={{ color: "#7DC52A" }}>.ai</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="text-muted-foreground hover:text-foreground rounded-md px-4 py-2 text-sm transition-colors duration-200"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop right side */}
          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />

            {!isAuthenticated && (
              <Link
                href="/sign-in"
                className="text-foreground border-border hover:bg-accent rounded-lg border px-4 py-2 text-sm font-medium transition-colors duration-200"
              >
                Log in
              </Link>
            )}

            <Link
              href={ctaHref}
              className="rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] hover:opacity-90 active:scale-95"
              style={{ background: "#7DC52A", color: "#fff" }}
            >
              {isAuthenticated ? "Go to App" : "Get Started"}
            </Link>
          </div>

          {/* Mobile: theme toggle + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="border-border text-foreground hover:bg-accent flex h-9 w-9 items-center justify-center rounded-full border transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 md:hidden ${
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        {/* Backdrop */}
        <div
          className="bg-background/60 absolute inset-0 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />

        {/* Drawer */}
        <div
          className={`bg-background border-border absolute top-16 right-0 left-0 border-b shadow-xl transition-all duration-300 ${
            mobileOpen ? "translate-y-0" : "-translate-y-4"
          }`}
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6">
            {navLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200"
              >
                {label}
              </a>
            ))}

            <div className="bg-border my-2 h-px" />

            {!isAuthenticated && (
              <Link
                href="/sign-in"
                onClick={() => setMobileOpen(false)}
                className="text-foreground border-border hover:bg-accent rounded-lg border px-4 py-3 text-center text-sm font-medium transition-colors duration-200"
              >
                Log in
              </Link>
            )}

            <Link
              href={ctaHref}
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-4 py-3 text-center text-sm font-semibold transition-all duration-200 hover:opacity-90"
              style={{ background: "#7DC52A", color: "#fff" }}
            >
              {isAuthenticated ? "Go to App" : "Get Started"}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
