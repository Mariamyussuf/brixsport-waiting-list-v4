-- Create waitlist table for storing email signups
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  referral_source text,
  sports_interests text[]
);

-- Enable RLS for security
alter table public.waitlist enable row level security;

-- Create policy to allow anyone to insert (public waitlist)
create policy "Allow public waitlist signup"
  on public.waitlist for insert
  with check (true);

-- Create policy to prevent public reads (admin only)
create policy "Prevent public reads"
  on public.waitlist for select
  using (false);

-- Create index for faster email lookups
create index if not exists waitlist_email_idx on public.waitlist(email);
create index if not exists waitlist_created_at_idx on public.waitlist(created_at desc);