-- Stayward Part 4a schema migration
--
-- Run this ONCE in the Supabase SQL Editor, AFTER running Part 3 schema.
-- This migration:
--   1. Adds `users` table (populated by NextAuth)
--   2. Renames `briefs` to `listings` (with added user_id column)
--   3. Renames `brief_routings` to `listing_routings` (with added thread_token)
--   4. Replaces `quotes` with `messages` (thread-aware, bidirectional)
--   5. Adds view for listings with thread counts
--
-- If you're starting fresh (no Part 3 data to preserve), you can skip the rename
-- steps and just create the new tables. The "DROP IF EXISTS" lines handle that.

-- 1. Users table (NextAuth Supabase adapter expects this structure)
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text unique,
  email_verified timestamptz,
  image text,
  created_at timestamptz default now()
);

create table if not exists accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  type text not null,
  provider text not null,
  provider_account_id text not null,
  refresh_token text,
  access_token text,
  expires_at bigint,
  token_type text,
  scope text,
  id_token text,
  session_state text,
  unique(provider, provider_account_id)
);

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  expires timestamptz not null,
  session_token text unique not null
);

create table if not exists verification_tokens (
  identifier text not null,
  token text unique not null,
  expires timestamptz not null,
  primary key (identifier, token)
);

-- 2. Rename briefs → listings (or create fresh if migrating)
do $$
begin
  if exists (select from information_schema.tables where table_name = 'briefs') then
    alter table briefs rename to listings;
  end if;
end $$;

-- Add user_id column if it doesn't exist
alter table listings add column if not exists user_id uuid references users(id) on delete set null;
alter table listings add column if not exists title text;
alter table listings add column if not exists rooms int default 1;

-- Drop the old anonymous traveller_* columns if present (replaced by user_id)
-- Commented out to preserve Part 3 data during transition. Uncomment once migrated.
-- alter table listings drop column if exists traveller_name;
-- alter table listings drop column if exists traveller_email;

-- 3. Rename brief_routings → listing_routings
do $$
begin
  if exists (select from information_schema.tables where table_name = 'brief_routings') then
    alter table brief_routings rename to listing_routings;
  end if;
end $$;

-- listing_routings keeps reply_to_token for inbound routing
alter table listing_routings rename column brief_id to listing_id;

-- Add a separate thread token for outbound customer→hotel messages
alter table listing_routings add column if not exists thread_token text unique;

-- 4. Replace quotes with messages (bidirectional thread)
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),

  routing_id uuid not null references listing_routings(id) on delete cascade,

  sender text not null check (sender in ('customer', 'hotel', 'system')),

  from_email text,
  subject text,
  body_text text not null,
  body_html text,

  parsed_price_gbp int,
  parsed_notes text,

  -- how it arrived or was sent
  sent_via text default 'email' check (sent_via in ('email', 'dashboard')),
  email_message_id text
);

create index if not exists messages_routing_id_idx on messages(routing_id);
create index if not exists messages_created_at_idx on messages(created_at desc);

-- Migrate old quotes to messages if they exist (one-off)
do $$
begin
  if exists (select from information_schema.tables where table_name = 'quotes') then
    insert into messages (id, created_at, routing_id, sender, from_email, subject, body_text, body_html, parsed_price_gbp, parsed_notes, sent_via)
    select id, received_at, routing_id, 'hotel', from_email, subject, body_text, body_html, parsed_price_gbp, parsed_notes, 'email'
    from quotes
    on conflict (id) do nothing;

    drop table quotes cascade;
  end if;
end $$;

-- Drop the old helper view if present
drop view if exists brief_routings_with_quote;

-- 5. New helper views
create or replace view listing_routings_with_latest_message as
select
  r.*,
  lm.id as latest_message_id,
  lm.created_at as latest_message_at,
  lm.sender as latest_message_sender,
  lm.body_text as latest_message_body,
  lm.parsed_price_gbp as latest_message_price_gbp,
  (select count(*) from messages where routing_id = r.id) as message_count,
  (select count(*) from messages where routing_id = r.id and sender = 'hotel') as hotel_message_count
from listing_routings r
left join lateral (
  select * from messages
  where routing_id = r.id
  order by created_at desc
  limit 1
) lm on true;

-- RLS stays disabled for MVP; we use the service role key on the server.
-- Enable later when we add direct client access patterns.
