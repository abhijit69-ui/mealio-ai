export default function CheckEmailPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-2xl border p-8 text-center shadow-sm">
        <div className="mb-4 flex justify-center">
          <div
            className="flex size-16 items-center justify-center rounded-full"
            style={{ background: "#7DC52A15" }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#7DC52A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>
        </div>
        <h2 className="mb-2 text-xl font-bold">Check your email</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          We sent a verification link to your email. Click the link to activate
          your account.
        </p>
      </div>
    </div>
  );
}
