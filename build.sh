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
