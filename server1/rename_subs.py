import os
import csv
import asyncio
import argparse
import asyncpg


def setup_parser():
    parser = argparse.ArgumentParser(
            description='Utility to retrieve videos from vtubers')
    parser.add_argument('--lastn', default=0, type=int,
                        help="Update last n row in vtubers.csv")
    parser.add_argument('--vtuber_csv', default="./vtuber.csv",
                        help="Path to vtubers.csv")
    return parser


def customVT(lastn, csvfile):
    vtubers = read_csv(csvfile)
    return vtubers[-lastn:]


def read_csv(csvfile):
    with open(csvfile, "r") as fin:
        reader = csv.DictReader(fin)
        return list(reader)


async def main(args):
    conn = await asyncpg.connect(db_url)
    for vt in customVT(args.lastn, args.vtuber_csv):
        print("Update", vt['id'])
        async with conn.transaction():
            await conn.execute("UPDATE youtube_channel_subscriber_statistic"
                               " SET vtuber_id = $1 WHERE vtuber_id = $2",
                               vt['id'], vt['youtube'])
            await conn.execute("UPDATE youtube_channel_view_statistic"
                               " SET vtuber_id = $1 WHERE vtuber_id = $2",
                               vt['id'], vt['youtube'])


db_url = os.environ.get("DATABASE_URL",
                        "postgres://holostats:holostats"
                        "@localhost:5432/holostats")
parser = setup_parser()
args = parser.parse_args()
asyncio.run(main(args))
