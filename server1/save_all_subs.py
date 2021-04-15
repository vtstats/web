import os
import re
import asyncio
from datetime import datetime

import httpx
import asyncpg
from googleapiclient.discovery import build


async def insert_db(conn, id, subs, views):
    row = await conn.fetchrow("SELECT * FROM youtube_channels WHERE vtuber_id = $1", id)
    async with conn.transaction():
        if not row:
            await conn.execute("INSERT INTO youtube_channels(vtuber_id) VALUES ($1)", id)
        if subs is not None:
            await conn.execute("INSERT INTO youtube_channel_subscriber_statistic(vtuber_id,time,value) VALUES ($1, $2, $3)",
                               id, datetime.utcnow(), subs)
        if views is not None:
            await conn.execute("INSERT INTO youtube_channel_view_statistic(vtuber_id,time,value) VALUES ($1, $2, $3)",
                               id, datetime.utcnow(), views)


async def main():
    conn = await asyncpg.connect(db_url)
    rep = httpx.get("https://vt.cdein.cc/list/?a=a")
    ids = re.findall("https://www.youtube.com/channel/(.*?)\"", rep.text)
    youtube = build("youtube", "v3", developerKey=apikey)

    for id in ids:
        # this google api is sync, not good
        stat = youtube.channels().list(part="statistics", id=id).execute()
        if not stat.get('items'):
            continue
        stat = stat['items'][0]['statistics']

        stat_subs, stat_views = None, None
        if stat.get('subscriberCount'):
            stat_subs = int(stat['subscriberCount'])
        if stat.get('viewCount'):
            stat_views = int(stat['viewCount'])
        print(id, stat_subs, stat_views)
        await insert_db(conn, id, stat_subs, stat_views)

    await conn.close()


# main
apikey = os.environ.get("YOUTUBE_API_KEY0")
db_url = os.environ.get("DATABASE_URL",
                        "postgres://holostats:holostats@localhost:5432/holostats")
asyncio.run(main())
