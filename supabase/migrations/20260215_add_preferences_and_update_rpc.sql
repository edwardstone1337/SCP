-- Add preferences JSONB column to user_profiles for user settings (reading preferences, etc.)
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}' NOT NULL;

-- RPC function to update preferences only (not premium_until)
-- Runs as SECURITY DEFINER so it bypasses RLS; users can only update preferences via this function.
-- No UPDATE RLS policy is created — premium_until remains writable only by service role.
CREATE OR REPLACE FUNCTION public.update_user_preferences(new_preferences JSONB)
RETURNS VOID AS $$
BEGIN
  UPDATE public.user_profiles
  SET preferences = new_preferences
  WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON COLUMN public.user_profiles.preferences IS 'User settings (e.g. imageSafeMode). Updated via update_user_preferences RPC only.';
