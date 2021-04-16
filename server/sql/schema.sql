---- Tables

CREATE TABLE youtube_channels (
  vtuber_id TEXT PRIMARY KEY,
  subscriber_count INTEGER NOT NULL DEFAULT 0,
  daily_subscriber_count INTEGER NOT NULL DEFAULT 0,
  weekly_subscriber_count INTEGER NOT NULL DEFAULT 0,
  monthly_subscriber_count INTEGER NOT NULL DEFAULT 0,
  view_count INTEGER NOT NULL DEFAULT 0,
  daily_view_count INTEGER NOT NULL DEFAULT 0,
  weekly_view_count INTEGER NOT NULL DEFAULT 0,
  monthly_view_count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE youtube_channels_ex (
  vtuber_id TEXT NOT NULL REFERENCES youtube_channels,
  video_count INTEGER NOT NULL DEFAULT 0,
  weekly_video INTEGER NOT NULL DEFAULT 0,
  weekly_live INTEGER NOT NULL DEFAULT 0,
  weekly_duration INTEGER NOT NULL DEFAULT 0,
  monthly_video INTEGER NOT NULL DEFAULT 0,
  monthly_live INTEGER NOT NULL DEFAULT 0,
  monthly_duration INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE bilibili_channels (
  vtuber_id TEXT PRIMARY KEY,
  subscriber_count INTEGER NOT NULL DEFAULT 0,
  daily_subscriber_count INTEGER NOT NULL DEFAULT 0,
  weekly_subscriber_count INTEGER NOT NULL DEFAULT 0,
  monthly_subscriber_count INTEGER NOT NULL DEFAULT 0,
  view_count INTEGER NOT NULL DEFAULT 0,
  daily_view_count INTEGER NOT NULL DEFAULT 0,
  weekly_view_count INTEGER NOT NULL DEFAULT 0,
  monthly_view_count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TYPE stream_status AS ENUM ('scheduled', 'live', 'ended');

CREATE TABLE youtube_streams (
  stream_id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  thumbnail_url TEXT,
  vtuber_id TEXT REFERENCES youtube_channels NOT NULL,
  schedule_time TIMESTAMPTZ,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  status stream_status NOT NULL,
  average_viewer_count INTEGER,
  max_viewer_count INTEGER,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE youtube_channel_subscriber_statistic (
  vtuber_id TEXT NOT NULL REFERENCES youtube_channels,
  time TIMESTAMPTZ NOT NULL,
  value INTEGER NOT NULL
);

CREATE TABLE youtube_channel_view_statistic (
  vtuber_id TEXT NOT NULL REFERENCES youtube_channels,
  time TIMESTAMPTZ NOT NULL,
  value INTEGER NOT NULL
);

CREATE TABLE bilibili_channel_subscriber_statistic (
  vtuber_id TEXT NOT NULL REFERENCES bilibili_channels,
  time TIMESTAMPTZ NOT NULL,
  value INTEGER NOT NULL
);

CREATE TABLE bilibili_channel_view_statistic (
  vtuber_id TEXT NOT NULL REFERENCES bilibili_channels,
  time TIMESTAMPTZ NOT NULL,
  value INTEGER NOT NULL
);

CREATE TABLE youtube_stream_viewer_statistic (
  stream_id TEXT NOT NULL REFERENCES youtube_streams,
  time TIMESTAMPTZ NOT NULL,
  value INTEGER NOT NULL
);

---- Triggers

CREATE OR REPLACE FUNCTION update_youtube_channel_subscriber_count()
RETURNS trigger AS $$
BEGIN
    with data as (
           select time, value
             from youtube_channel_subscriber_statistic
            where vtuber_id = NEW.vtuber_id
         )
  update youtube_channels
     set (daily_subscriber_count, weekly_subscriber_count, monthly_subscriber_count)
       = (
           subscriber_count - COALESCE((SELECT value FROM data WHERE time < (NOW() - INTERVAL '1 day') ORDER BY time DESC LIMIT 1), 0),
           subscriber_count - COALESCE((SELECT value FROM data WHERE time < (NOW() - INTERVAL '1 week') ORDER BY time DESC LIMIT 1), 0),
           subscriber_count - COALESCE((SELECT value FROM data WHERE time < (NOW() - INTERVAL '1 month') ORDER BY time DESC LIMIT 1), 0)
         )
   where vtuber_id = NEW.vtuber_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_youtube_channel_subscriber_count_trigger
AFTER INSERT ON youtube_channel_subscriber_statistic
FOR EACH ROW EXECUTE PROCEDURE update_youtube_channel_subscriber_count();

CREATE OR REPLACE FUNCTION update_youtube_channel_view_count()
RETURNS trigger AS $$
BEGIN
    with data as (
           select time, value
             from youtube_channel_view_statistic
            where vtuber_id = NEW.vtuber_id
         )
  update youtube_channels
     set (daily_view_count, weekly_view_count, monthly_view_count)
       = (
           view_count - COALESCE((SELECT value FROM data WHERE time < (NOW() - INTERVAL '1 day') ORDER BY time DESC LIMIT 1), 0),
           view_count - COALESCE((SELECT value FROM data WHERE time < (NOW() - INTERVAL '1 week') ORDER BY time DESC LIMIT 1), 0),
           view_count - COALESCE((SELECT value FROM data WHERE time < (NOW() - INTERVAL '1 month') ORDER BY time DESC LIMIT 1), 0)
         )
   where vtuber_id = NEW.vtuber_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_youtube_channel_view_count_trigger
AFTER INSERT ON youtube_channel_view_statistic
FOR EACH ROW EXECUTE PROCEDURE update_youtube_channel_view_count();

CREATE OR REPLACE FUNCTION update_bilibili_channel_subscriber_count()
RETURNS trigger AS $$
BEGIN
    with data as (
           select time, value
             from bilibili_channel_subscriber_statistic
            where vtuber_id = NEW.vtuber_id
         )
  update bilibili_channels
     set (daily_subscriber_count, weekly_subscriber_count, monthly_subscriber_count)
       = (
           subscriber_count - COALESCE((SELECT value FROM data WHERE time < (NOW() - INTERVAL '1 day') ORDER BY time DESC LIMIT 1), 0),
           subscriber_count - COALESCE((SELECT value FROM data WHERE time < (NOW() - INTERVAL '1 week') ORDER BY time DESC LIMIT 1), 0),
           subscriber_count - COALESCE((SELECT value FROM data WHERE time < (NOW() - INTERVAL '1 month') ORDER BY time DESC LIMIT 1), 0)
         )
   where vtuber_id = NEW.vtuber_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_bilibili_channel_subscriber_count_trigger
AFTER INSERT ON bilibili_channel_subscriber_statistic
FOR EACH ROW EXECUTE PROCEDURE update_bilibili_channel_subscriber_count();

CREATE OR REPLACE FUNCTION update_bilibili_channel_view_count()
RETURNS trigger AS $$
BEGIN
    with data as (
           select time, value
             from bilibili_channel_view_statistic
            where vtuber_id = NEW.vtuber_id
         )
  update bilibili_channels
     set (daily_view_count, weekly_view_count, monthly_view_count)
       = (
           view_count - COALESCE((SELECT value FROM data WHERE time < (NOW() - INTERVAL '1 day') ORDER BY time DESC LIMIT 1), 0),
           view_count - COALESCE((SELECT value FROM data WHERE time < (NOW() - INTERVAL '1 week') ORDER BY time DESC LIMIT 1), 0),
           view_count - COALESCE((SELECT value FROM data WHERE time < (NOW() - INTERVAL '1 month') ORDER BY time DESC LIMIT 1), 0)
         )
   where vtuber_id = NEW.vtuber_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_bilibili_channel_view_count_trigger
AFTER INSERT ON bilibili_channel_view_statistic
FOR EACH ROW EXECUTE PROCEDURE update_bilibili_channel_view_count();

CREATE OR REPLACE FUNCTION update_youtube_streams_viewer_count()
RETURNS trigger AS $$
BEGIN
    with data as (
           select time, value
             from youtube_stream_viewer_statistic
            where stream_id = NEW.stream_id
         )
  update youtube_streams
     set (average_viewer_count, max_viewer_count)
       = (
           (select trunc(avg(value)) from data),
           (select max(value) from data)
         )
   where stream_id = NEW.stream_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_youtube_streams_viewer_count_trigger
AFTER INSERT ON youtube_stream_viewer_statistic
FOR EACH ROW EXECUTE PROCEDURE update_youtube_streams_viewer_count();

-- Stream Stat
-- Update the duration everytime when new stream inserted
CREATE OR REPLACE FUNCTION update_youtube_channel_ex_videocount()
RETURNS TRIGGER AS $$
DECLARE
   vrow youtube_channels_ex%rowtype;
BEGIN
FOR vrow in SELECT * FROM youtube_channels_ex LOOP
    with data as (
        select start_time, (end_time - start_time) AS duration
            from youtube_streams
            where vtuber_id = vrow.vtuber_id AND end_time IS NOT NULL
    )
    update youtube_channels_ex
       set (video_count, weekly_video, weekly_live, weekly_duration,
                        monthly_video, monthly_live, monthly_duration) = (
           COALESCE((SELECT count(start_time) FROM data), 0),
           COALESCE((SELECT count(start_time) FROM data
                        WHERE start_time > (NOW() - INTERVAL '1 week')
                         AND duration <= INTERVAL '30 minute'), 0),
           COALESCE((SELECT count(start_time) FROM data
                        WHERE start_time > (NOW() - INTERVAL '1 week')
                         AND duration > INTERVAL '30 minute'), 0),
           COALESCE((SELECT TRUNC(EXTRACT(EPOCH FROM SUM(duration))) FROM data
                        WHERE start_time > (NOW() - INTERVAL '1 week')) , 0),
           COALESCE((SELECT count(start_time) FROM data
                        WHERE start_time > (NOW() - INTERVAL '1 month')
                          AND duration <= INTERVAL '30 minute'), 0),
           COALESCE((SELECT count(start_time) FROM data
                        WHERE start_time > (NOW() - INTERVAL '1 month')
                          AND duration > INTERVAL '30 minute'), 0),
           COALESCE((SELECT TRUNC(EXTRACT(EPOCH FROM SUM(duration))) FROM data
                        WHERE start_time > (NOW() - INTERVAL '1 month')) , 0)
       )
        where vtuber_id = vrow.vtuber_id;
    END LOOP;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER update_youtube_channel_ex_videocount_trigger
AFTER INSERT OR DELETE ON youtube_streams
EXECUTE PROCEDURE update_youtube_channel_ex_videocount();
