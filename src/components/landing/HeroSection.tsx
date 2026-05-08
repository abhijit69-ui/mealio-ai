"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play, Clock, Leaf, RefreshCw } from "lucide-react";
import { authClient } from "@/lib/authClient";

const stats = [
  { icon: Clock, label: "Plan in minutes" },
  { icon: Leaf, label: "Balanced nutrition" },
  { icon: RefreshCw, label: "Track & improve" },
];

const demoMeals = [
  {
    emoji: "☀️",
    type: "Breakfast",
    name: "Oat Meal",
    desc: "Oats with fruits, nuts and banana",
    kcal: "150 kcal",
    protein: "30g P",
    carbs: "55g C",
    fat: "23g F",
    color: "#F59E0B",
  },
  {
    emoji: "🥗",
    type: "Lunch",
    name: "Grilled Chicken Salad",
    desc: "Chicken with mixed greens, quinoa",
    kcal: "450 kcal",
    protein: "40g P",
    carbs: "45g C",
    fat: "20g F",
    color: "#7DC52A",
  },
  {
    emoji: "🌙",
    type: "Dinner",
    name: "Baked Salmon",
    desc: "Salmon with quinoa and broccoli",
    kcal: "520 kcal",
    protein: "38g P",
    carbs: "42g C",
    fat: "22g F",
    color: "#8B5CF6",
  },
];

const days = ["Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"];

export default function HeroSection() {
  const { data: session } = authClient.useSession();
  const isAuthenticated = !!session?.user;
  const ctaHref = isAuthenticated ? "/client/planner" : "/sign-up";

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-6 pt-16 pb-12">
      {/* ── Background ── */}
      <div className="pointer-events-none absolute inset-0">
        {/* Base gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 60% 40%, #7DC52A0A 0%, transparent 60%)",
          }}
        />
        {/* Soft noise grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "128px",
          }}
        />
        {/* Top-left soft blob */}
        <div
          className="absolute -top-32 -left-32 h-125 w-125 rounded-full opacity-40"
          style={{
            background:
              "radial-gradient(circle, #7DC52A08 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-6xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-8">
          {/* ── LEFT: Copy ── */}
          <div className="z-10 flex flex-col gap-7">
            {/* Badge */}
            <div className="flex">
              <span
                className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold"
                style={{
                  color: "#7DC52A",
                  borderColor: "#7DC52A40",
                  background: "#7DC52A10",
                }}
              >
                <span
                  className="h-1.5 w-1.5 animate-pulse rounded-full"
                  style={{ background: "#7DC52A" }}
                />
                AI-Powered Meal Planning
              </span>
            </div>

            {/* Headline */}
            <div className="flex flex-col gap-1">
              <h1 className="text-foreground text-5xl leading-[1.05] font-extrabold tracking-tight md:text-6xl">
                Eat Better.
              </h1>
              <h1 className="text-5xl leading-[1.05] font-extrabold tracking-tight md:text-6xl">
                Plan{" "}
                <span
                  className="relative inline-block"
                  style={{ color: "#7DC52A" }}
                >
                  Smarter.
                  {/* Underline squiggle */}
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 200 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 6 Q25 2 50 6 Q75 10 100 6 Q125 2 150 6 Q175 10 200 6"
                      stroke="#7DC52A"
                      strokeWidth="2"
                      strokeLinecap="round"
                      fill="none"
                      opacity="0.6"
                    />
                  </svg>
                </span>
              </h1>
            </div>

            {/* Subtext */}
            <p className="text-muted-foreground max-w-md text-base leading-relaxed md:text-lg">
              Mealio.ai creates personalized weekly meal plans based on your
              goals, preferences and lifestyle.
            </p>

            {/* CTA buttons */}
            <div className="flex items-center gap-3">
              <Link
                href={ctaHref}
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:opacity-90 hover:shadow-xl active:scale-95 sm:px-6 sm:py-3"
                style={{
                  background: "linear-gradient(135deg, #7DC52A, #5fa31e)",
                  boxShadow: "0 4px 20px #7DC52A40",
                }}
              >
                Get Started Free
                <ArrowRight size={16} />
              </Link>

              <a
                href="#how-it-works"
                className="text-foreground border-border hover:bg-accent inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition-all duration-200 sm:px-6 sm:py-2"
              >
                <span
                  className="flex h-5 w-5 items-center justify-center rounded-full sm:h-7 sm:w-7"
                  style={{
                    background: "#7DC52A15",
                    border: "1px solid #7DC52A40",
                  }}
                >
                  <Play size={10} fill="#7DC52A" stroke="none" />
                </span>
                See How It Works
              </a>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap items-center gap-5 pt-2">
              {stats.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="text-muted-foreground flex items-center gap-2 text-sm"
                >
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                    style={{ background: "#7DC52A15" }}
                  >
                    <Icon size={13} style={{ color: "#7DC52A" }} />
                  </span>
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Visual stack ── */}
          <div className="relative flex h-130 items-center justify-center lg:h-145 lg:justify-end">
            {/* Bowl — top right, partially clipped */}
            <div
              className="pointer-events-none absolute -top-6 -right-6 z-20 h-45 w-45 select-none lg:-right-10 lg:h-55 lg:w-55"
              style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.15))" }}
            >
              <Image
                src="/images/bowl-hero.png"
                alt="Food bowl"
                fill
                className="object-contain"
                style={{ transform: "rotate(12deg)" }}
              />
            </div>

            {/* Avocado — bottom left */}
            <div
              className="pointer-events-none absolute -bottom-4 -left-4 z-20 h-50 w-40 select-none lg:-left-8 lg:h-60 lg:w-47.5"
              style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.12))" }}
            >
              <Image
                src="/images/avocado-hero.png"
                alt="Avocado"
                fill
                className="object-contain"
                style={{ transform: "rotate(-8deg)" }}
              />
            </div>

            {/* Demo card */}
            <div
              className="relative z-10 w-full max-w-105 overflow-hidden rounded-2xl shadow-2xl lg:max-w-115"
              style={{
                background: "var(--background)",
                border: "1px solid var(--border)",
                boxShadow:
                  "0 24px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.08)",
              }}
            >
              {/* Card header */}
              <div className="border-border border-b px-5 pt-5 pb-3">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="text-foreground text-base font-bold">
                      My Weekly Plan
                    </h3>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      May 7 – May 13, 2026
                    </p>
                  </div>
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold"
                    style={{ background: "#7DC52A15", color: "#7DC52A" }}
                  >
                    + Edit Plan
                  </span>
                </div>

                {/* Day pills */}
                <div className="scrollbar-none flex items-center gap-1.5 overflow-x-auto pb-1">
                  {days.map((day, i) => (
                    <button
                      key={day}
                      className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                        i === 0
                          ? "text-white"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                      style={i === 0 ? { background: "#7DC52A" } : {}}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Meal rows */}
              <div className="divide-border divide-y">
                {demoMeals.map(
                  ({
                    emoji,
                    type,
                    name,
                    desc,
                    kcal,
                    protein,
                    carbs,
                    fat,
                    color,
                  }) => (
                    <div key={type} className="px-5 py-4">
                      {/* Meal type label */}
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                          <span>{emoji}</span>
                          {type}
                        </span>
                        <span className="text-muted-foreground text-[10px]">
                          •••
                        </span>
                      </div>

                      {/* Meal info row */}
                      <div className="flex items-center gap-3">
                        {/* Color dot / thumbnail placeholder */}
                        <div
                          className="h-10 w-10 shrink-0 rounded-xl"
                          style={{
                            background: `${color}20`,
                            border: `1px solid ${color}30`,
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-foreground truncate text-sm font-semibold">
                            {name}
                          </p>
                          <p className="text-muted-foreground truncate text-xs">
                            {desc}
                          </p>
                        </div>
                      </div>

                      {/* Macros */}
                      <div className="mt-3 grid grid-cols-4 gap-1">
                        {[
                          { label: kcal, icon: "🔥" },
                          { label: protein, icon: "🩷" },
                          { label: carbs, icon: "🌾" },
                          { label: fat, icon: "💧" },
                        ].map(({ label, icon }) => (
                          <div
                            key={label}
                            className="text-muted-foreground flex items-center gap-1 text-[10px]"
                          >
                            <span>{icon}</span>
                            <span className="font-medium">{label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ),
                )}
              </div>

              {/* Card footer */}
              <div
                className="flex items-center justify-between px-5 py-3"
                style={{ background: "#7DC52A08" }}
              >
                <span className="text-muted-foreground text-xs">
                  3 meals planned today
                </span>
                <span
                  className="text-xs font-semibold"
                  style={{ color: "#7DC52A" }}
                >
                  1,120 kcal total
                </span>
              </div>
            </div>

            {/* Floating badge — top left of card */}
            <div
              className="text-foreground absolute top-10 left-0 z-30 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold shadow-lg lg:-left-4"
              style={{
                background: "var(--background)",
                border: "1px solid var(--border)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
              }}
            >
              <span
                className="h-2 w-2 animate-pulse rounded-full"
                style={{ background: "#7DC52A" }}
              />
              Plan generated ✓
            </div>

            {/* Floating badge — bottom right of card */}
            <div
              className="text-foreground absolute right-0 bottom-12 z-30 flex flex-col gap-0.5 rounded-xl px-3 py-2 text-xs shadow-lg lg:-right-4"
              style={{
                background: "var(--background)",
                border: "1px solid var(--border)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
              }}
            >
              <span className="text-sm font-bold" style={{ color: "#7DC52A" }}>
                🔥 1,120 kcal
              </span>
              <span className="text-muted-foreground text-[10px]">
                Daily target on track
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
