-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS TABLE
create table public.users (
  id uuid references auth.users not null primary key,
  email text,
  plan text default 'free' check (plan in ('free', 'pro')),
  stripe_customer_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- DOCUMENTS TABLE
create table public.documents (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  file_url text not null,
  file_type text not null,
  content text, -- Extracted text for search and AI context
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CONVERSATIONS TABLE
create table public.conversations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  document_id uuid references public.documents(id) on delete cascade,
  message text not null,
  response text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- USAGE EVENTS TABLE
create table public.usage_events (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  type text not null check (type in ('upload', 'query')),
  count integer default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SUBSCRIPTIONS TABLE
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null unique,
  stripe_subscription_id text not null unique,
  status text not null,
  current_period_end timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS POLICIES

-- Enable RLS
alter table public.users enable row level security;
alter table public.documents enable row level security;
alter table public.conversations enable row level security;
alter table public.usage_events enable row level security;
alter table public.subscriptions enable row level security;

-- Users policies
create policy "Users can view own data" on public.users
  for select using (auth.uid() = id);
create policy "Users can update own data" on public.users
  for update using (auth.uid() = id);

-- Documents policies
create policy "Users can view own documents" on public.documents
  for select using (auth.uid() = user_id);
create policy "Users can insert own documents" on public.documents
  for insert with check (auth.uid() = user_id);
create policy "Users can delete own documents" on public.documents
  for delete using (auth.uid() = user_id);

-- Conversations policies
create policy "Users can view own conversations" on public.conversations
  for select using (auth.uid() = user_id);
create policy "Users can insert own conversations" on public.conversations
  for insert with check (auth.uid() = user_id);

-- Usage Events policies
create policy "Users can view own usage" on public.usage_events
  for select using (auth.uid() = user_id);
create policy "Users can insert own usage" on public.usage_events
  for insert with check (auth.uid() = user_id);

-- Subscriptions policies
create policy "Users can view own subscription" on public.subscriptions
  for select using (auth.uid() = user_id);

-- FUNCTIONS & TRIGGERS
-- Auto-create user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- STORAGE BUCKETS
insert into storage.buckets (id, name, public) values ('documents', 'documents', false);

-- Storage RLS
create policy "Users can upload their own documents"
  on storage.objects for insert
  with check (bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can read their own documents"
  on storage.objects for select
  using (bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]);


-- Run once in the Supabase SQL editor (after schema.sql).

-- SECURITY: users must NOT be able to edit their own plan. The Stripe webhook
-- uses the service-role key, which bypasses RLS.
drop policy if exists "Users can update own data" on public.users;

-- Allow the app to save extracted text on the user's own documents.
drop policy if exists "Users can update own documents" on public.documents;
create policy "Users can update own documents" on public.documents
  for update using (auth.uid() = user_id);

-- Remember which action produced each conversation row (qa, summarize, quiz, ...).
alter table public.conversations add column if not exists action text not null default 'qa';
create index if not exists conversations_doc_idx on public.conversations (document_id, created_at);
create index if not exists usage_events_user_idx on public.usage_events (user_id, type, created_at);

-- Allow users to delete their own files from the private bucket.
drop policy if exists "Users can delete their own documents" on storage.objects;
create policy "Users can delete their own documents"
  on storage.objects for delete
  using (bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]);

-- Stripe bookkeeping
alter table public.users add column if not exists stripe_customer_id text;
create index if not exists users_stripe_customer_idx on public.users (stripe_customer_id);

-- Trigger function must not be callable through the REST API.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
