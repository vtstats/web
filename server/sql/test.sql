\set ON_ERROR_STOP on
\set today date_trunc('''day''', now())

create or replace function assert(boolean) returns void as $$
    begin
        if not $1 then
            assert(exception 'asserting failed');
        end if;
    end;
$$ language plpgsql;

update youtube_channels
   set (updated_at, view_count,daily_view_count, weekly_view_count, monthly_view_count)
     = (:today - interval '30 day', 1000, 0, 0, 0)
 where vtuber_id = 'ayame';

insert into youtube_channel_view_statistic (vtuber_id, time, value)
     values ('ayame', :today - interval '32 day', 100),
            ('ayame', :today - interval '8 day', 400),
            ('ayame', :today - interval '2 day', 800);

do $$
declare
    youtube_channel youtube_channels%rowtype;
begin
    select * from youtube_channels into youtube_channel where vtuber_id = 'ayame';

    assert(youtube_channel.vtuber_id = 'ayame');
    assert(youtube_channel.view_count = 1000);
    assert(youtube_channel.daily_view_count = 1000 - 800);
    assert(youtube_channel.weekly_view_count = 1000 - 400);
    assert(youtube_channel.monthly_view_count = 1000 - 100);
end;
$$;

insert into youtube_streams (stream_id, title, vtuber_id, updated_at, status)
     values ('poi', 'Stream Title', 'ayame', :today, 'ended');

insert into youtube_stream_viewer_statistic (stream_id, value, time)
     values ('poi', 100, :today),
            ('poi', 200, :today + interval '15 second'),
            ('poi', 300, :today + interval '30 second'),
            ('poi', 400, :today + interval '45 second');

do $$
declare
    youtube_stream youtube_streams%rowtype;
begin
    select * from youtube_streams into youtube_stream where stream_id = 'poi';

    assert(youtube_stream.stream_id = 'poi');
    assert(youtube_stream.average_viewer_count = 250);
    assert(youtube_stream.max_viewer_count = 400);
end;
$$;
