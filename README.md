# LeadFlow CRM

A modern, responsive Lead Management CRM dashboard built with React + Vite + Tailwind CSS, backed by Supabase.

## Features

- **Dashboard** — total leads, new leads, deals won, win rate, leads-by-status breakdown, leads-by-source breakdown, recently added leads
- **Leads table** — search by name/company/email, filter by status
- **Add / Edit leads** — modal form with validation (name, email, company required)
- **Delete leads** — with confirmation dialog
- **Update status** — inline dropdown per lead (New, Contacted, Qualified, Proposal, Won, Lost)
- Data lives in a Supabase Postgres table (`leads`), shared across devices/tabs

## Database design

Single table: **`leads`**

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | **Primary key** — auto-generated, uniquely identifies each row |
| `name` | text | required |
| `phone_number` | text | optional |
| `email` | text | required |
| `company_name` | text | required |
| `service_interested` | text | optional, free text |
| `lead_source` | text | e.g. Website, Referral, Cold Call, Social Media, Event, Advertisement, Other |
| `lead_status` | text | New / Contacted / Qualified / Proposal / Won / Lost |
| `notes` | text | optional |
| `created_date` | timestamptz | **timestamp**, set automatically on insert (`default now()`) |

No foreign-key relationships yet — it's a single table. If you add login later, you'd add a `user_id uuid references auth.users(id)` column; that's the point where a **relationship** (foreign key) comes in, linking each lead to the user who owns it.

## 1. Set up the Supabase table (do this first)

1. Open your Supabase project → **SQL Editor** → New query.
2. Paste the contents of `supabase/schema.sql` and run it. This creates the `leads` table above, enables Row Level Security with public read/write policies (needed since the app has no login yet), and inserts 8 dummy leads.
3. You can see/edit the data any time in **Table Editor → leads**, including adding more rows manually.

## 2. Configure environment variables

A `.env` file is already included with your project's URL and publishable key:

```
VITE_SUPABASE_URL=https://sturqeygsrdpjrpnumlr.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_MZ7CIKeI1OYIslvBXTrLkQ_na0xZyJJ
```

## 3. Run it

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

## Build for production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
  components/    UI components (Sidebar, Topbar, Dashboard, LeadsTable, LeadFormModal, etc.)
  data/          Status/source constants
  hooks/         useLeads — CRUD against Supabase (fetch/insert/update/delete), loading + error state
  lib/           supabaseClient.js — Supabase client instance
  App.jsx        Layout, view routing, loading/error banner
supabase/
  schema.sql     Table + columns + primary key + timestamp + RLS policies + dummy data — run this first
```

## Security note

The publishable/anon key is safe to ship in client code, but the RLS policies in `schema.sql` currently allow **anyone with the key to read and write all leads** — there's no login yet. Fine for a personal tool or internal demo. Before making this public, add Supabase Auth and scope the policies to the signed-in user.

## Tech

React 19, Vite, Tailwind CSS, lucide-react icons, @supabase/supabase-js.
