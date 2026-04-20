-- Stayward Part 3 schema
-- Run this once in the Supabase SQL Editor after creating your project.
--
-- Tables:
--   briefs          One per traveller request
--   brief_routings  One per hotel we emailed for a brief (5 per brief typically)
--   quotes          One per hotel reply captured

create extension if not exists "pgcrypto";

-- THE BRIEF (what the traveller wants)
create table if not exists briefs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),

  traveller_name text not null,
  traveller_email text not null,

  city text,
  check_in date,
  check_out date,
  guests int default 2,
  max_price_gbp int,

  raw_query text not null,
  parsed_query jsonb,

  status text default 'routing'
);

create index if not exists briefs_created_at_idx on briefs(created_at desc);
create index if not exists briefs_email_idx on briefs(traveller_email);

-- ROUTING (which hotels got the brief)
create table if not exists brief_routings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),

  brief_id uuid not null references briefs(id) on delete cascade,
  hotel_slug text not null,
  hotel_name text not null,
  hotel_city text not null,
  hotel_contact_email text not null,
  match_score numeric,
  match_reasons jsonb,

  reply_to_token text not null unique,
  email_sent_at timestamptz,
  email_message_id text,
  email_status text default 'pending'
);

create index if not exists brief_routings_brief_id_idx on brief_routings(brief_id);
create index if not exists brief_routings_token_idx on brief_routings(reply_to_token);

-- QUOTES (the hotel replies)
create table if not exists quotes (
  id uuid primary key default gen_random_uuid(),
  received_at timestamptz default now(),

  routing_id uuid not null references brief_routings(id) on delete cascade,

  from_email text,
  subject text,
  body_text text not null,
  body_html text,

  parsed_price_gbp int,
  parsed_notes text
);

create index if not exists quotes_routing_id_idx on quotes(routing_id);
create index if not exists quotes_received_at_idx on quotes(received_at desc);

-- Helper view — one row per routing with the latest quote attached
create or replace view brief_routings_with_quote as
select
  r.*,
  q.id as quote_id,
  q.received_at as quote_received_at,
  q.parsed_price_gbp as quote_price_gbp,
  q.parsed_notes as quote_notes,
  q.body_text as quote_body,
  q.from_email as quote_from_email
from brief_routings r
left join lateral (
  select * from quotes
  where routing_id = r.id
  order by received_at desc
  limit 1
) q on true;

-- Row-level security — since we access via service-role key on the server,
-- we can leave RLS disabled for MVP. Enable before exposing any direct client access.
-- alter table briefs enable row level security;
-- alter table brief_routings enable row level security;
-- alter table quotes enable row level security;
