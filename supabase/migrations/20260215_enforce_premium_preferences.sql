-- Enforce premium status check on premium-only preference keys.
-- Rejects the entire update if a non-premium user tries to set imageSafeMode.
-- Future premium-only keys can be added to the same IF check.

CREATE OR REPLACE FUNCTION public.update_user_preferences(new_preferences JSONB)
RETURNS VOID AS $$
DECLARE
  user_premium_until TIMESTAMPTZ;
BEGIN
  -- Check premium status if premium-only keys are present
  IF new_preferences ? 'imageSafeMode' THEN
    SELECT premium_until INTO user_premium_until
    FROM public.user_profiles
    WHERE id = auth.uid();

    IF user_premium_until IS NULL OR user_premium_until < NOW() THEN
      RAISE EXCEPTION 'Premium required for this preference';
    END IF;
  END IF;

  UPDATE public.user_profiles
  SET preferences = new_preferences
  WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
