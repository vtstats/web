#!/usr/bin/env bash

for file in $(ls *.timer *.service); do cp $file /usr/lib/systemd/system/; done

systemctl daemon-reload

systemctl enable stream_list
systemctl enable stream_list.timer
systemctl enable stream_stat
systemctl enable stream_stat.timer
systemctl enable vtuber_stat
systemctl enable vtuber_stat.timer

systemctl start stream_list.timer
systemctl start stream_stat.timer
systemctl start vtuber_stat.timer

systemctl status stream_list stream_stat vtuber_stat
systemctl list-timers
