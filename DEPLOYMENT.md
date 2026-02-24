# 🚀 FleetSight Deployment Guide

Due to current automated system limits, please use these **one-click deployment buttons** to launch your production instance. This ensures you have full ownership of the URLs and environment.

### 1. Deploy the Backend (API)

Click the button below, then add your Supabase credentials when prompted.
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsathish-ideassion%2Ffleet-sight&root-directory=backend&env=SUPABASE_URL,SUPABASE_ANON_KEY&project-name=fleetsight-api)

- **Environment Variables needed:**
  - `SUPABASE_URL`: `https://jathyrfrqviailsdyxzd.supabase.co`
  - `SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphdGh5cmZycXZpYWlsc2R5eHpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5MjExMzQsImV4cCI6MjA4NzQ5NzEzNH0.GY_R_YT3k9ihnESp0ig8TYD3-zBe46dL3sQKjxJ8xdg`

---

### 2. Deploy the Frontend (App)

**Important:** Deploy this _after_ the backend is finished so you have the backend URL.
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsathish-ideassion%2Ffleet-sight&root-directory=frontend&env=VITE_SUPABASE_URL,VITE_SUPABASE_ANON_KEY,VITE_API_URL&project-name=fleetsight-app)

- **Environment Variables needed:**
  - `VITE_SUPABASE_URL`: (Same as above)
  - `VITE_SUPABASE_ANON_KEY`: (Same as above)
  - `VITE_API_URL`: `https://[YOUR_BACKEND_URL_FROM_STEP_1]/api`

---

### ✅ Post-Deployment

1.  Navigate to your new Frontend URL.
2.  Click **"Create Account"** to register your Admin profile.
3.  Enjoy your AI-Powered Fleet Terminal!
