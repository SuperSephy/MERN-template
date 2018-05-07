"use strict";

const config = require("../../config").server;
const express = require("express");
const router = express.Router();

// Global Veriables
const port = process.env.PORT || config.port;

//Database & User model
let User;
let Profile;
require("../../lib/databaseConnections").then(dbs => {
  User = dbs.mongo.model("User");
  Profile = dbs.mongo.model("Profile");
});

// Start up info
console.log("-- AUTH --");
console.log(`  http://localhost:${port}/api/posts/ping`);

module.exports = function(passport) {
  /**
   * @route   GET /api/auth/ping
   * @desc    Test posts route
   * @access  Public
   */
  router.all("/ping", (req, res) => res.send("pong"));

  router
    .route("/")

    .all((req, res, next) => {
      console.log(`/api/posts hit with method ${req.method}`);
      next();
    });

  return router;
};
