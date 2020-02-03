DROP TRIGGER IF EXISTS calculate_report_count_trigger ON statistics;
DROP TRIGGER IF EXISTS create_bilibili_channel_statistics_trigger ON bilibili_channels;
DROP TRIGGER IF EXISTS create_youtube_channel_statistics_trigger ON youtube_channels;
DROP TRIGGER IF EXISTS create_youtube_streams_statistics_trigger ON youtube_streams;

DROP FUNCTION IF EXISTS calculate_report_count;
DROP FUNCTION IF EXISTS create_bilibili_channel_statistics;
DROP FUNCTION IF EXISTS create_youtube_channel_statistics;
DROP FUNCTION IF EXISTS create_youtube_streams_statistics;

DROP TABLE IF EXISTS youtube_streams;
DROP TABLE IF EXISTS bilibili_channels;
DROP TABLE IF EXISTS youtube_channels;
DROP TABLE IF EXISTS statistics;

DROP TYPE IF EXISTS youtube_stream_status;
DROP TYPE IF EXISTS statistic;
DROP TYPE IF EXISTS statistic_type;
