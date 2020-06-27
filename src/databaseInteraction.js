const express = require("express");
const path = require("path");
const mariadb = require("mariadb");
const asc = require("express-async-handler");
const auther = require("./authSystem");
const { body, validationResult } = require("express-validator");
let router = express.Router();

function getConnection() {
  let conn = mariadb.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
  });
  conn.catch((err) => {
    console.log(
      "Error while connecting to the database! Quitting software.",
      err
    );
    process.exit(1);
  });
  return conn;
}

module.exports.getConnection = getConnection;

module.exports.migrateDB = function() {
  console.log(
    "Migrating database, this might take a while unless it's already migrated."
  );
  getConnection().then(async (conn) => {
    await conn.query(
      "ALTER TABLE mods ADD COLUMN IF NOT EXISTS side ENUM('CLIENT', 'SERVER')"
    );
    await conn.query(
      "ALTER TABLE mods ADD COLUMN IF NOT EXISTS curse INT UNSIGNED"
    );
    await conn.query(
      "CREATE TABLE IF NOT EXISTS \
		solder_tools (\
			uid INT UNSIGNED NOT NULL AUTO_INCREMENT, \
			uname VARCHAR(30) NOT NULL, \
			password VARCHAR(137) NOT NULL, \
			admin TINYINT(1) NOT NULL DEFAULT 0, \
			PRIMARY KEY (uid))"
    );
    if (
      (await conn.query("SELECT uid FROM solder_tools WHERE admin = 1 LIMIT 1"))
        .length === 0
    ) {
      await conn.query(
        "INSERT INTO solder_tools (uname, password, admin) VALUES ('admin', ?, 1)",
        [auther.hashPassword("admin")]
      );
    }
    await conn.end();
    console.log("Database migration done.");
  });
};

router.get(
  "/mod/curse",
  asc(async (req, res) => {
    let conn = await getConnection();
    let results = await conn.query(
      "SELECT * FROM mods WHERE curse IS NOT NULL"
    );
    res.status(200).json(results);
    conn.end();
  })
);

router.post(
  "/mod/add",
  [
    body("key").exists(),
    body("name").exists(),
    body("author").exists(),
    body("desc").exists(),
    body("website")
      .exists()
      .isURL(),
  ],
  asc(async (req, res) => {
    if (!validationResult(req).isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let conn = await getConnection();
    let result = await conn.query(
      "INSERT INTO mods (name, description, author, link, created_at, updated_at, pretty_name, side, curse) VALUES (?, ?, ?, ?, NOW(), NOW(), ?, ?, ?)",
      [
        req.body.key,
        req.body.desc,
        req.body.author,
        req.body.website,
        req.body.name,
        req.body.side || null,
        req.body.curse || null,
      ]
    );
    if (result.affectedRows > 0) res.sendStatus(201);
    else res.sendStatus(500);
    conn.end();
  })
);

module.exports.middleware = router;
