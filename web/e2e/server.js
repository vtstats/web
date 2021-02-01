const express = require("express");
const { resolve } = require("path");

const app = express();

app.use(express.static(resolve(__dirname, "../dist")));

app.use((_, res) => {
  res.sendFile(resolve(__dirname, "../dist", "index.html"));
});

app.listen(4200);
