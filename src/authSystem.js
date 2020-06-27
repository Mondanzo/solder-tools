const express = require("express");
const path = require("path");
const crypto = require("crypto");
const databaser = require("./databaseInteraction");
let router = express.Router();

router.use(
  express.urlencoded({
    extended: false,
  })
);

router.post("/login", async (req, res) => {
  console.log(req.body["st-username"]);
  if (req.body["st-username"] && req.body["st-password"]) {
    let conn = await databaser.getConnection();
    let result = await conn.query(
      "SELECT password FROM solder_tools WHERE uname = ?",
      [req.body["st-username"]]
    );
    console.log(result);
    if (
      result.length &&
      verifyPassword(req.body["st-password"], result[0].password)
    ) {
      req.session.authenticated = true;
      res.redirect("/");
    }
  } else {
    res.sendStatus(401);
  }
  conn.end();
});

router.use((req, res, next) => {
  if (req.session.authenticated) {
    next();
  } else {
    res.sendFile(path.resolve(__dirname, "./views/login.html"));
  }
});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function getRandomSalt() {
  return crypto.randomBytes(4).toString("hex");
}

function hashPassword(password) {
  let salt = getRandomSalt();
  let iters = getRandomInt(6, 10);
  return (
    salt +
    iters +
    crypto.pbkdf2Sync(password, salt, iters, 64, "sha512").toString("hex")
  );
}

function verifyPassword(password, hash) {
  let salt = hash.substr(0, 8);
  let iters = hash.substr(8, 1) - 0;
  let ahash = hash.substr(9);
  return (
    ahash ===
    crypto.pbkdf2Sync(password, salt, iters, 64, "sha512").toString("hex")
  );
}

module.exports.getRandomInt = getRandomInt;
module.exports.getRandomSalt = getRandomSalt;
module.exports.hashPassword = hashPassword;
module.exports.verifyPassword = verifyPassword;

module.exports.middleware = router;
