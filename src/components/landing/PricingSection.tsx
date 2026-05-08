"use client";

import Link from "next/link";
import { Check, Star } from "lucide-react";
import Image from "next/image";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/ month",
    description: "Perfect for getting started with meal planning.",
    cta: "Get Started",
    ctaHref: "/sign-up",
    highlighted: false,
    features: [
      "1 meal plan per week",
      "Basic nutrition info",
      "Manage your foods",
      "7-day planner view",
    ],
  },
  {
    name: "Pro",
    badge: "Most Popular",
    price: "$4.99",
    period: "/ month",
    description: "For those serious about nutrition and consistency.",
    cta: "Start Free Trial",
    ctaHref: "/pricing",
    highlighted: true,
    features: [
      "Unlimited meal plans",
      "Advanced nutrition insights",
      "Priority support",
      "AI plan generation",
      "More coming soon",
    ],
  },
];

// Placeholder avatar slots — replace src with real images later
const avatars = [
  { src: "/images/avatar-1.jpg", alt: "User 1" },
  { src: "/images/avatar-2.jpg", alt: "User 2" },
  { src: "/images/avatar-3.jpg", alt: "User 3" },
  { src: "/images/avatar-4.jpg", alt: "User 4" },
  { src: "/images/avatar-5.jpg", alt: "User 5" },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="relative overflow-hidden px-6 py-24">
      {/* Background tint */}
      <div className="bg-muted/30 pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-14 lg:flex-row lg:items-start">
          {/* Left — social proof */}
          <div className="flex w-full flex-col gap-6 lg:max-w-sm lg:pt-5">
            <p
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: "#7DC52A" }}
            >
              Pricing
            </p>
            <h2 className="text-foreground text-3xl leading-tight font-bold tracking-tight md:text-4xl">
              Start your healthy journey today
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              Join thousands of people saving time, eating better and achieving
              their goals with Mealio.ai.
            </p>

            {/* Avatars + stars */}
            <div className="mt-2 flex flex-col gap-3">
              {/* Stacked avatars */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {avatars.map((avatar, i) => (
                    <div
                      key={i}
                      className="border-background bg-muted text-muted-foreground flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border-2 text-xs font-semibold"
                      style={{ zIndex: avatars.length - i }}
                    >
                      {/* Avatar image — add src once you place images in /public/images */}
                      <Image
                        src={avatar.src}
                        alt={avatar.alt}
                        width={28}
                        height={28}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          // Fallback to initials if image not found
                          const el = e.currentTarget;
                          el.style.display = "none";
                          el.parentElement!.innerHTML = `<span class="text-xs font-semibold text-muted-foreground">${String.fromCharCode(65 + i)}</span>`;
                        }}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-foreground text-sm font-medium">
                  Loved by{" "}
                  <span style={{ color: "#7DC52A" }} className="font-bold">
                    1,000+
                  </span>{" "}
                  users
                </p>
              </div>

              {/* 5 stars */}
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} fill="#FBBF24" stroke="none" />
                ))}
                <span className="text-muted-foreground ml-2 text-sm">
                  5.0 — from early users
                </span>
              </div>
            </div>
          </div>

          {/* Right — pricing cards */}
          <div className="flex w-full flex-col gap-5 sm:flex-row lg:flex-1">
            {plans.map(
              ({
                name,
                badge,
                price,
                period,
                description,
                cta,
                ctaHref,
                highlighted,
                features,
              }) => (
                <div
                  key={name}
                  className={`relative flex flex-1 flex-col rounded-2xl border p-7 transition-all duration-300 ${
                    highlighted
                      ? "border-[#7DC52A] shadow-xl"
                      : "border-border bg-background hover:border-border/80"
                  }`}
                  style={
                    highlighted
                      ? {
                          background:
                            "linear-gradient(145deg, #7DC52A0C 0%, transparent 60%)",
                        }
                      : {}
                  }
                >
                  {/* Top glow line for highlighted */}
                  {highlighted && (
                    <div
                      className="absolute inset-x-0 top-0 h-px rounded-full"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, #7DC52A, transparent)",
                      }}
                    />
                  )}

                  {/* Badge */}
                  {badge && (
                    <span
                      className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[11px] font-bold text-white shadow"
                      style={{ background: "#7DC52A" }}
                    >
                      {badge}
                    </span>
                  )}

                  {/* Plan name */}
                  <p className="text-muted-foreground mb-1 text-sm font-semibold">
                    {name}
                  </p>

                  {/* Price */}
                  <div className="mb-2 flex items-end gap-1">
                    <span className="text-foreground text-4xl font-extrabold tracking-tight">
                      {price}
                    </span>
                    <span className="text-muted-foreground mb-1 text-sm">
                      {period}
                    </span>
                  </div>

                  <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                    {description}
                  </p>

                  {/* Features */}
                  <ul className="mb-8 flex flex-1 flex-col gap-3">
                    {features.map((f) => (
                      <li
                        key={f}
                        className="text-foreground flex items-start gap-2 text-sm"
                      >
                        <span
                          className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                          style={{ background: "#7DC52A20" }}
                        >
                          <Check
                            size={10}
                            style={{ color: "#7DC52A" }}
                            strokeWidth={3}
                          />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    href={ctaHref}
                    className={`w-full rounded-xl py-3 text-center text-sm font-semibold transition-all duration-200 hover:scale-[1.01] hover:opacity-90 active:scale-95 ${
                      highlighted
                        ? "text-white shadow-md"
                        : "border-border text-foreground hover:bg-accent border"
                    }`}
                    style={highlighted ? { background: "#7DC52A" } : {}}
                  >
                    {cta}
                  </Link>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
