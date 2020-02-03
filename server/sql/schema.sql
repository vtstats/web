CREATE TYPE statistic_type AS ENUM (
  'youtube_channel_subscriber',
  'youtube_channel_view',
  'bilibili_channel_subscriber',
  'bilibili_channel_view',
  'youtube_stream_viewer'
);

CREATE TYPE statistic AS (time TIMESTAMPTZ, value INTEGER);

CREATE TABLE statistics (
  id SERIAL PRIMARY KEY,
  type statistic_type NOT NULL,
  data statistic[] NOT NULL DEFAULT '{}'
);

CREATE TABLE youtube_channels (
  vtuber_id TEXT PRIMARY KEY,
  subscriber_statistics_id INTEGER REFERENCES statistics (id),
  subscriber_count INTEGER NOT NULL DEFAULT 0,
  daily_subscriber_count INTEGER NOT NULL DEFAULT 0,
  weekly_subscriber_count INTEGER NOT NULL DEFAULT 0,
  monthly_subscriber_count INTEGER NOT NULL DEFAULT 0,
  view_statistics_id INTEGER REFERENCES statistics (id),
  view_count INTEGER NOT NULL DEFAULT 0,
  daily_view_count INTEGER NOT NULL DEFAULT 0,
  weekly_view_count INTEGER NOT NULL DEFAULT 0,
  monthly_view_count INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE bilibili_channels (
  vtuber_id TEXT PRIMARY KEY,
  subscriber_statistics_id INTEGER REFERENCES statistics (id),
  subscriber_count INTEGER NOT NULL DEFAULT 0,
  daily_subscriber_count INTEGER NOT NULL DEFAULT 0,
  weekly_subscriber_count INTEGER NOT NULL DEFAULT 0,
  monthly_subscriber_count INTEGER NOT NULL DEFAULT 0,
  view_statistics_id INTEGER REFERENCES statistics (id),
  view_count INTEGER NOT NULL DEFAULT 0,
  daily_view_count INTEGER NOT NULL DEFAULT 0,
  weekly_view_count INTEGER NOT NULL DEFAULT 0,
  monthly_view_count INTEGER NOT NULL DEFAULT 0
);

CREATE TYPE youtube_stream_status AS ENUM ('schedule', 'live', 'end');

CREATE TABLE youtube_streams (
  stream_id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  vtuber_id TEXT REFERENCES youtube_channels,
  schedule_time TIMESTAMPTZ,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  status youtube_stream_status,
  viewer_statistics_id INTEGER REFERENCES statistics (id),
  average_viewer_count INTEGER,
  max_viewer_count INTEGER
);

CREATE OR REPLACE FUNCTION calculate_report_count()
RETURNS trigger AS $$
BEGIN
  IF NEW.type = 'youtube_channel_subscriber' THEN
    UPDATE youtube_channels
    SET
      daily_subscriber_count = subscriber_count - COALESCE((SELECT value FROM UNNEST(NEW.data) WHERE time > ('now'::date - '1 day'::interval) ORDER BY time LIMIT 1), 0),
      weekly_subscriber_count = subscriber_count - COALESCE((SELECT value FROM UNNEST(NEW.data) WHERE time > ('now'::date - '1 week'::interval) ORDER BY time LIMIT 1), 0),
      monthly_subscriber_count = subscriber_count - COALESCE((SELECT value FROM UNNEST(NEW.data) WHERE time > ('now'::date - '1 month'::interval) ORDER BY time LIMIT 1), 0)
    WHERE subscriber_statistics_id = NEW.id;
  END IF;

  IF NEW.type = 'youtube_channel_view' AND OLD.data <> NEW.data THEN
    UPDATE youtube_channels
    SET
      daily_view_count = view_count - COALESCE((SELECT value FROM UNNEST(NEW.data) WHERE time > ('now'::date - '1 day'::interval) ORDER BY time LIMIT 1), 0),
      weekly_view_count = view_count - COALESCE((SELECT value FROM UNNEST(NEW.data) WHERE time > ('now'::date - '1 week'::interval) ORDER BY time LIMIT 1), 0),
      monthly_view_count = view_count - COALESCE((SELECT value FROM UNNEST(NEW.data) WHERE time > ('now'::date - '1 month'::interval) ORDER BY time LIMIT 1), 0)
    WHERE view_statistics_id = NEW.id;
  END IF;

  IF NEW.type = 'bilibili_channel_subscriber' AND OLD.data <> NEW.data THEN
    UPDATE bilibili_channels
    SET
      daily_subscriber_count = subscriber_count - COALESCE((SELECT value FROM UNNEST(NEW.data) WHERE time > ('now'::date - '1 day'::interval) ORDER BY time LIMIT 1), 0),
      weekly_subscriber_count = subscriber_count - COALESCE((SELECT value FROM UNNEST(NEW.data) WHERE time > ('now'::date - '1 week'::interval) ORDER BY time LIMIT 1), 0),
      monthly_subscriber_count = subscriber_count - COALESCE((SELECT value FROM UNNEST(NEW.data) WHERE time > ('now'::date - '1 month'::interval) ORDER BY time LIMIT 1), 0)
    WHERE subscriber_statistics_id = NEW.id;
  END IF;

  IF NEW.type = 'bilibili_channel_view' AND OLD.data <> NEW.data THEN
    UPDATE bilibili_channels
    SET
      daily_view_count = view_count - COALESCE((SELECT value FROM UNNEST(NEW.data) WHERE time > ('now'::date - '1 day'::interval) ORDER BY time LIMIT 1), 0),
      weekly_view_count = view_count - COALESCE((SELECT value FROM UNNEST(NEW.data) WHERE time > ('now'::date - '1 week'::interval) ORDER BY time LIMIT 1), 0),
      monthly_view_count = view_count - COALESCE((SELECT value FROM UNNEST(NEW.data) WHERE time > ('now'::date - '1 month'::interval) ORDER BY time LIMIT 1), 0)
    WHERE view_statistics_id = NEW.id;
  END IF;

  IF NEW.type = 'youtube_stream_viewer' AND OLD.data <> NEW.data THEN
    UPDATE youtube_streams
    SET
      average_viewer_count = (SELECT TRUNC(AVG(value)) FROM UNNEST(NEW.data)),
      max_viewer_count = (SELECT MAX(value) FROM UNNEST(NEW.data))
    WHERE viewer_statistics_id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_report_count_trigger AFTER UPDATE ON statistics
FOR EACH ROW EXECUTE PROCEDURE calculate_report_count();

CREATE OR REPLACE FUNCTION create_bilibili_channel_statistics()
RETURNS trigger AS $$
BEGIN
  WITH subscriber_statistics AS (INSERT INTO statistics (type) VALUES ('bilibili_channel_subscriber') RETURNING id),
  view_statistics AS (INSERT INTO statistics (type) VALUES ('bilibili_channel_view') RETURNING id)
  UPDATE bilibili_channels
  SET
    subscriber_statistics_id = (SELECT id FROM subscriber_statistics),
    view_statistics_id = (SELECT id FROM view_statistics)
  WHERE vtuber_id = NEW.vtuber_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_bilibili_channel_statistics_trigger AFTER INSERT ON bilibili_channels
FOR EACH ROW EXECUTE PROCEDURE create_bilibili_channel_statistics();

CREATE OR REPLACE FUNCTION create_youtube_channel_statistics()
RETURNS trigger AS $$
BEGIN
  WITH subscriber_statistics AS (INSERT INTO statistics (type) VALUES ('youtube_channel_subscriber') RETURNING id),
  view_statistics AS (INSERT INTO statistics (type) VALUES ('youtube_channel_view') RETURNING id)
  UPDATE youtube_channels
  SET
    subscriber_statistics_id = (SELECT id FROM subscriber_statistics),
    view_statistics_id = (SELECT id FROM view_statistics)
  WHERE vtuber_id = NEW.vtuber_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_youtube_channel_statistics_trigger AFTER INSERT ON youtube_channels
FOR EACH ROW EXECUTE PROCEDURE create_youtube_channel_statistics();

CREATE OR REPLACE FUNCTION create_youtube_streams_statistics()
RETURNS trigger AS $$
BEGIN
  WITH viewer_statistics AS (INSERT INTO statistics (type) values ('youtube_stream_viewer') RETURNING id)
  UPDATE youtube_streams
  SET
    viewer_statistics_id = (SELECT id FROM viewer_statistics)
  WHERE stream_id = NEW.stream_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_youtube_streams_statistics_trigger AFTER INSERT ON youtube_streams
FOR EACH ROW EXECUTE PROCEDURE create_youtube_streams_statistics();
