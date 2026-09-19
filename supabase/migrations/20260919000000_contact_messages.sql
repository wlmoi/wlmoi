create extension if not exists pgcrypto;

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  subject text not null,
  category text not null,
  message text not null,
  status text not null default 'new',
  constraint contact_messages_name_length check (length(trim(name)) between 2 and 120),
  constraint contact_messages_email_format check (email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  constraint contact_messages_subject_length check (length(trim(subject)) between 3 and 160),
  constraint contact_messages_category_check check (category in ('Internship', 'Research collaboration', 'Engineering opportunity', 'General', 'Other')),
  constraint contact_messages_message_length check (length(trim(message)) between 10 and 4000),
  constraint contact_messages_status_check check (status in ('new', 'reviewed', 'replied', 'archived'))
);

alter table public.contact_messages enable row level security;

revoke all on table public.contact_messages from anon, authenticated;
grant usage on schema public to anon;
grant insert (name, email, subject, category, message) on table public.contact_messages to anon;

drop policy if exists "public can insert valid contact messages" on public.contact_messages;
create policy "public can insert valid contact messages"
on public.contact_messages
for insert
to anon
with check (
  status = 'new'
  and length(trim(name)) between 2 and 120
  and email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  and length(trim(subject)) between 3 and 160
  and category in ('Internship', 'Research collaboration', 'Engineering opportunity', 'General', 'Other')
  and length(trim(message)) between 10 and 4000
);

create index if not exists contact_messages_created_at_idx on public.contact_messages (created_at desc);

-- No SELECT, UPDATE, or DELETE grants are provided to anon/authenticated.
-- Production note: add authoritative server-side rate limiting or CAPTCHA/Turnstile in front of the public write path.
