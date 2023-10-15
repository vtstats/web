set -e

export PATH="$PATH:$(yarn global bin)"

rm -rf dist/

node ./tools/env.mjs
yarn ng run vts:server:production
yarn ng run vts:build:production --stats-json=false
node ./tools/copy-worker-files.mjs
node ./tools/copy-client-files.mjs
node ./tools/bundle.mjs
# cloudflare pages will remove .html suffix,
# rename it to index.html.html so it can be served as /index.html
# https://community.cloudflare.com/t/is-there-an-option-prevent-removing-the-html-suffix/494412/3
mv ./dist/cloudflare/index.html ./dist/cloudflare/index.html.html

# # create a deploy in sentry
# if [ "$CF_PAGES_BRANCH" = "master" ] || [ "$CF_PAGES_BRANCH" = "dev" ]; then
#   yarn global add @sentry/cli
#   sentry-cli releases new $CF_PAGES_COMMIT_SHA
#   sentry-cli releases set-commits $CF_PAGES_COMMIT_SHA --commit "PoiScript/HoloStats@$CF_PAGES_COMMIT_SHA"
#   sentry-cli releases deploys $CF_PAGES_COMMIT_SHA new -e $CF_PAGES_BRANCH
#   sentry-cli releases finalize $CF_PAGES_COMMIT_SHA
# fi
