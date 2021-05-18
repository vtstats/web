# Read vtubers.csv and rewrite the vtuber-related scripts.
# Run: python3 csv_to_script.py
# Author: linnil1
import pandas as pd
import numpy as np
from pprint import pprint
from jinja2 import Environment, BaseLoader
import argparse
import sys


def read_vtuber(f):
    """ read vtuber data """
    vtubers = pd.read_csv(f)
    vtubers = vtubers.replace(np.nan, '', regex=True)
    print(vtubers)
    vtubers = vtubers.to_dict("records")
    vtubers = sorted(vtubers, key=lambda i: i['id'])
    for i in vtubers:
        i['default'] = str(i['default']).lower()
    pprint(vtubers)
    return vtubers


def extract_batch(vtubers):
    """ Get batch information from vtubers """
    batches = {}
    for i in vtubers:
        if not i['companyid']:
            batches[i['id']] = {
                'id': i['id'],
                'name': i['name'],
                'member': [],
            }
            continue
        elif i['companyid'] not in batches:
            batches[i['companyid']] = {
                'id': i['companyid'],
                'name': i['companyname'],
                'member': [],
            }
        batches[i['companyid']]['member'].append(i['id'])
    batches = batches.values()
    for i in batches:
        if not i['member']:
            i['member'] = "null"
        else:
            i['member'] = "[" + ", ".join(f'"{j}"' for j in i['member']) + "]"
    batches = sorted(batches, key=lambda i: i['id'])
    # pprint(batches)
    return batches


def render(f, vtubers, batches={}, trailing=False):
    """ read xx.j2 and rewrite xx """
    env = Environment(loader=BaseLoader(), keep_trailing_newline=trailing)
    template = env.from_string(open(f + '.j2').read())
    template = template.stream(vtubers=vtubers, batches=batches)
    # print(''.join(list(template)))
    template.dump(f)


def download_thumbnail(vtubers, rewrite=False):
    """ Download the thumbnail of vtuber """
    from googleapiclient.discovery import build
    import os
    youtube = build('youtube', 'v3',
                    developerKey=os.environ['YOUTUBE_API_KEY0'])
    for i in vtubers:
        thumbnail_path = "web/src/assets/thumbnail/" + i['id'] + ".jpg"
        if not rewrite and os.path.exists(thumbnail_path):
            continue
        snippet = youtube.channels().list(part="snippet",
                                          id=i['youtube']).execute()
        url = snippet['items'][0]["snippet"]["thumbnails"]["default"]["url"]
        os.system(f"wget {url} -O {thumbnail_path}")
        os.system(f"cp {thumbnail_path} web/src/assets/profiles/")


def render_vtuber(vtubers, batches):
    """ write the files """
    render("server/holostats.toml", vtubers)
    render("server/sql/initial.sql", vtubers)
    render("web/vtubers.ts", vtubers, batches)
    render("web/src/i18n/zh.ts", vtubers, batches, trailing=True)
    render("web/src/i18n/en.ts", vtubers, batches, trailing=True)


if __name__ == "__main__":
    # add parser
    parser = argparse.ArgumentParser(
            description='Utility to add new vtubers from vtubers.csv')
    parser.add_argument('--download', action='store_true',
                        help="Download the thumbnail. "
                             "Usage: YOUTUBE_API_KEY0=xxxx "
                             "python3 csv_to_script --download")
    parser.add_argument('--render', action='store_true',
                        help="Regenerate vtuber-related script")
    args = parser.parse_args()

    # get vtubers information
    vtubers = read_vtuber("vtuber.csv")
    batches = extract_batch(vtubers)
    if not args.download and not args.render:
        parser.print_help(sys.stderr)
        sys.exit(1)
    if args.download:
        download_thumbnail(vtubers)
    if args.render:
        render_vtuber(vtubers, batches)
