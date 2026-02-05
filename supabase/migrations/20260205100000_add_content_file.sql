-- UP: Add content_file column to scps table
ALTER TABLE scps ADD COLUMN content_file TEXT;

-- Create index for content_file lookups (optional but good practice)
CREATE INDEX idx_scps_content_file ON scps(content_file);
