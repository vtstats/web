<div align="center">
<div>
  <img src="./logo.svg" alt="HoloStats Logo" width="350" height="100" />
</div>
<div>
  <img
    alt="MIT License"
    src="https://img.shields.io/github/license/PoiScript/HoloStats"
  />
  <img
    alt="GitHub Workflow Status - Web Prod"
    src="https://github.com/PoiScript/HoloStats/workflows/Web%20Prod/badge.svg"
  />
  <img
    alt="GitHub Workflow Status - Web Dev"
    src="https://github.com/PoiScript/HoloStats/workflows/Web%20Dev/badge.svg"
  />
  <img
    alt="GitHub Workflow Status - Rust"
    src="https://github.com/PoiScript/HoloStats/workflows/Rust/badge.svg"
  />
</div>
<div>
  <p>Collects & visualizes VTuber statistics</p>
</div>
</div>


This repo is fork from PoiScript/HoloStats,
it is a great framework.
Thanks PoiScript.

# Taiwan Vtuber
A web that collected popular Taiwan Vtubers.
Included:
1. Debut as Vtuber
2. Popular (subscription above some level) OR
3. Monetization

I retrieve the vtubers information from https://vt.cdein.cc

## How to add new vtubers to this web.
1. Edit `vtubers.csv` and PR or put that in issue OR
2. PM me in Discord

## Difference between original one
* Bilibili Removed
* Discord and Facebook link are added
* A python script that generates scripts from a single csv by jinja2 templates
* scp are used instead of rsync in CICD
* Add taiwan vtubers data
* Some of HoloStat and poi are renamed
* Some python utilities in `server1/`
* A new statistic table of video counts and video length in specific time interval

## Article
Here is my article to record the work I have done to deploy the entire serivce.
(Not included maintaing and new features).

https://linnil1.medium.com/taiwanv-%E7%B6%B2%E7%AB%99%E6%9E%B6%E8%A8%AD-90c11098746d
