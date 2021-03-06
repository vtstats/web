# Read vtubers.csv and rewrite the vtuber-related scripts.
# Run: python3 csv_to_script.py
# Author: linnil1
import pandas as pd
import numpy as np
from pprint import pprint
from jinja2 import Environment, BaseLoader

# read vtuber data
vtubers = pd.read_csv("vtuber.csv")
vtubers = vtubers.to_dict("records")
vtubers = sorted(vtubers, key=lambda i: i['id'])
for i in vtubers:
    i['default'] = str(i['default']).lower()
pprint(vtubers)

# get batch from vtubers
batches = {}
for i in vtubers:
    if i['companyid'] is np.nan:
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


def render(f, vtubers, batches={}, trailing=False):
    """ read xx.j2 and rewrite xx """
    env = Environment(loader=BaseLoader(), keep_trailing_newline=trailing)
    template = env.from_string(open(f + '.j2').read())
    template = template.stream(vtubers=vtubers, batches=batches)
    # print(''.join(list(template)))
    template.dump(f)


# write the files
render("server/src/vtubers.rs", vtubers)
render("server/sql/initial.sql", vtubers)
render("web/vtubers.ts", vtubers, batches)
render("web/src/i18n/zh.ts", vtubers, batches, trailing=True)
render("web/src/i18n/en.ts", vtubers, batches, trailing=True)
