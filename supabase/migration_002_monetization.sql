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
