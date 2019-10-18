mod consts;
mod types;
mod utils;

use chrono::{Timelike, Utc};
use futures::future::{try_join, try_join3, try_join_all};
use isahc::HttpClient;
use std::str::FromStr;

use crate::{
    consts::VTUBERS,
    types::{Result, Values},
    utils::{
        bilibili_stat, patch_values, vtuber_stats_at, vtuber_stats_timestamps, youtube_channels,
        Auth,
    },
};

#[tokio::main]
async fn main() -> Result<()> {
    let client = HttpClient::builder().build()?;

    let auth = Auth::new(&client).await?;

    let curr = curr_stats(&client).await?;
    let past = past_stats(&client, &auth.id_token).await?;

    let now = Utc::now().timestamp();

    let mut values = Values::default();

    for (vtb, curr) in VTUBERS.iter().zip(&curr) {
        let name = vtb.name;
        values.insert(format!("/vtuberStats/{}/{}/0", name, now), curr[0]);
        values.insert(format!("/vtuberStats/{}/{}/1", name, now), curr[1]);
        values.insert(format!("/vtuberStats/{}/{}/2", name, now), curr[2]);
        values.insert(format!("/vtuberStats/{}/{}/3", name, now), curr[3]);

        values.insert(format!("/vtubers/{}/youtubeStats/subs", name), curr[0]);
        values.insert(format!("/vtubers/{}/youtubeStats/views", name), curr[1]);
        values.insert(format!("/vtubers/{}/bilibiliStats/subs", name), curr[2]);
        values.insert(format!("/vtubers/{}/bilibiliStats/views", name), curr[3]);
    }

    for ((vtb, curr), a_day_ago) in VTUBERS.iter().zip(&curr).zip(&past[0]) {
        let name = vtb.name;
        values.insert(
            format!("/vtubers/{}/youtubeStats/dailySubs", name),
            curr[0] - a_day_ago[0],
        );
        values.insert(
            format!("/vtubers/{}/youtubeStats/dailyViews", name),
            curr[1] - a_day_ago[1],
        );
        values.insert(
            format!("/vtubers/{}/bilibiliStats/dailySubs", name),
            curr[2] - a_day_ago[2],
        );
        values.insert(
            format!("/vtubers/{}/bilibiliStats/dailyViews", name),
            curr[3] - a_day_ago[3],
        );
    }

    for ((vtb, curr), a_week_ago) in VTUBERS.iter().zip(&curr).zip(&past[1]) {
        let name = vtb.name;
        values.insert(
            format!("/vtubers/{}/youtubeStats/weeklySubs", name),
            curr[0] - a_week_ago[0],
        );
        values.insert(
            format!("/vtubers/{}/youtubeStats/weeklyViews", name),
            curr[1] - a_week_ago[1],
        );
        values.insert(
            format!("/vtubers/{}/bilibiliStats/weeklySubs", name),
            curr[2] - a_week_ago[2],
        );
        values.insert(
            format!("/vtubers/{}/bilibiliStats/weeklyViews", name),
            curr[3] - a_week_ago[3],
        );
    }

    for ((vtb, curr), a_month_ago) in VTUBERS.iter().zip(&curr).zip(&past[2]) {
        let name = vtb.name;
        values.insert(
            format!("/vtubers/{}/youtubeStats/monthlySubs", name),
            curr[0] - a_month_ago[0],
        );
        values.insert(
            format!("/vtubers/{}/youtubeStats/monthlyViews", name),
            curr[1] - a_month_ago[1],
        );
        values.insert(
            format!("/vtubers/{}/bilibiliStats/monthlySubs", name),
            curr[2] - a_month_ago[2],
        );
        values.insert(
            format!("/vtubers/{}/bilibiliStats/monthlyViews", name),
            curr[3] - a_month_ago[3],
        );
    }

    values.insert("/updatedAt/vtuberStat", Utc::now());

    patch_values(&client, &auth.id_token, values).await?;

    Ok(())
}

async fn curr_stats(client: &HttpClient) -> Result<Vec<[i32; 4]>> {
    let channels_id = VTUBERS
        .iter()
        .map(|v| v.youtube)
        .filter(|id| !id.is_empty())
        .collect::<Vec<_>>()
        .join(",");

    let (youtube_stats, bilibili_stats) = try_join(
        if Utc::now().hour() % 2 == 0 {
            youtube_channels(&client, &channels_id, env!("YOUTUBE_API_KEY0"))
        } else {
            youtube_channels(&client, &channels_id, env!("YOUTUBE_API_KEY1"))
        },
        try_join_all(VTUBERS.iter().map(|v| bilibili_stat(&client, v.bilibili))),
    )
    .await?;

    Ok(VTUBERS
        .iter()
        .map(|vtuber| {
            youtube_stats
                .iter()
                .find(|c| c.id == vtuber.youtube)
                .map(|stat| {
                    (
                        i32::from_str(&stat.statistics.subscriber_count).unwrap(),
                        i32::from_str(&stat.statistics.view_count).unwrap(),
                    )
                })
                .unwrap_or_default()
        })
        .zip(bilibili_stats)
        .map(
            |((youtube_subs, youtube_views), (bilibili_subs, bilibili_views))| {
                [youtube_subs, youtube_views, bilibili_subs, bilibili_views]
            },
        )
        .collect())
}

async fn past_stats(client: &HttpClient, id_token: &str) -> Result<[Vec<[i32; 4]>; 3]> {
    let timestamps = vtuber_stats_timestamps(&client, id_token).await?;

    let now = Utc::now().timestamp();

    let a_day_ago = timestamps
        .iter()
        .find(|t| **t >= now - 24 * 60 * 60)
        .unwrap();

    let a_week_ago = timestamps
        .iter()
        .find(|t| **t >= now - 7 * 24 * 60 * 60)
        .unwrap();

    let a_month_ago = timestamps
        .iter()
        .find(|t| **t >= now - 30 * 24 * 60 * 60)
        .unwrap();

    let (a_day_ago_stats, a_week_ago_stats, a_month_ago) = try_join3(
        try_join_all(
            VTUBERS
                .iter()
                .map(|v| vtuber_stats_at(&client, &id_token, v.name, *a_day_ago)),
        ),
        try_join_all(
            VTUBERS
                .iter()
                .map(|v| vtuber_stats_at(&client, &id_token, v.name, *a_week_ago)),
        ),
        try_join_all(
            VTUBERS
                .iter()
                .map(|v| vtuber_stats_at(&client, &id_token, v.name, *a_month_ago)),
        ),
    )
    .await?;

    Ok([a_day_ago_stats, a_week_ago_stats, a_month_ago])
}
