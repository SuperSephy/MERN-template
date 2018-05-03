"use strict";

/**
 * App Initialization
 */
const express = require("express");
const glob = require("glob").sync;
const config = require("./config/server");
const bodyParser = require("body-parser");
const app = express();

/**
 * Middleware
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
require("./lib/databaseConnections");

/**
 * Load Routes
 */
app.get("/", (req, res) => res.send("Hello World"));

var apis = glob("**/*.js", { cwd: "_server" });
apis.forEach(api => {
  console.log("\nLoading", api.replace(/.js$/, ""));
  app.use("/" + api.replace(/.js$/, ""), require(`./_server/${api}`));
});

/**
 * Listen on provided port, on all network interfaces.
 */
const port = process.env.PORT || config.port;
app.listen(process.env.PORT || config.port, () => {
  console.log(`\nServer running on port ${port} - http://localhost:5000`);
});
