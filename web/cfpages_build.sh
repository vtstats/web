set -e

export PATH="$PATH:$(yarn global bin)"

node -e "const fs = require('fs');
const path = 'src/index.html';
const html = fs.readFileSync(path, 'utf-8')
  .replace('CF_PAGES_BRANCH',     '$CF_PAGES_BRANCH')
  .replace('CF_PAGES_COMMIT_SHA', '$CF_PAGES_COMMIT_SHA');
fs.writeFileSync(path, html);"

yarn build --configuration production

mv dist/safety-worker.js dist/ngsw-worker.js

yarn global add @sentry/cli
sentry-cli releases new $CF_PAGES_COMMIT_SHA
sentry-cli releases set-commits $CF_PAGES_COMMIT_SHA --commit "PoiScript/HoloStats@$CF_PAGES_COMMIT_SHA"
sentry-cli releases deploys $CF_PAGES_COMMIT_SHA new -e $CF_PAGES_BRANCH
sentry-cli releases finalize $CF_PAGES_COMMIT_SHA
