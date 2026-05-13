import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import { Resend } from "resend";
import db from "./db";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "onboarding@resend.dev";
const APP_URL = process.env.BETTER_AUTH_URL || "http://localhost:3000";

export const auth = betterAuth({
  // ─── CRITICAL: Required for signing tokens ───
  secret: process.env.BETTER_AUTH_SECRET!,

  // ─── CRITICAL: Required so generated links point to your domain ───
  baseURL: APP_URL,

  database: prismaAdapter(db, { provider: "postgresql" }),
  appName: "Mealio",

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,

    // ─── PASSWORD RESET ───
    sendResetPassword: async ({ user, url, token }) => {
      // token was missing before! Now we use it to build the reset link
      const resetUrl = `${APP_URL}/reset-password?token=${token}`;

      await resend.emails.send({
        from: FROM_EMAIL,
        to: user.email,
        subject: "Reset your Mealio password",
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#fff;border-radius:12px;">
            <div style="margin-bottom:24px;">
              <h1 style="font-size:24px;font-weight:800;color:#111;margin:0;">
                Mealio<span style="color:#7DC52A">.ai</span>
              </h1>
            </div>
            <h2 style="font-size:20px;font-weight:700;color:#111;margin-bottom:8px;">
              Reset your password
            </h2>
            <p style="color:#555;font-size:14px;line-height:1.6;margin-bottom:24px;">
              We received a request to reset your password. Click the button below to choose a new one. This link expires in 1 hour.
            </p>
            <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#7DC52A,#5fa31e);color:#fff;font-weight:600;font-size:14px;padding:12px 28px;border-radius:8px;text-decoration:none;">
              Reset Password
            </a>
            <p style="color:#999;font-size:12px;margin-top:24px;line-height:1.6;">
              If you didn't request this, you can safely ignore this email. Your password won't change.
            </p>
          </div>
        `,
      });
    },
  },

  // ─── EMAIL VERIFICATION ───
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,

    sendVerificationEmail: async ({ user, url, token }) => {
      // Send user to your custom verify page with the token
      const verifyUrl = `${APP_URL}/verify-email?token=${token}`;

      await resend.emails.send({
        from: FROM_EMAIL,
        to: user.email,
        subject: "Verify your Mealio email",
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#fff;border-radius:12px;">
            <div style="margin-bottom:24px;">
              <h1 style="font-size:24px;font-weight:800;color:#111;margin:0;">
                Mealio<span style="color:#7DC52A">.ai</span>
              </h1>
            </div>
            <h2 style="font-size:20px;font-weight:700;color:#111;margin-bottom:8px;">
              Verify your email
            </h2>
            <p style="color:#555;font-size:14px;line-height:1.6;margin-bottom:24px;">
              Thanks for signing up! Click the button below to verify your email address and get started.
            </p>
            <a href="${verifyUrl}" style="display:inline-block;background:linear-gradient(135deg,#7DC52A,#5fa31e);color:#fff;font-weight:600;font-size:14px;padding:12px 28px;border-radius:8px;text-decoration:none;">
              Verify Email
            </a>
            <p style="color:#999;font-size:12px;margin-top:24px;line-height:1.6;">
              If you didn't create an account, you can safely ignore this email.
            </p>
          </div>
        `,
      });
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  plugins: [admin()],

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
      },
    },
  },
});
