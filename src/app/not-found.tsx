import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <main className="bg-background relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
      {/* Subtle dot grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(circle, #7DC52A 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Soft radial glow */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-150 w-150 -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, #7DC52A0C 0%, transparent 65%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex max-w-lg flex-col items-center gap-6 text-center">
        {/* Logo */}
        <Link href="/" className="mb-2 flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Mealio.ai"
            width={28}
            height={28}
            className="rounded-lg"
          />
          <span className="text-foreground text-lg font-bold tracking-tight">
            Mealio<span style={{ color: "#7DC52A" }}>.ai</span>
          </span>
        </Link>

        {/* 404 number */}
        <div className="relative select-none">
          <p
            className="text-[9rem] leading-none font-extrabold tracking-tighter sm:text-[11rem]"
            style={{
              color: "transparent",
              WebkitTextStroke: "2px #7DC52A30",
              background:
                "linear-gradient(135deg, #7DC52A18 0%, #7DC52A08 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
            }}
          >
            404
          </p>
          {/* Solid layered text on top for depth */}
          <p
            className="text-foreground absolute inset-0 flex items-center justify-center text-[9rem] leading-none font-extrabold tracking-tighter sm:text-[11rem]"
            style={{ opacity: 0.08 }}
          >
            404
          </p>
          {/* Green "0" accent */}
          <p
            className="absolute inset-0 flex items-center justify-center text-[9rem] leading-none font-extrabold tracking-tighter sm:text-[11rem]"
            style={{
              color: "transparent",
              WebkitTextStroke: "2px #7DC52A",
              letterSpacing: "-0.05em",
              opacity: 0.15,
            }}
          >
            404
          </p>
        </div>

        {/* Divider with icon */}
        <div className="flex w-full max-w-xs items-center gap-3">
          <div className="bg-border h-px flex-1" />
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-base"
            style={{ background: "#7DC52A15", border: "1px solid #7DC52A30" }}
          >
            🥗
          </span>
          <div className="bg-border h-px flex-1" />
        </div>

        {/* Heading + subtext */}
        <div className="flex flex-col gap-3">
          <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
            Oops! Page not found
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            Looks like this page took a healthy detour.
            <br />
            Let&apos;s get you back on track.
          </p>
        </div>

        {/* CTAs */}
        <div className="mt-2 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/client/planner"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:scale-[1.02] hover:opacity-90 active:scale-95 sm:w-auto"
            style={{
              background: "linear-gradient(135deg, #7DC52A, #5fa31e)",
              boxShadow: "0 4px 16px #7DC52A30",
            }}
          >
            Back to Dashboard
            <ArrowRight size={15} />
          </Link>

          <Link
            href="/"
            className="text-foreground border-border hover:bg-accent inline-flex w-full items-center justify-center gap-2 rounded-xl border px-6 py-3 text-sm font-medium transition-all duration-200 sm:w-auto"
          >
            <ArrowLeft size={15} />
            Go back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
