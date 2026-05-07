"use client";

import { Sparkles, Apple, LayoutGrid, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Plans",
    description:
      "Our AI creates personalized meal plans based on your goals, preferences and nutrition needs.",
    accent: "#7DC52A",
  },
  {
    icon: Apple,
    title: "Smart Nutrition",
    description:
      "Get balanced meals with the right calories, macros and nutrients to support your goals.",
    accent: "#7DC52A",
  },
  {
    icon: LayoutGrid,
    title: "Manage Your Foods",
    description:
      "Easily manage foods, categories and serving units to customize your meal planning.",
    accent: "#7DC52A",
  },
  {
    icon: TrendingUp,
    title: "Plan & Track",
    description:
      "Plan your week and track your meals to stay consistent and reach your goals.",
    accent: "#7DC52A",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative overflow-hidden px-6 py-24">
      {/* Subtle background texture */}
      <div className="bg-muted/30 pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-6xl">
        {/* Heading */}
        <div className="mb-14 text-center">
          <p
            className="mb-3 text-xs font-semibold tracking-widest uppercase"
            style={{ color: "#7DC52A" }}
          >
            Why Mealio.ai
          </p>
          <h2 className="text-foreground text-3xl font-bold tracking-tight md:text-4xl">
            Everything you need to plan better meals
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-base">
            A complete toolkit for building healthy habits — from smart planning
            to detailed nutrition tracking.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }, i) => (
            <div
              key={title}
              className="group bg-background border-border relative rounded-2xl border p-6 transition-all duration-300 hover:border-[#7DC52A]/40 hover:shadow-lg"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Top glow on hover */}
              <div
                className="absolute inset-x-0 top-0 h-px rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, #7DC52A80, transparent)",
                }}
              />

              {/* Icon */}
              <div
                className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                style={{ background: "#7DC52A18" }}
              >
                <Icon size={20} style={{ color: "#7DC52A" }} />
              </div>

              {/* Text */}
              <h3 className="text-foreground mb-2 text-base font-semibold">
                {title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
