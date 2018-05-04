"use strict";

const config = require("../../config").server;
const express = require("express");
const router = express.Router();

// Libs
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const _ = require("underscore");

//Database
let User;
require("../../lib/databaseConnections").then(dbs => {
  User = dbs.mongo.model("Users");
});

// Global Veriables
const port = process.env.PORT || config.port;

// Start up info
console.log("-- AUTH --");
console.log(`  http://localhost:${port}/api/auth/ping`);

module.exports = function(passport) {
  /**
   * @route   GET /api/auth/ping
   * @desc    Test auth route
   * @access  Public
   */
  router.all("/ping", (req, res) => res.send("pong"));

  /**
   * @route   GET /api/auth/user
   * @desc    Test auth route
   * @access  Public
   */
  router
    .route("/user")

    .all((req, res, next) => {
      console.log(`/api/auth/user hit with method ${req.method}`);
      next();
    })

    // Create
    .put((req, res) => {
      const required = ["email", "name", "password"];
      let missing = _.difference(required, _.keys(req.body));

      if (missing.length)
        return res.status(500).json({
          status: "err",
          err: `Missing required value: ${missing.join(", ")}`
        });

      console.log(`Looking for user with email ${req.body.email}`);

      User.findOne({ email: req.body.email })
        .then(user => {
          if (user)
            return res
              .status(400)
              .json({ status: "err", err: "email already exists" });

          console.log("Checking for Gravatar");
          req.body.avatar = gravatar.url(req.body.email, {
            s: "200", // Size
            r: "pg", // Rating
            d: "mm" // Default
          });
          const newUser = new User(req.body);
          console.log("new user", newUser);

          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => res.status(500).json({ status: "err", err }));
        })
        .catch(err => {
          console.log("User look up error", err);
          res.status(500).json({ status: "err", err });
        });
    })

    // Read
    .post((req, res) => {
      const email = req.body.email;
      const password = req.body.password;

      if (!email)
        return res.status(400).json({ status: "err", err: "Missing email" });
      if (!password)
        return res.status(400).json({ status: "err", err: "Missing password" });

      User.findOne({ email })
        .then(user => {
          if (_.isEmpty(user))
            return res
              .status(404)
              .json({ status: "err", err: "User not found" });
          if (!user.validPassword(password))
            return res
              .status(400)
              .json({ status: "err", err: "Invalid password" });

          // User Matched - Sign Token
          const token = _.pick(user, "id", "name", "avatar");

          jwt.sign(
            token,
            config.secret,
            { expiresIn: 60 * 60 * 24 },
            (err, token) => {
              res.json({ status: "ok", token: `Bearer ${token}` });
            }
          );
        })
        .catch(err => {
          res.status(404).json({ status: "err", err: "User not found" });
        });
    })

    // Update
    .patch((req, res) => {
      res.json({ status: "ok" });
    })

    // Get current
    // @access
    .get(passport.authenticate("jwt", { session: false }), (req, res) => {
      res.json({ status: "ok", user: req.user });
    })

    // Delete
    .delete((req, res) => {
      res.json({ status: "ok" });
    });

  return router;
};
