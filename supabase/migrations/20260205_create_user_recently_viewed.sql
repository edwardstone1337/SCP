-- UP
CREATE TABLE user_recently_viewed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scp_id UUID NOT NULL REFERENCES scps(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, scp_id)
);

CREATE INDEX idx_user_recently_viewed_user_viewed 
  ON user_recently_viewed(user_id, viewed_at DESC);

-- RLS
ALTER TABLE user_recently_viewed ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own recently viewed"
  ON user_recently_viewed FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recently viewed"
  ON user_recently_viewed FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recently viewed"
  ON user_recently_viewed FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own recently viewed"
  ON user_recently_viewed FOR DELETE
  USING (auth.uid() = user_id);

-- DOWN (as comment for reference)
-- DROP TABLE user_recently_viewed;

