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

    for i in range(0, len(ids), 50):
        cids = ids[i:i+50]
        # this google api is sync, not good
        stat = youtube.channels().list(part="statistics",
                                       id=",".join(cids),
                                       maxResults=50).execute()
        for record in stat['items']:
            id = record['id']
            stat = record['statistics']
            stat_subs, stat_views = None, None
            if stat.get('subscriberCount'):
                stat_subs = int(stat['subscriberCount'])
            if stat.get('viewCount'):
                stat_views = int(stat['viewCount'])
            print(id, stat_subs, stat_views)
            await insert_db(conn, id, stat_subs, stat_views)

    await conn.close()


# main
apikey = os.environ.get("YOUTUBE_API_KEY1")
db_url = os.environ.get("DATABASE_URL",
                        "postgres://holostats:holostats@localhost:5433/holostats")
asyncio.run(main())
