-- Create user_bookmarks table
CREATE TABLE IF NOT EXISTS public.user_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scp_id UUID NOT NULL REFERENCES public.scps(id) ON DELETE CASCADE,
  bookmarked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, scp_id)
);

-- Index for checking if specific SCP is bookmarked
CREATE INDEX idx_user_bookmarks_scp_id ON public.user_bookmarks(scp_id);

-- Composite index for user's bookmarks ordered by date
CREATE INDEX idx_user_bookmarks_user_bookmarked_at ON public.user_bookmarks(user_id, bookmarked_at DESC);

-- Enable Row Level Security
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;

-- Users can only see their own bookmarks
CREATE POLICY "Users can view their own bookmarks"
  ON public.user_bookmarks
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own bookmarks
CREATE POLICY "Users can insert their own bookmarks"
  ON public.user_bookmarks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own bookmarks
CREATE POLICY "Users can delete their own bookmarks"
  ON public.user_bookmarks
  FOR DELETE
  USING (auth.uid() = user_id);
