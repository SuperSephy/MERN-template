"use strict";

const env = process.env.NODE_ENV || "local";
const config = require("../../config").server;
const express = require("express");
const router = express.Router();

// Libs
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const _ = require("underscore");

// Load input Validation
const validateRegisterInput = require("../../validation/auth/register");
const validateLoginInput = require("../../validation/auth/login");

//Database & User model
let User;
require("../../lib/databaseConnections").then(dbs => {
  User = dbs.mongo.model("User");
});

// Global Variables
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
      const { errors, isValid } = validateRegisterInput(req.body);

      // Check Validation
      if (!isValid) return res.status(400).json(errors);

      User.findOne({ email: req.body.email })
        .then(user => {
          if (user) {
            errors.email = "Email already exists";
            return res.status(400).json(errors);
          }

          req.body.avatar = gravatar.url(req.body.email, {
            s: "200", // Size
            r: "pg", // Rating
            d: "mm" // Default
          });
          const newUser = new User(_.pick(req.body, "name", "email", "password", "avatar"));

          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => res.status(500).json(err));
        })
        .catch(err => {
          console.log("User look up error", err);
          res.status(500).json(err);
        });
    })

    // Read
    .post((req, res) => {
      const { errors, isValid } = validateLoginInput(req.body);

      // Check Validation
      if (!isValid) {
        return res.status(400).json(errors);
      }

      User.findOne({
        email: req.body.email
      })
        .then(user => {
          if (_.isEmpty(user)) {
            errors.email = "User not found";
            return res.status(404).json(errors);
          }

          if (!user.validPassword(req.body.password)) {
            errors.password = "Invalid password";
            return res.status(400).json(errors);
          }

          // User Matched - Sign Token
          const token = _.pick(user, "id", "name", "avatar");

          jwt.sign(
            token,
            config.secret,
            {
              expiresIn: "1d"
            },
            (err, token) => {
              if (err || !token) {
                errors.user = err;
                return res.status(500).json(errors || "Unable to create auth token");
              }

              res.json({
                status: "ok",
                token: `Bearer ${token}`
              });
            }
          );
        })
        .catch(err => {
          errors.email = "User not found";
          res.status(404).json(errors);
        });
    })

    // Update
    .patch((req, res) => {
      res.json({
        status: "ok"
      });
    })

    /**
     * @route   GET /api/auth/user
     * @access  Private
     */
    .get(
      passport.authenticate("jwt", {
        session: false
      }),
      (req, res) => {
        res.json({
          status: "ok",
          user: _.omit(req.user.toObject(), "password")
        });
      }
    )

    // Delete
    .delete((req, res) => {
      res.json({
        status: "ok"
      });
    });

  return router;
};
