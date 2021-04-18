#!/usr/bin/env bash

for file in $(ls *.timer *.service); do cp $file /usr/lib/systemd/system/; done

systemctl daemon-reload

systemctl enable holostats_server
systemctl enable holostats_stream_stat
systemctl enable holostats_stream_stat.timer
systemctl enable holostats_channel_stat
systemctl enable holostats_channel_stat.timer
systemctl enable holostats_rss
systemctl enable holostats_rss.timer

systemctl start holostats_server
systemctl start holostats_stream_stat.timer
systemctl start holostats_channel_stat.timer
systemctl start holostats_rss.timer

systemctl status holostats_*
systemctl list-timers
