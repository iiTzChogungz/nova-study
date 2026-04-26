-- 1. Enable pgvector extension
create extension if not exists vector;

-- 2. Create document_chunks table
create table public.document_chunks (
  id uuid default uuid_generate_v4() primary key,
  document_id uuid references public.documents(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  chunk_index integer not null,
  content text not null,
  embedding vector(1536) not null, -- 1536 is for OpenAI text-embedding-3-small
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Enable RLS
alter table public.document_chunks enable row level security;

-- 4. Create RLS Policies
create policy "Users can view own chunks" on public.document_chunks
  for select using (auth.uid() = user_id);
create policy "Users can insert own chunks" on public.document_chunks
  for insert with check (auth.uid() = user_id);
create policy "Users can delete own chunks" on public.document_chunks
  for delete using (auth.uid() = user_id);

-- 5. Create Vector Search Function (RPC)
create or replace function match_document_chunks (
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  doc_id uuid,
  uid uuid
)
returns table (
  id uuid,
  document_id uuid,
  content text,
  similarity float
)
language sql stable
as $$
  select
    document_chunks.id,
    document_chunks.document_id,
    document_chunks.content,
    1 - (document_chunks.embedding <=> query_embedding) as similarity
  from document_chunks
  where document_chunks.document_id = doc_id
    and document_chunks.user_id = uid
    and 1 - (document_chunks.embedding <=> query_embedding) > match_threshold
  order by document_chunks.embedding <=> query_embedding
  limit match_count;
$$;
