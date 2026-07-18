-- Run this in the Supabase SQL editor (Project → SQL Editor → New query)
-- for project sturqeygsrdpjrpnumlr before using the app.
--
-- This (re)creates the Leads table to match the required field list:
-- Name, Phone Number, Email, Company Name, Service Interested,
-- Lead Source, Lead Status, Notes, Created Date.

create extension if not exists pgcrypto;

-- Drop and recreate so re-running this script during setup is safe.
drop table if exists public.leads cascade;

create table public.leads (
  -- Primary Key: uniquely identifies each row. UUIDs are used instead of
  -- plain incrementing numbers so IDs are safe to expose to the client
  -- and can't be guessed/enumerated.
  id uuid primary key default gen_random_uuid(),

  -- Columns (the fields you asked for)
  name text not null,
  phone_number text,
  email text not null,
  company_name text not null,
  service_interested text,
  lead_source text not null default 'Website',
  lead_status text not null default 'New' check (
    lead_status in ('New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost')
  ),
  notes text,

  -- Timestamp: set automatically by the database when a row is inserted,
  -- so the app never has to send it manually.
  created_date timestamptz not null default now()
);

comment on table public.leads is 'One row per sales lead. No relationships to other tables yet — everything about a lead lives on this single row.';

-- Index to make "newest first" sorting fast as the table grows.
create index leads_created_date_idx on public.leads (created_date desc);

-- Row Level Security
alter table public.leads enable row level security;

-- NOTE: this app has no login/auth yet, so these policies allow anyone with
-- the publishable (anon) key to read and write leads. That's fine for a demo
-- or personal/internal tool. Before making this public, add Supabase Auth
-- and scope these policies to the signed-in user — that's when a
-- "relationship" would come in: you'd add a user_id column on leads as a
-- foreign key referencing auth.users(id), and each user would only see
-- their own rows.

create policy "Public read access" on public.leads
  for select using (true);

create policy "Public insert access" on public.leads
  for insert with check (true);

create policy "Public update access" on public.leads
  for update using (true) with check (true);

create policy "Public delete access" on public.leads
  for delete using (true);

-- ---------------------------------------------------------------------
-- Dummy data (manually written sample rows, per the assignment)
-- ---------------------------------------------------------------------
insert into public.leads
  (name, phone_number, email, company_name, service_interested, lead_source, lead_status, notes)
values
  ('Ava Thompson',   '+1 415 555 0132',  'ava.thompson@brightpath.io',   'BrightPath Media',     'Annual Subscription Plan', 'Website',        'Qualified', 'Interested in the annual plan, wants a demo next week.'),
  ('Marcus Lee',      '+1 312 555 0187',  'marcus@leeconsulting.com',     'Lee Consulting Group',  'Custom Onboarding',        'Referral',       'New',       ''),
  ('Priya Nair',      '+91 98765 43210',  'priya.nair@finoraworks.com',   'Finora Works',          'Enterprise Plan',          'Event',          'Proposal',  'Sent proposal on Tuesday, following up Friday.'),
  ('Daniel Kim',      '+1 646 555 0199',  'daniel.kim@nexvista.co',       'NexVista',              'Basic Plan',               'Cold Call',      'Contacted', ''),
  ('Sofia Rossi',     '+39 348 555 0121', 'sofia.rossi@luminaretail.it',  'Luminate Retail',       'Enterprise Plan',          'Social Media',   'Won',       'Closed — onboarding scheduled.'),
  ('Ethan Walker',    '+1 206 555 0144',  'ethan.walker@gridworks.dev',   'GridWorks',             'Basic Plan',               'Advertisement',  'Lost',      'Went with a competitor.'),
  ('Hannah Becker',   '+49 151 5550 1122','hannah.becker@vantapoint.de',  'Vantapoint GmbH',       'Consulting Session',       'Website',        'New',       ''),
  ('Rahul Mehta',     '+91 90000 12345',  'rahul.mehta@orbitlabs.in',     'Orbit Labs',            'Product Demo',             'Referral',       'Contacted', 'Asked for a callback next Monday.');
