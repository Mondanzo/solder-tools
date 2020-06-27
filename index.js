require("dotenv").config();
const process = require("process");
const express = require("express");
const path = require("path");
const curseforge = require("mc-curseforge-api");
const cookieSession = require("cookie-session");
const errorHandler = require("errorhandler");
const database = require("./src/databaseInteraction");

let app = express();

app.use(
  cookieSession({
    name: "solder-tools-session",
    secret: process.env.SECRET,
  })
);

database.migrateDB();

app.use(require("./src/authSystem").middleware);
app.use(express.json());
app.use(database.middleware);

app.get("/curseforge", async (req, res) => {
  if (req.query.hasOwnProperty("term") || req.query.hasOwnProperty("version")) {
    let opts = {};
    if (req.query.term) opts.searchFilter = req.query.term;
    if (req.query.version) opts.gameVersion = req.query.version;
    if (req.query.limit) opts.pageSize = req.query.limit - 0 + 1;
    if (req.query.page) opts.index = req.query.page;
    let mods = await curseforge.getMods(opts);
    res.status(200).json(mods);
  } else {
    res.status(400).send();
  }
});

if (process.env.NODE_ENV === "development") {
  const Bundler = require("parcel-bundler");
  app.use(new Bundler("./public/index.html").middleware());
} else {
  app.use("/", express.static(path.resolve(__dirname, "dist")));
}

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

if (process.env.NODE_ENV === "development") app.use(errorHandler());

app.listen(process.env.port, () => {
  console.log("listening on port " + process.env.PORT);
});
