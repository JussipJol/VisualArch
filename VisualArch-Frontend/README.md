# VisualArch AI

AI-powered platform for designing and building software projects — from idea description to a full codebase in minutes.

## Overview

VisualArch AI guides developers through a structured 4-step pipeline:

| Step | Name | Description |
|------|------|-------------|
| 1 | **Architect** | Define the project structure and tech stack with AI assistance |
| 2 | **Canvas** | Visualize the architecture on an interactive canvas |
| 3 | **Frontend** | Generate and refine the UI components |
| 4 | **Export** | Download or deploy the finished codebase |

## Tech Stack

- **Framework** — [Next.js 14](https://nextjs.org/) (App Router)
- **Language** — TypeScript
- **Styling** — Tailwind CSS
- **Animations** — Framer Motion
- **Icons** — Lucide React
- **UI Primitives** — Radix UI
- **3D / WebGL Background** — Unicorn Studio (`unicornstudio-react`)
- **State Management** — Zustand
- **Auth / DB** — Supabase *(integration pending)*
- **Fonts** — Inter (Google), Geist (local)

## Project Structure

```
VisualArch-Frontend/
├── app/
│   ├── layout.tsx          # Root layout with fonts and preloader
│   ├── page.tsx            # Landing page with 3D hero
│   ├── about/page.tsx      # About page
│   ├── login/page.tsx      # Login form
│   ├── register/page.tsx   # Registration form
│   ├── dashboard/page.tsx  # Project dashboard
│   └── not-found.tsx       # 404 page
├── components/
│   ├── HeroScene.tsx        # Canvas-based animated hero (metallic text + bloom)
│   ├── Navbar.tsx           # Responsive navbar (public & auth variants)
│   ├── Preloader.tsx        # Session-aware typewriter preloader
│   ├── ProjectCard.tsx      # Project card with delete confirmation
│   ├── UnicornBackground.tsx# WebGL animated background
│   ├── Logo.tsx             # SVG hexagonal logo
│   └── ui/
│       ├── Button.tsx       # Multi-variant button with loading state
│       ├── Badge.tsx        # Status badge
│       └── LoadingSpinner.tsx
├── lib/
│   ├── supabase.ts          # Supabase client (placeholder)
│   └── utils.ts             # cn() utility
└── middleware.ts            # Route protection (ready for Supabase auth)
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Install dependencies

```bash
npm install
```

### Configure environment

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for production

```bash
npm run build
npm start
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with animated 3D hero |
| `/about` | About page with WebGL background |
| `/login` | Login with email/password or GitHub OAuth |
| `/register` | Registration with real-time password validation |
| `/dashboard` | Project list with search, stats, and create flow |

## Key Features

- **Animated Hero** — Canvas-based 3D text with metallic gradient, bloom layers, and reflection effect
- **Preloader** — Typewriter animation shown once per session via `sessionStorage`
- **Responsive Navbar** — Collapses to a slide-in drawer on mobile; two variants: `public` and `auth`
- **Project Dashboard** — Filter, create, and delete projects with animated transitions
- **Form Validation** — Inline email validation and password strength checker on the registration page
- **Protected Routes** — Middleware ready for Supabase session-based auth

## Connecting Supabase

1. Install the Supabase client:
   ```bash
   npm install @supabase/supabase-js @supabase/ssr
   ```
2. Replace the placeholder in `lib/supabase.ts` with a real `createClient` call.
3. Uncomment the session checks in `middleware.ts` to enable route protection.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Create production build |
| `npm start` | Serve production build |
| `npm run lint` | Run ESLint |
