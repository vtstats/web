---
name: Add new vtuber/group
about: Add new vtuber/group
title: ''
labels: ''
assignees: PoiScript

---

```yaml
# template of adding new vtuber
vtuber_id: shirakami-fubuki #required, unique id, must be kebab-case
native_name: 白上フブキ # required, name in their naive language
japanese_name: Shirakami Fubuki # optional, name in Japanese, leave it blank if equals to `native_name`
english_name:  # optional, name in English, leave it blank if equals to `native_name`
youtube_channel_id: UCoSrY_IQQVpmIRZ9Xf-y93g # required, youtube channel id
twitch_channel_id: 198633200 # optional, twitch channel id
twitter_id: shirakamifubuki # optional, twitter username
```

```yaml
# template of adding new group
group_id: hololive # required, unique id, must be kebab-case
root: true # required
native_name: ホロライブ # required, name in their naive language
japanese_name:  # optional, name in Japanese, leave it blank if equals to `native_name`
english_name: Hololive # optional, name in English, leave it blank if equals to `native_name`
children: ["vtuber:hololive-jp-offical", "group:hololive-jp"] # required, value must be  vtuber:$vtuber_id` or `group:$group_id`
```
