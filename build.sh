set -e

export PATH="$PATH:$(yarn global bin)"

rm -rf dist/

node ./tools/inject.mjs
yarn ng build -c production
# https://github.com/cloudflare/workers-sdk/tree/main/packages/create-cloudflare/templates/angular
node ./tools/copy-files.mjs
node ./tools/alter-polyfills.mjs

# reset index.html that previously modifed by inject.mjs
git checkout ./src/index.html
git checkout ./angular.json
