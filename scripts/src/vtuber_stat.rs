mod consts;
mod types;
mod utils;

use chrono::Utc;
use futures::future::{try_join3, try_join_all};
use isahc::HttpClient;
use std::str::FromStr;
use std::time::Duration;

use crate::consts::VTUBERS;
use crate::types::{Result, Values};
use crate::utils::{
    auth, bilibili_stat, patch_values, vtuber_stats_at, vtuber_stats_timestamps, youtube_channels,
};

#[tokio::main]
async fn main() -> Result<()> {
    let client = HttpClient::builder()
        .tcp_keepalive(Duration::from_secs(5))
        .build()?;

    let auth = auth(&client).await?;

    let channel_ids = VTUBERS
        .iter()
        .map(|v| v.youtube)
        .collect::<Vec<_>>()
        .join(",");

    let (youtube_stat, bilibili_stat, timestamps) = try_join3(
        youtube_channels(&client, channel_ids),
        try_join_all(VTUBERS.iter().map(|v| bilibili_stat(&client, v.bilibili))),
        vtuber_stats_timestamps(&client, &auth.id_token),
    )
    .await?;

    let now = Utc::now();
    let now_timestamp = now.timestamp();
    let mut values = Values::default();

    values.insert(format!("/vtuberStats/_timestamps/{}", now_timestamp), true);

    let one_day_ago = (|| {
        let one_day_ago = now_timestamp - 24 * 60 * 60;
        for item in timestamps.windows(2) {
            if item[1] >= one_day_ago {
                values.insert(format!("/vtuberStats/_timestamps/{}", item[0]), ());
                return item[0];
            } else {
                values.insert(format!("/vtuberStats/_timestamps/{}", item[0]), ());
            }
        }
        *timestamps.last().unwrap()
    })();

    let one_day_ago_stats = try_join_all(
        VTUBERS
            .iter()
            .map(|v| vtuber_stats_at(&client, &auth.id_token, v.name, one_day_ago)),
    )
    .await?;

    for ((vtuber, &(bilibili_subs, bilibili_views)), one_day_ago) in VTUBERS
        .iter()
        .zip(bilibili_stat.iter())
        .zip(one_day_ago_stats.iter())
    {
        let youtube_channel = youtube_stat
            .iter()
            .find(|c| c.id == vtuber.youtube)
            .unwrap();

        let youtube_views = i32::from_str(&youtube_channel.statistics.view_count)?;
        let youtube_subs = i32::from_str(&youtube_channel.statistics.subscriber_count)?;

        values.insert(
            format!("/vtuberStats/{}/{}/{}", vtuber.name, now_timestamp, 0),
            youtube_subs,
        );
        values.insert(
            format!("/vtuberStats/{}/{}/{}", vtuber.name, now_timestamp, 1),
            youtube_views,
        );
        values.insert(
            format!("/vtuberStats/{}/{}/{}", vtuber.name, now_timestamp, 2),
            bilibili_subs,
        );
        values.insert(
            format!("/vtuberStats/{}/{}/{}", vtuber.name, now_timestamp, 3),
            bilibili_views,
        );

        values.insert(
            format!("/vtubers/{}/bilibiliStats/subs", vtuber.name),
            bilibili_subs,
        );
        values.insert(
            format!("/vtubers/{}/bilibiliStats/views", vtuber.name),
            bilibili_views,
        );
        values.insert(
            format!("/vtubers/{}/youtubeStats/subs", vtuber.name),
            youtube_subs,
        );
        values.insert(
            format!("/vtubers/{}/youtubeStats/views", vtuber.name),
            youtube_views,
        );

        values.insert(
            format!("/vtubers/{}/youtubeStats/dailySubs", vtuber.name),
            youtube_subs - one_day_ago[0],
        );
        values.insert(
            format!("/vtubers/{}/youtubeStats/dailyViews", vtuber.name),
            youtube_views - one_day_ago[1],
        );
        values.insert(
            format!("/vtubers/{}/bilibiliStats/dailySubs", vtuber.name),
            bilibili_subs - one_day_ago[2],
        );
        values.insert(
            format!("/vtubers/{}/bilibiliStats/dailyViews", vtuber.name),
            bilibili_views - one_day_ago[3],
        );
    }

    values.insert("/updatedAt/vtuberStat", now);

    patch_values(&client, &auth.id_token, values).await
}
