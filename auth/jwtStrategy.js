const config = require(`../config`).server;
const _ = require("underscore");

// load all the things we need
const jwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

// load up the user model
let User;
require("../lib/databaseConnections").then(dbs => {
  User = dbs.mongo.model("Users");
});

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secret;

module.exports = passport => {
  passport.use(
    new jwtStrategy(opts, (jwt_token, done) => {
      User.findById(jwt_token.id)
        .then(user => {
          if (!user) return done("No user found.");
          done(null, user);
        })
        .catch(done);
    })
  );
};
