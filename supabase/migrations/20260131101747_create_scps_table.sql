-- Create scps table
CREATE TABLE IF NOT EXISTS public.scps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scp_number INT NOT NULL,
  scp_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  series TEXT NOT NULL,
  rating INT,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX idx_scps_series ON public.scps(series);
CREATE INDEX idx_scps_number ON public.scps(scp_number);
CREATE INDEX idx_scps_rating ON public.scps(rating DESC NULLS LAST);

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.scps
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Add comment for documentation
COMMENT ON TABLE public.scps IS 'Master list of all SCP Foundation entries';
