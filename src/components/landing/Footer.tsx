"use client";

import Link from "next/link";
import Image from "next/image";
import { FaXTwitter, FaLinkedinIn, FaGithub } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
  ],
  Company: [
    { label: "About", href: "#about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

const socials = [
  { label: "Twitter", href: "https://twitter.com", icon: FaXTwitter },
  { label: "LinkedIn", href: "https://linkedin.com", icon: FaLinkedinIn },
  { label: "GitHub", href: "https://github.com", icon: FaGithub },
  { label: "Email", href: "mailto:hello@mealio.ai", icon: IoIosMail },
];

export default function Footer() {
  return (
    /*
      Light mode: #0e1208 — dark forest green, distinct from the cream page above
      Dark  mode: #060c05 — slightly deeper/cooler so it doesn't fight the
                            dark navy page background; stays in the same green
                            family but reads as footer rather than just more page
    */
    <footer className="relative overflow-hidden bg-[#0e1208] text-white dark:bg-[#060c05]">
      {/* Subtle green glow top edge — unchanged */}
      <div
        className="absolute top-0 left-1/2 h-px w-150 -translate-x-1/2"
        style={{
          background:
            "linear-gradient(90deg, transparent, #7DC52A55, transparent)",
        }}
      />
      {/* Faint radial glow — unchanged */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 h-75 w-200 -translate-x-1/2"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, #7DC52A0D 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-8">
        {/* Top row: brand + links */}
        <div className="grid grid-cols-1 gap-10 border-b border-white/10 pb-12 md:grid-cols-5">
          {/* Brand col — full width on mobile, 2/5 on desktop */}
          <div className="flex flex-col gap-4 md:col-span-2">
            <Link href="/" className="flex w-fit items-center gap-2">
              <Image
                src="/logo.png"
                alt="Mealio.ai"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-xl font-bold tracking-tight">
                Mealio
                <span style={{ color: "#7DC52A" }}>.ai</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-white/50">
              Plan smarter, eat better. Personalized weekly meal plans built
              around your goals and lifestyle.
            </p>
            {/* Socials */}
            <div className="mt-2 flex items-center gap-3">
              {socials.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/40 transition-all duration-200 hover:border-white/30 hover:text-white"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/*
            FIX: Link groups wrapped in their own grid.
            Mobile:  grid-cols-2 → Product+Company side by side, Legal below
            sm+:     grid-cols-3 → all three in one row
            md:      col-span-3 fills the remaining columns of the parent 5-col grid
          */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-3 md:grid-cols-3">
            {Object.entries(footerLinks).map(([group, links]) => (
              <div key={group} className="flex flex-col gap-3">
                <p className="text-xs font-semibold tracking-widest text-white/30 uppercase">
                  {group}
                </p>
                <ul className="flex flex-col gap-2">
                  {links.map(({ label, href }) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="text-sm text-white/50 transition-colors duration-200 hover:text-white"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom row — unchanged */}
        <div className="flex flex-col items-center justify-between gap-4 pt-8 sm:flex-row">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Mealio.ai — All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-white/25">
            <span>Made with</span>
            <span style={{ color: "#7DC52A" }}>♥</span>
            <span>for healthy eating</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
