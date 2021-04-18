import os
import re
import csv
import asyncio
from datetime import datetime, timedelta
from pprint import pprint

import asyncpg
from googleapiclient.discovery import build

apikey = os.environ.get("YOUTUBE_API_KEY1")
db_url = os.environ.get("DATABASE_URL",
                        "postgres://holostats:holostats@localhost:5432/holostats")
csvfile = "vtuber.csv"


def customVT():
    vtubers = read_csv()
    return vtubers[35:]


def read_csv():
    with open(csvfile, "r") as fin:
        reader = csv.DictReader(fin)
        return list(reader)


def parse8601(t):
    return datetime.strptime(t, "%Y-%m-%dT%H:%M:%SZ")

def myprint(a, b):
    print(a)
    pprint(b)


def parse_time(ids):
    rep = youtube.videos().list(part="liveStreamingDetails,snippet,contentDetails",
                                fields="items(id,snippet/liveBroadcastContent,snippet/publishedAt,contentDetails/duration,liveStreamingDetails)",
                                maxResults=50,
                                id=",".join(ids)).execute()
    myprint("API", rep)

    data = {}
    for video in rep['items']:
        # live
        if video['snippet']['liveBroadcastContent'] != "none":
            continue
        if video.get("liveStreamingDetails"):
            data[video['id']] = {
                'start': parse8601(video['liveStreamingDetails']['actualStartTime']),
                'end': parse8601(video['liveStreamingDetails']['actualEndTime']),
                'live': True,
            }
        # normal video
        else:
            # calculate endtime via duration
            delta = video['contentDetails']['duration']
            hours = re.findall(r"(\d+)H", delta) or [0]
            mins = re.findall(r"(\d+)M", delta) or [0]
            secs = re.findall(r"(\d+)S", delta) or [0]
            delta = timedelta(hours=int(hours[0]), minutes=int(mins[0]), seconds=int(secs[0]))
            start = parse8601(video['snippet']['publishedAt'])

            data[video['id']] = {
                'start': start,
                'end': start + delta,
                'live': False,
            }

    return data


async def main():
    conn = await asyncpg.connect(db_url)

    for vt in customVT():
        n_ok, n_skip = 0, 0
        token = None
        while True:
            # TODO: add publishedAfter 4/16 4:00
            rep = youtube.search().list(part="snippet",
                                        channelId=vt['youtube'],
                                        type="video",
                                        maxResults=50,
                                        pageToken=token).execute()
            myprint("API", rep)

            # simplifier
            data = list(map(lambda i: {
                'vtuber_id': vt['id'],
                'stream_id': i['id']['videoId'],
                'title': i['snippet']['title'],
                'thumbnail_url': i['snippet']['thumbnails']['high']['url'],
                'status': "ended",
            }, rep['items']))

            # Calculate start and end time
            times = parse_time(map(lambda i: i['stream_id'], data))
            for i, video in enumerate(data):
                if video['stream_id'] not in times:
                    continue
                data[i].update({
                    'start_time': times[video['stream_id']]['start'],
                    'updated_at': times[video['stream_id']]['end'],
                    'end_time': times[video['stream_id']]['end'],
                    'live': times[video['stream_id']]['live'],
                })

            # Insert
            myprint("Formatted", data)
            for video in data:
                if 'updated_at' not in video:
                    n_skip += 1
                    print("Skip", video)
                    continue
                row = await conn.fetchrow("SELECT * FROM youtube_streams WHERE stream_id = $1", video['stream_id'])
                if row:
                    n_skip += 1
                    print("Skip", video)
                    continue

                # stupid ways
                keys, values = list(zip(*video.items()))
                keys1 = " ,".join(keys)
                keys2 = " ,".join([f"${i+1}" for i in range(len(keys))])
                async with conn.transaction():
                    print("Write", video)
                    n_ok += 1
                    await conn.execute(f"INSERT INTO youtube_streams ({keys1}) VALUES ({keys2})", *values)

            # next page
            if not rep.get('nextPageToken'):
                break
            token = rep['nextPageToken']

        # summary
        print(vt, f"ok {n_ok} skip {n_skip}")


youtube = build("youtube", "v3", developerKey=apikey)
asyncio.run(main())
