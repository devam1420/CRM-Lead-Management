# LeadFlow CRM

A modern, responsive Lead Management CRM dashboard built with React + Vite + Tailwind CSS, backed by Supabase.

## Features

- **Dashboard** — total leads, open pipeline value, deals won, win rate, leads-by-status breakdown, recently added leads
- **Leads table** — search by name/company/email, filter by status, masked Aadhaar/PAN columns
- **Add / Edit leads** — modal form with validation (name, email, company required; Aadhaar/PAN format-checked)
- **Delete leads** — with confirmation dialog
- **Update status** — inline dropdown per lead (New, Contacted, Qualified, Proposal, Won, Lost)
- Data lives in a Supabase Postgres table (`leads`), shared across devices/tabs

## Database design

Single table: **`leads`**

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | **Primary key** |
| `full_name` | text | required |
| `company` | text | required |
| `email` | text | required |
| `phone` | text | optional |
| `source` | text | Website, Referral, Cold Call, Social Media, Event, Advertisement, Other |
| `status` | text | New / Contacted / Qualified / Proposal / Won / Lost |
| `deal_value` | numeric | optional, defaults to 0 |
| `owner` | text | internal lead owner |
| `aadhaar_number` | text | format-checked (`1234 5678 9012`), **masked in the UI** |
| `pan_number` | text | format-checked (`ABCDE1234F`), **masked in the UI** |
| `created_date` | timestamptz | timestamp, set automatically on insert |

### ⚠️ Aadhaar / PAN — read before using with real data

Aadhaar and PAN are regulated Indian government IDs. The Aadhaar Act restricts
private entities from storing Aadhaar numbers without UIDAI authorization, and
a leaked Aadhaar/PAN pair is enough for identity fraud. This project:

- masks both fields in the UI (only the last 4 characters are shown), but
- stores the **full value in plain text** in Supabase, and
- ships with **public read/write RLS policies** (anyone with the publishable key can read/write), matching the rest of this demo.

That combination is fine for a personal sandbox/demo, but is **not safe for real customer data**. Before that happens: restrict the RLS policies to authenticated staff only, store masked/hashed values instead of the full number, enable column-level encryption (pgsodium/pgcrypto), and confirm whether you need UIDAI authorization to collect Aadhaar at all.

## 1. Set up the Supabase table (do this first)

1. Open your Supabase project (`emdkeonyhxrbxfehfuxg`) → **SQL Editor** → New query.
2. Paste the entire contents of `supabase/schema.sql` and run it. This creates the `leads` table above, enables RLS with public read/write policies, and inserts 8 synthetic dummy leads (fake Aadhaar/PAN — not real people).

## 2. Configure environment variables

`.env` is already set to the new project:

```
VITE_SUPABASE_URL=https://emdkeonyhxrbxfehfuxg.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_O9ur3Hm4IuQjsBlo8fF_Mg_HoriYA3B
```

## 3. Run it

```bash
npm install
npm run dev
```

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
  hooks/         useLeads — CRUD against Supabase, loading + error state
  lib/           supabaseClient.js, mask.js (Aadhaar/PAN masking helpers)
  App.jsx        Layout, view routing, loading/error banner
supabase/
  schema.sql     Table + columns + primary key + timestamp + RLS policies + dummy data — run this first
```

## Tech

React 19, Vite, Tailwind CSS, lucide-react icons, @supabase/supabase-js.
