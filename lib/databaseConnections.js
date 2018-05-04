"use strict";

const env = process.env.NODE_ENV || "local";
const config = require("../config").databases;
const glob = require("glob").sync;
const _ = require("underscore");

module.exports = require("@impact-marketing-specialists/ims-db-connections")({
  mongo: config.mongo[env]
}).then(
  dbs => {
    console.log("Database connections successful: " + Object.keys(dbs).sort());

    // Models
    const models = glob("**/*.js", { cwd: "./models" });
    console.log(`  Found ${models.length} Models`, models);

    models.forEach(model => {
      require(`../models/${model}`)(dbs.mongo);
    });

    console.log("  Available Mongo Models: " + _.keys(dbs.mongo.models));
    return dbs;
  },
  err => {
    console.error(err);
    setTimeout(process.exit, 2000, 1);
  }
);
