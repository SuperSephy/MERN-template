"use strict";

const env = process.env.NODE_ENV || "local",
  config = require("../config/databases");

module.exports = require("@impact-marketing-specialists/ims-db-connections")({
  mongo: config.mongo[env]
}).then(
  dbs => {
    console.log("Database connections successful: " + Object.keys(dbs).sort());
    // console.log('Available MySQL Models: '+dbs.mysql.models);
    return dbs;
  },
  err => {
    console.error(err);
    setTimeout(process.exit, 2000, 1);
  }
);
