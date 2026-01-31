-- Function to get series progress for a user
CREATE OR REPLACE FUNCTION get_series_progress(user_id_param UUID)
RETURNS TABLE (
  series TEXT,
  total BIGINT,
  read BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.series,
    COUNT(s.id) AS total,
    COUNT(CASE WHEN up.is_read = true THEN 1 END) AS read
  FROM scps s
  LEFT JOIN user_progress up ON s.id = up.scp_id AND up.user_id = user_id_param
  WHERE s.series ~ '^series-[0-9]+$'
  GROUP BY s.series
  ORDER BY s.series;
END;
$$ LANGUAGE plpgsql;
