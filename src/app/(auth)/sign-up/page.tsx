import SignUpForm from "./_components/sign-up-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user?.role === "admin") redirect("/admin/foods");
  if (session?.user?.role === "user") redirect("/client");

  return (
    <div className="flex min-h-screen">
      {/* ── LEFT: Form panel ── */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-16">
        {/* Back to home */}
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground group absolute top-6 left-6 inline-flex items-center gap-1.5 text-sm transition-colors duration-200"
        >
          <ArrowLeft
            size={15}
            className="transition-transform duration-200 group-hover:-translate-x-0.5"
          />
          Home
        </Link>

        {/* Logo — mobile only */}
        <Link href="/" className="mb-10 flex items-center gap-2 lg:hidden">
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

        <SignUpForm />
      </div>

      {/* ── RIGHT: Brand panel — hidden on mobile ── */}
      <div
        className="relative hidden flex-col items-center justify-center overflow-hidden lg:flex lg:w-[52%] xl:w-[55%]"
        style={{
          background:
            "linear-gradient(145deg, #0e1a05 0%, #162508 50%, #1a2e08 100%)",
        }}
      >
        {/* Dot grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `radial-gradient(circle, #7DC52A 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />

        {/* Radial glow */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 h-150 w-150 -translate-x-1/2 -translate-y-1/2"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, #7DC52A18 0%, transparent 65%)",
          }}
        />

        {/* Top-right soft blob */}
        <div
          className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full"
          style={{
            background:
              "radial-gradient(circle, #7DC52A12 0%, transparent 70%)",
          }}
        />

        {/* Bottom-left soft blob */}
        <div
          className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full"
          style={{
            background:
              "radial-gradient(circle, #7DC52A10 0%, transparent 70%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex max-w-md flex-col items-center gap-8 px-12 text-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Mealio.ai"
              width={36}
              height={36}
              className="rounded-xl"
            />
            <span className="text-2xl font-bold tracking-tight text-white">
              Mealio<span style={{ color: "#7DC52A" }}>.ai</span>
            </span>
          </Link>

          {/* Headline */}
          <div className="flex flex-col gap-3">
            <h2 className="text-4xl leading-tight font-extrabold tracking-tight text-white">
              Start eating
              <br />
              <span style={{ color: "#7DC52A" }}>with intention.</span>
            </h2>
            <p className="text-base leading-relaxed text-white/50">
              Create your free account and get your first personalized weekly
              meal plan in minutes.
            </p>
          </div>

          {/* Steps */}
          <div className="flex w-full flex-col gap-3 text-left">
            {[
              { step: "01", text: "Create your free account" },
              { step: "02", text: "Set your goals & preferences" },
              { step: "03", text: "Get your personalized meal plan" },
            ].map(({ step, text }) => (
              <div key={step} className="flex items-center gap-3">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                  style={{
                    background: "#7DC52A20",
                    color: "#7DC52A",
                    border: "1px solid #7DC52A35",
                  }}
                >
                  {step}
                </span>
                <span className="text-sm text-white/60">{text}</span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div
            className="h-px w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, #7DC52A30, transparent)",
            }}
          />

          {/* Social proof */}
          <p className="text-xs text-white/30">
            Join <span className="font-semibold text-white/60">1,000+</span>{" "}
            people already planning smarter meals
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
