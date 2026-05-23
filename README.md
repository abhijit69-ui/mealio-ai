<p align="center">
  <img src="public/logo.png" alt="Mealio.ai Logo" width="72" height="72" />
</p>

<h1 align="center">Mealio.ai</h1>

<p align="center">
  <strong>AI-powered weekly meal planning & nutrition tracking, built with Next.js 15</strong>
</p>

<p align="center">
  <a href="https://mealio-nine.vercel.app/" target="_blank">Live Demo</a> ·
  <a href="https://github.com/abhijit69-ui/mealio-ai" target="_blank">GitHub</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?logo=next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" />
  <img src="https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma" />
  <img src="https://img.shields.io/badge/Gemini_2.5_Flash-AI-4285F4?logo=google" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwindcss" />
</p>

---

## Overview

Mealio.ai is a full-stack meal planning application where users can generate a personalized 7-day meal plan in seconds using Google Gemini AI, track daily nutrition across macros and micronutrients, upload food photos via Cloudinary, and browse meals by date. Admins manage a global food database with custom serving units and categories.

The project was built to demonstrate a production-quality fullstack architecture — server actions, optimistic mutations, streaming AI responses, role-based auth, and a fully responsive UI across mobile and desktop.

---

## Screenshots
<img width="1478" height="851" alt="Screenshot 2026-05-23 101948" src="https://github.com/user-attachments/assets/e7e3f380-f208-47d8-bb77-fefec8fa1fa4" />
<img width="1478" height="796" alt="mealioUI" src="https://github.com/user-attachments/assets/8f05da58-de9f-4aef-9e68-7bbe54a784f6" />

---

## Key Features

### 🤖 AI Meal Plan Generation
- Generate a complete 7-day plan (21 meals) from a single dialog
- Customizable by **goal** (weight loss, muscle gain, maintenance, high protein, energy boost, healthy eating)
- Supports **dietary restrictions** (vegetarian, vegan, lactose-free, gluten-free)
- Optional **budget tier** and available ingredient hints
- Powered by **Google Gemini 2.5 Flash** via the Vercel AI SDK
- AI-generated foods are stored as personal foods with accurate per-100g macros

### 📊 Daily Nutrition Tracking
- Browse any date to see meals planned for that day
- Total calories, protein, carbs, fat, fiber, and sugar at a glance
- Per-meal breakdown with per-food item detail in a bottom sheet
- Bento-grid detail view with nutrition summary, per-food cards, and food description

### 🗓️ Weekly Planner
- 7-day planner with a scrollable day selector
- Add meals manually by searching the food database
- Create personal foods with custom serving units and nutrition values
- Inline photo upload per meal slot via **Cloudinary**
- Skeleton loading states for all async views

### 🔐 Authentication & Roles
- Email/password auth with **email verification** and **password reset** (via Resend)
- Google OAuth support
- Role-based routing: `user` → planner & meals, `admin` → food/category/serving-unit management
- Session-aware middleware with route protection

### 🛠️ Admin Panel
- Manage global food database (create, edit, delete foods with full nutrition)
- Category management with food assignment
- Serving unit management

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4, shadcn/ui, Base UI |
| State / Data fetching | TanStack React Query v5 |
| Forms | React Hook Form + Zod |
| ORM | Prisma 7 (with `@prisma/adapter-pg`) |
| Database | PostgreSQL (Neon) |
| Auth | Better Auth (email/password + Google OAuth) |
| AI | Google Gemini 2.5 Flash via `@ai-sdk/google` |
| Email | Resend |
| Image Uploads | Cloudinary via `next-cloudinary` |
| Animations | Motion (Framer Motion) |
| Deployment | Vercel |

---

## Project Structure

```
mealio-ai/
├── prisma/
│   ├── schema.prisma            # Full DB schema (User, Food, Meal, MealPlan, etc.)
│   ├── seed.ts                  # Seeds super admin account
│   └── migrations/              # Prisma migration history
│
├── public/
│   ├── logo.png                 # App logo (bowl icon)
│   └── images/                  # Hero section assets
│
└── src/
    ├── app/
    │   ├── (auth)/              # Route group — unauthenticated pages
    │   │   ├── sign-in/
    │   │   ├── sign-up/
    │   │   ├── forgot-password/
    │   │   ├── reset-password/
    │   │   ├── check-email/
    │   │   └── verify-email/
    │   │
    │   ├── (dashboard)/         # Route group — authenticated pages
    │   │   ├── _components/
    │   │   │   └── dashboard-layout.tsx   # Navbar, collapsible sidebar, role-aware nav
    │   │   │
    │   │   ├── admin/
    │   │   │   └── (foods-management)/
    │   │   │       ├── foods/             # Global food CRUD
    │   │   │       ├── categories/        # Category management
    │   │   │       └── serving-units/     # Serving unit management
    │   │   │
    │   │   └── client/
    │   │       ├── meals/                 # Daily nutrition tracker (date-filtered)
    │   │       │   ├── _components/
    │   │       │   │   ├── meals-view.tsx
    │   │       │   │   ├── nutrition-summary.tsx
    │   │       │   │   ├── day-meal-cards.tsx
    │   │       │   │   └── meals-skeleton.tsx
    │   │       │   └── _services/
    │   │       │       ├── mealQueries.ts        # Server actions (getMealsByDate)
    │   │       │       └── useMealQueries.ts     # React Query hooks
    │   │       │
    │   │       └── planner/               # Weekly meal planner
    │   │           ├── [planId]/
    │   │           │   ├── page.tsx
    │   │           │   └── loading.tsx    # Next.js Suspense skeleton
    │   │           ├── _components/
    │   │           │   ├── planner-view.tsx
    │   │           │   ├── meal-card.tsx
    │   │           │   ├── meal-cards-skeleton.tsx
    │   │           │   ├── meal-detail-sheet.tsx
    │   │           │   ├── meal-image-upload.tsx
    │   │           │   ├── add-meal-dialog.tsx
    │   │           │   ├── create-plan-dialog.tsx
    │   │           │   ├── generate-plan-with-ai-dialog.tsx
    │   │           │   └── plans-list-view.tsx
    │   │           ├── _services/
    │   │           │   └── mealPlanMutation.ts   # Server actions + AI generation
    │   │           └── _types/
    │   │               ├── aiMealPlanSchema.ts
    │   │               ├── mealPlanSchema.ts
    │   │               └── plannerTypes.ts
    │   │
    │   ├── api/
    │   │   └── auth/[...all]/   # Better Auth catch-all route
    │   ├── globals.css           # Tailwind base + custom theme tokens
    │   ├── layout.tsx            # Root layout (providers, fonts)
    │   ├── page.tsx              # Landing page
    │   └── not-found.tsx
    │
    ├── components/
    │   ├── landing/             # Marketing page sections
    │   │   ├── Navbar.tsx
    │   │   ├── HeroSection.tsx
    │   │   ├── FeaturesSection.tsx
    │   │   ├── HowItWorks.tsx
    │   │   ├── PricingSection.tsx
    │   │   └── Footer.tsx
    │   ├── ui/                  # shadcn/ui + custom primitives
    │   └── providers.tsx        # QueryClient + ThemeProvider
    │
    ├── lib/
    │   ├── auth.ts              # Better Auth config (email, Google, Resend)
    │   ├── authClient.ts        # Client-side auth helpers
    │   ├── db.ts                # Prisma client singleton (with pg adapter)
    │   ├── executeAction.ts     # Server action error wrapper
    │   ├── useGlobalStore.ts    # Zustand global store
    │   └── zodSchemas.ts        # Shared Zod schemas
    │
    └── middleware.ts            # Role-based route protection
```

---

## Database Schema (Key Models)

```
User ──< MealPlan ──< MealPlanItem >── Meal ──< MealFood >── Food
                                                              Food >── FoodServingUnit >── ServingUnit
                                                              Food >── Category
```

- **Food** — global (admin, `isPublic: true`) or personal (user, `isPublic: false`), with full nutrition per 100g
- **Meal** — linked to a user and a datetime; contains MealFoods
- **MealPlanItem** — join table between MealPlan and Meal; holds `day` enum and `type` (BREAKFAST/LUNCH/DINNER)
- **MealPlan** — 7-day plan with `startDate` and `endDate`

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database (local or [Neon](https://neon.tech))
- Google Cloud project with Generative AI API enabled
- Cloudinary account
- Resend account (for email)

### 1. Clone & Install

```bash
git clone https://github.com/abhijit69-ui/mealio-ai.git
cd mealio-ai
npm install
```

### 2. Environment Variables

Create a `.env` file in the project root:

```env
# ── Database ────────────────────────────────────────────────
DATABASE_URL="postgresql://user:password@host:5432/mealio"

# ── Better Auth ─────────────────────────────────────────────
BETTER_AUTH_SECRET="your-secret-32-chars-minimum"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# ── Google OAuth (optional) ──────────────────────────────────
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# ── Google Generative AI (Gemini) ────────────────────────────
GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-api-key"

# ── Cloudinary ───────────────────────────────────────────────
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"

# ── Resend (email) ───────────────────────────────────────────
RESEND_API_KEY="re_your-resend-api-key"
```

### 3. Database Setup

```bash
# Run migrations
npm run db:migrate

# Seed the super admin account
npm run seed
```

Default admin credentials (created by seed):
- **Email:** `super@admin.com`
- **Password:** `SuperAdmin@123`

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:studio` | Open Prisma Studio (DB GUI) |
| `npm run seed` | Seed super admin account |
| `npm run lint` | Run ESLint |

---

## Deployment

The app is deployed on **Vercel** with a **Neon PostgreSQL** database.

1. Push to GitHub and import the repo in Vercel
2. Set all environment variables in the Vercel dashboard
3. Set the build command to `next build` — Prisma client generates automatically via `postinstall`

> **Note:** Vercel runs in UTC. The app stores all meal datetimes as UTC noon (`Date.UTC(y, m, d, 12)`) to avoid timezone drift across server and client.

---

## Architecture Notes

- **Server Actions** are used for all data mutations — no separate API routes except the Better Auth catch-all
- **React Query** handles client-side caching and invalidation after mutations
- **Co-location**: each feature owns its `_components/`, `_services/`, and `_types/` folders inside its route segment
- **Role-based middleware** protects `/admin/*` and `/client/*` routes at the edge
- **Streaming AI**: Gemini 2.5 Flash generates the full 7-day plan as JSON; the server action parses it, upserts personal food entries, and writes 21 `MealPlanItem` records in a single request

---

## Author

**Abhijit Nath** — [@abhijit69-ui](https://github.com/abhijit69-ui)

---

## License

MIT
