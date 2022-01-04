export PATH="$PATH:$(yarn global bin)"

echo "export const environment = {
  production: true,
  commit_sha: '$CF_PAGES_COMMIT_SHA',
  branch: '$CF_PAGES_BRANCH',
  yt_client_id:
    '458340445465-acoedftrhhqtj80phmelq8pfco00laba.apps.googleusercontent.com',
};" > src/environments/environment.prod.ts

yarn build --configuration production

yarn global add @sentry/cli
sentry-cli releases new $CF_PAGES_COMMIT_SHA
sentry-cli releases set-commits $CF_PAGES_COMMIT_SHA --commit "PoiScript/HoloStats@$CF_PAGES_COMMIT_SHA"
sentry-cli releases deploys $CF_PAGES_COMMIT_SHA new -e $CF_PAGES_BRANCH
sentry-cli releases finalize $CF_PAGES_COMMIT_SHA
