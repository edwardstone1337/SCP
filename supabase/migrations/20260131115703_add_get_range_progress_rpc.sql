-- Function to get range progress for a series and user
CREATE OR REPLACE FUNCTION get_range_progress(series_id_param TEXT, user_id_param UUID)
RETURNS TABLE (
  range_start INT,
  total BIGINT,
  read_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (FLOOR(s.scp_number / 100) * 100)::INT AS range_start,
    COUNT(s.id) AS total,
    COUNT(CASE WHEN up.is_read = true THEN 1 END) AS read_count
  FROM scps s
  LEFT JOIN user_progress up ON s.id = up.scp_id AND up.user_id = user_id_param
  WHERE s.series = series_id_param
  GROUP BY (FLOOR(s.scp_number / 100) * 100)
  ORDER BY range_start;
END;
$$ LANGUAGE plpgsql;
