"use strict";

const config = require(`../config`).server;
const _ = require("underscore");

// load up the user model
let User;
require("../lib/databaseConnections").then(dbs => {
  User = dbs.mongo.model("Users");
});

// expose this function to our app using module.exports
module.exports = function(passport) {
  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and un-serialize users out of session

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, done);
  });

  // check if user is logged in - if not redirect to login page
  passport.isLoggedIn = function(req, res, next) {
    console.log(`User authenticated: ${req.isAuthenticated()}`);

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
      if (req.cookies.cdp) {
        console.log(`Redirecting to desiredPage ${req.cookies.cdp}`);
        res.clearCookie("cdp"); // Delete Cookie
        return res.redirect(req.cookies.cdp); // Redirect to intended page
      }
      return next();
    }

    // if they aren't save intended page then redirect them to the home page
    res.cookie("cdp", req.originalUrl, { maxAge: 3600000 }); // Set Cookie
    res.redirect("/");
  };

  require("./jwtStrategy")(passport);
  // =========================================================================
  // LOCAL SIGN UP ===========================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  //   passport.use("local-signUp", localStrategy["local-signUp"]);

  // =========================================================================
  // LOCAL LOGIN =============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signUp
  // by default, if there was no name, it would just be called 'local'

  //   passport.use("local-login", localStrategy["local-login"]);

  // =========================================================================
  // FACEBOOK SIGN UP / LOGIN ================================================
  // =========================================================================
  //   passport.use(require("./facebookStrategy"));

  // =========================================================================
  // GOOGLE SIGN UP / LOGIN ==================================================
  // =========================================================================
  //   passport.use(require("./googleStrategy"));
};
