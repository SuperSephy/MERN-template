"use strict";

/**
 * App Initialization
 */
const express = require("express");
const glob = require("glob").sync;
const bodyParser = require("body-parser");
const config = require("./config").server;
const passport = require("passport");
const app = express();

/**
 * Middleware
 */
app.use(passport.initialize());
require("./auth/passport")(passport); // Authentication

app.use(bodyParser.urlencoded({ extended: false })); // req.body URL Encoded
app.use(bodyParser.json()); // req.body JSON
require("./lib/databaseConnections"); // Database Connections

/**
 * Load Routes
 */
app.get("/", (req, res) => res.send("Hello World"));

var apis = glob("**/*.js", { cwd: "_server" });
apis.forEach(api => {
  console.log("\nLoading", api.replace(/.js$/, ""));
  app.use("/" + api.replace(/.js$/, ""), require(`./_server/${api}`)(passport));
});

/**
 * Listen on provided port, on all network interfaces.
 */
const port = process.env.PORT || config.port;
app.listen(process.env.PORT || config.port, () => {
  console.log(`\nServer running on port ${port} - http://localhost:5000`);
});

// If the Node process ends, close the Mongoose connection
process.once("SIGINT", function() {
  console.log(
    `App terminated - closing in 3 seconds to allow graceful DB disconnects`
  );
  setTimeout(process.exit, 3000, 0);
});
