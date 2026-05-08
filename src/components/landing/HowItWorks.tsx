"use client";

import { ClipboardList, Sparkles, CalendarCheck } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Tell us about you",
    description:
      "Share your goals, dietary preferences, allergies and lifestyle so we can build around you.",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "AI creates your plan",
    description:
      "Our AI generates a personalized weekly meal plan tailored to your nutrition needs and taste.",
  },
  {
    number: "03",
    icon: CalendarCheck,
    title: "Review & enjoy",
    description:
      "Review your plan, swap meals if needed, then follow along and enjoy eating with purpose.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden px-6 py-24">
      {/* Faint radial green glow center */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-100 w-175 -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, #7DC52A09 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        {/* Heading */}
        <div className="mb-16 text-center">
          <p
            className="mb-3 text-xs font-semibold tracking-widest uppercase"
            style={{ color: "#7DC52A" }}
          >
            The Process
          </p>
          <h2 className="text-foreground text-3xl font-bold tracking-tight md:text-4xl">
            How Mealio.ai works
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-lg text-base">
            Getting started takes minutes. Three simple steps to a healthier,
            more organised week.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Connector line — desktop only */}
          <div
            className="pointer-events-none absolute top-10 right-[calc(16.66%+1.5rem)] left-[calc(16.66%+1.5rem)] hidden h-px md:block"
            style={{
              background:
                "linear-gradient(90deg, transparent, #7DC52A40, #7DC52A40, transparent)",
            }}
          />

          {steps.map(({ number, icon: Icon, title, description }, i) => (
            <div
              key={number}
              className="relative flex flex-col items-center gap-5 text-center"
            >
              {/* Step circle */}
              <div className="relative shrink-0">
                {/* Outer ring */}
                <div
                  className="flex h-20 w-20 items-center justify-center rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, #7DC52A18 0%, transparent 70%)",
                    border: "1px solid #7DC52A30",
                  }}
                >
                  {/* Inner circle */}
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-full shadow-sm"
                    style={{
                      background: "#7DC52A15",
                      border: "1px solid #7DC52A40",
                    }}
                  >
                    <Icon size={22} style={{ color: "#7DC52A" }} />
                  </div>
                </div>

                {/* Step number badge */}
                <span
                  className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white shadow"
                  style={{ background: "#7DC52A" }}
                >
                  {i + 1}
                </span>
              </div>

              {/* Text */}
              <div className="flex flex-col gap-2">
                <h3 className="text-foreground text-lg font-semibold">
                  {title}
                </h3>
                <p className="text-muted-foreground mx-auto max-w-xs text-sm leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Mobile step connector — vertical line between steps */}
              {i < steps.length - 1 && (
                <div
                  className="h-8 w-px md:hidden"
                  style={{
                    background:
                      "linear-gradient(180deg, #7DC52A50, transparent)",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
