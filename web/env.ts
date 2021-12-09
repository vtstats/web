const fs = require("fs");
const path = require("path");

const filePath = path.resolve(
  __dirname,
  "src/environments/environment.prod.ts"
);

fs.writeFileSync(
  filePath,
  fs
    .readFileSync(filePath, "utf-8")
    .replace("__COMMIT_SHA__", process.env.CF_PAGES_COMMIT_SHA)
    .replace("__BRANCH__", process.env.CF_PAGES_BRANCH)
);
