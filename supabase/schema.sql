-- Run this in the Supabase SQL editor (Project → SQL Editor → New query)
-- for project emdkeonyhxrbxfehfuxg before using the app.
--
-- Leads table matching the required field list:
-- Full Name, Company, Email, Phone, Source, Status, Deal Value ($),
-- Owner, Aadhaar Number, PAN Number.
--
-- ⚠️ COMPLIANCE NOTE: Aadhaar and PAN are regulated Indian government IDs.
-- The Aadhaar Act restricts private entities from storing Aadhaar numbers
-- without UIDAI authorization, and a leaked Aadhaar/PAN pair is enough for
-- identity fraud. This schema stores them as plain text with permissive
-- RLS policies (same as the rest of this demo) purely to match your field
-- list — it is NOT production-safe as-is. Before real customer data goes
-- in here, at minimum: (1) restrict read access to authenticated staff only
-- (remove the public policies below), (2) store only masked/last-4-digit
-- values or a hash instead of the full number, (3) enable Postgres column
-- encryption (pgsodium/pgcrypto) for whatever you do keep, and (4) check
-- whether you need UIDAI authorization at all before collecting Aadhaar.

create extension if not exists pgcrypto;

drop table if exists public.leads cascade;

create table public.leads (
  id uuid primary key default gen_random_uuid(),

  full_name text not null,
  company text not null,
  email text not null,
  phone text,
  source text not null default 'Website',
  status text not null default 'New' check (
    status in ('New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost')
  ),
  deal_value numeric default 0,
  owner text,

  -- Stored as text so formatting (spaces, leading zeros) is preserved.
  -- Format-checked but NOT verified against the real UIDAI/ITD checksum.
  aadhaar_number text check (aadhaar_number is null or aadhaar_number ~ '^[0-9]{4}\s?[0-9]{4}\s?[0-9]{4}$'),
  pan_number text check (pan_number is null or pan_number ~ '^[A-Z]{5}[0-9]{4}[A-Z]$'),

  created_date timestamptz not null default now()
);

comment on table public.leads is 'One row per sales lead. Contains sensitive Indian government ID fields (Aadhaar, PAN) — see notes above before using with real data.';

create index leads_created_date_idx on public.leads (created_date desc);

alter table public.leads enable row level security;

-- NOTE: same as before — public read/write via the anon key, since there is
-- no login yet. Given the Aadhaar/PAN columns, treat this as demo-only.
create policy "Public read access" on public.leads
  for select using (true);

create policy "Public insert access" on public.leads
  for insert with check (true);

create policy "Public update access" on public.leads
  for update using (true) with check (true);

create policy "Public delete access" on public.leads
  for delete using (true);

-- ---------------------------------------------------------------------
-- Dummy data (synthetic, not real people — fake Aadhaar/PAN numbers)
-- ---------------------------------------------------------------------
insert into public.leads
  (full_name, company, email, phone, source, status, deal_value, owner, aadhaar_number, pan_number)
values
  ('Ava Thompson',  'BrightPath Media',      'ava.thompson@brightpath.io',  '+1 415 555 0132',  'Website',       'Qualified', 8200,  'Neha Sharma',  '2345 6789 0123', 'ABCDE1234F'),
  ('Marcus Lee',     'Lee Consulting Group',  'marcus@leeconsulting.com',    '+1 312 555 0187',  'Referral',      'New',       4200,  'Rohan Verma',  '3456 7890 1234', 'BCDEF2345G'),
  ('Priya Nair',      'Finora Works',          'priya.nair@finoraworks.com',  '+91 98765 43210',  'Event',         'Proposal',  15600, 'Neha Sharma',  '4567 8901 2345', 'CDEFG3456H'),
  ('Daniel Kim',      'NexVista',              'daniel.kim@nexvista.co',      '+1 646 555 0199',  'Cold Call',     'Contacted', 3100,  'Arjun Rao',    '5678 9012 3456', 'DEFGH4567I'),
  ('Sofia Rossi',     'Luminate Retail',       'sofia.rossi@luminaretail.it', '+39 348 555 0121', 'Social Media',  'Won',       22000, 'Rohan Verma',  '6789 0123 4567', 'EFGHI5678J'),
  ('Ethan Walker',    'GridWorks',             'ethan.walker@gridworks.dev',  '+1 206 555 0144',  'Advertisement', 'Lost',      5400,  'Arjun Rao',    '7890 1234 5678', 'FGHIJ6789K'),
  ('Hannah Becker',   'Vantapoint GmbH',       'hannah.becker@vantapoint.de', '+49 151 5550 1122','Website',       'New',       6700,  'Neha Sharma',  '8901 2345 6789', 'GHIJK7890L'),
  ('Rahul Mehta',     'Orbit Labs',            'rahul.mehta@orbitlabs.in',    '+91 90000 12345',  'Referral',      'Contacted', 9100,  'Arjun Rao',    '9012 3456 7890', 'HIJKL8901M');
