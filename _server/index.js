"use strict";

/**
 * App Initialization
 */
const express = require("express");
const glob = require("glob").sync;
const bodyParser = require("body-parser");
const config = require("../config").server;
const passport = require("passport");
const app = express();

/**
 * Middleware
 */
app.use(passport.initialize());
require("./auth/passport")(passport); // Authentication

app.use(bodyParser.urlencoded({ extended: false })); // req.body URL Encoded
app.use(bodyParser.json()); // req.body JSON
require("./dbs/databaseConnections"); // Database Connections

/**
 * Load Routes
 */
app.get("/", (req, res) => res.send("Hello World"));

var apis = glob("**/*.js", { cwd: "_server/api" });
apis.forEach(api => {
  console.log("\nLoading", api.replace(/.js$/, ""));
  app.use("/api/" + api.replace(/.js$/, ""), require(`./api/${api}`)(passport));
});

/**
 * Listen on provided port, on all network interfaces.
 */
const port = process.env.PORT || config.port;
app.listen(process.env.PORT || config.port, () => {
  console.log(`\nServer running on port ${port} - http://localhost:5000`);
});

// If the Node process ends, close the Mongoose connection
process.once("SIGINT", graceful_shutdown);
process.once("SIGUSR2", graceful_shutdown);
process.once("SIGTERM", graceful_shutdown);

function graceful_shutdown(sig) {
  console.log(`App terminated by ${sig}`);
  // process.exit(0);
}
