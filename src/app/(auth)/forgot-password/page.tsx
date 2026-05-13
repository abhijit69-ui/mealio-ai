import ForgotPasswordForm from "./_components/forgot-password-form";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <Link
        href="/sign-in"
        className="text-muted-foreground hover:text-foreground group absolute top-6 left-6 inline-flex items-center gap-1.5 text-sm transition-colors duration-200"
      >
        <ArrowLeft
          size={15}
          className="transition-transform duration-200 group-hover:-translate-x-0.5"
        />
        Back to Sign In
      </Link>

      <Link href="/" className="mb-10 flex items-center gap-2">
        <Image
          src="/logo.png"
          alt="Mealio.ai"
          width={32}
          height={32}
          className="rounded-lg"
        />
        <span className="text-foreground text-xl font-bold tracking-tight">
          Mealio<span style={{ color: "#7DC52A" }}>.ai</span>
        </span>
      </Link>

      <ForgotPasswordForm />
    </div>
  );
}
