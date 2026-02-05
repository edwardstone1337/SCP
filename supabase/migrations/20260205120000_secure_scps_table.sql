-- Enable Row Level Security on scps table
ALTER TABLE public.scps ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read scps (public data)
CREATE POLICY "Anyone can read scps"
  ON public.scps
  FOR SELECT
  USING (true);

-- Only service role can insert/update/delete
-- (No policy needed - RLS blocks by default, service role bypasses RLS)
