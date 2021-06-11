# Python server

This folder put lots of python utility to do something other than original HoloStats

Tools:
* `csv_to_script.py --download`: Download vtuber's thumbnails
* `csv_to_script.py --render`: Read vtuber.csv and render into typescript settings for web
* `save_all_subs.py`: Read Taiwan vtuber's youtube ID in https://vt.cdein.cc and save subscriptions and viewers in database. (The vtuber's name is same as youtube ID)
* `rename_subs.py`: Transfer youtube ID in database to readable name defined in vtuber.csv.
* `retrieve_videos.py`: Retrieve old videos in Youtube
* `systemd`: Setting to run `save_all_subs.py`
