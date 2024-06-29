set -e

export PATH="$PATH:$(yarn global bin)"

rm -rf dist/

node ./tools/inject.mjs
yarn ng build -c production --stats-json=false
# https://github.com/cloudflare/workers-sdk/tree/main/packages/create-cloudflare/templates/angular
node ./tools/copy-files.mjs
node ./tools/alter-polyfills.mjs

# create headers and redirets files
echo '/api/* https://vt-api.poi.cat/api/:splat' > ./dist/cloudflare/_redirects
echo '/*
  x-frames-option: sameorigin' > ./dist/cloudflare/_headers
echo '{
  "version": 1,
  "include": ["/vtuber/*", "/youtube-stream/*", "/twitch-stream/*"],
  "exclude": []
}' > ./dist/cloudflare/_routes.json

# reset index.html that previously modifed by inject.mjs
git checkout ./src/index.html

# # create a deploy in sentry
# if [ "$CF_PAGES_BRANCH" = "master" ] || [ "$CF_PAGES_BRANCH" = "dev" ]; then
#   yarn global add @sentry/cli
#   sentry-cli releases new $CF_PAGES_COMMIT_SHA
#   sentry-cli releases set-commits $CF_PAGES_COMMIT_SHA --commit "PoiScript/HoloStats@$CF_PAGES_COMMIT_SHA"
#   sentry-cli releases deploys $CF_PAGES_COMMIT_SHA new -e $CF_PAGES_BRANCH
#   sentry-cli releases finalize $CF_PAGES_COMMIT_SHA
# fi
