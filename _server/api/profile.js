"use strict";

// NOTE: Global functions at bottom of file:
// - formatProfile(req)

const config = require("../../config").server;
const express = require("express");
const router = express.Router();

// Libs
const _ = require("underscore");

// Load input Validation
const validateProfileInput = require("../validation/profile");
const validateExperienceInput = require("../validation/profile/experience");
const validateEducationInput = require("../validation/profile/education");

// Global Veriables
const port = process.env.PORT || config.port;

//Database & User model
let User;
let Profile;
let ObjectId;
require("../dbs/databaseConnections").then(dbs => {
  User = dbs.mongo.model("User");
  Profile = dbs.mongo.model("Profile");
  ObjectId = dbs.mongo.Types.ObjectId;
});

// Start up info
console.log("-- PROFILE --");
console.log(`  http://localhost:${port}/api/posts/ping`);

module.exports = function(passport) {
  /**
   * @route   GET /api/auth/ping
   * @desc    Test posts route
   * @access  Public
   */
  router.all("/ping", (req, res) => res.send("pong"));

  /**
   * @route   /api/profile
   * @access  Private
   */
  router
    .route("/")

    .all((req, res, next) => {
      console.log(`/api/profile hit with method ${req.method}`);
      next();
    })

    // Create Profile
    .put(
      passport.authenticate("jwt", {
        session: false
      }),
      (req, res) => {
        const { errors, isValid } = validateProfileInput(req.body);

        // Check Validation
        if (!isValid) return res.status(400).json(errors);

        let profileFields = formatProfile(req);

        Profile.findOne({
          user: req.user.id
        }).then(currentProfile => {
          // Create
          Profile.findOne({
            handle: profileFields.handle
          }).then(handleCheckProfile => {
            // If profile with that handle already exists AND belongs to the current user => Update
            if (
              handleCheckProfile &&
              currentProfile &&
              handleCheckProfile.user.equals(currentProfile.user)
            ) {
              return Profile.findOneAndUpdate(
                {
                  user: req.user.id
                },
                {
                  $set: profileFields
                },
                {
                  new: true
                }
              ).then(updated_profile => res.json(updated_profile));
            }

            // If profile with that handle already exists => return error
            if (handleCheckProfile) {
              errors.handle = "That handle already belongs to another user";
              return res.status(400).json(errors);
            }

            //Save
            new Profile(profileFields).save().then(profile => res.json(profile));
          });
        });
      }
    )

    // ???
    .post(
      passport.authenticate("jwt", {
        session: false
      }),
      (req, res) => {
        let profileFields = formatProfile(req);
        res.json({
          status: "ok"
        });
      }
    )

    // Update
    .patch(
      passport.authenticate("jwt", {
        session: false
      }),
      (req, res) => {
        res.json({
          status: "ok"
        });
      }
    )

    // Retrieve
    .get(
      passport.authenticate("jwt", {
        session: false
      }),
      (req, res) => {
        let errors = {};

        Profile.findOne({
          user: req.user.id
        })
          .populate("user", ["name", "avatar"]) // Get referenced data
          .then(profile => {
            if (!profile) {
              errors.noprofile = "There is no profile for this user";
              return res.status(404).json(errors);
            }
            res.json(profile);
          })
          .catch(err => {
            res.status(404).json(err);
          });
      }
    )

    // Delete user AND profile
    .delete(
      passport.authenticate("jwt", {
        session: false
      }),
      (req, res) => {
        Profile.findOneAndRemove({
          user: req.user.id
        }).then(() => {
          User.findOneAndRemove({
            _id: req.user.id
          }).then(() => {
            res.json({
              success: true
            });
          });
        });
      }
    );

  /**
   * @route   GET /api/profile/all
   * @desc    Get all profiles
   * @access  Public
   */
  router.get("/all", (req, res) => {
    const errors = {};

    Profile.find()
      .populate("user", ["name", "avatar"])
      .then(profiles => {
        if (!profiles) {
          errors.noprofile = "There are no profiles";
          return res.status(404).json(errors);
        }
        res.json(profiles);
      })
      .catch(error => {
        console.error(`/api/profile/all error`, error.message);
        return res.status(404).json({
          noprofile: "There are no profiles"
        });
      });
  });

  /**
   * @route   GET /api/profile/handle/:handle
   * @desc    Get profile by handle
   * @access  Public
   */

  router.get("/handle/:handle", (req, res) => {
    Profile.findOne({
      handle: req.params.handle
    })
      .populate("user", ["name", "avatar"]) // Get referenced data
      .then(profile => {
        const errors = {};

        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        }

        res.json(profile);
      })
      .catch(error => {
        console.error(`/api/profile/handle/${req.params.handle} error`, error.message);
        return res.status(404).json({
          noprofile: "Invalid user handle passed"
        });
      });
  });

  /**
   * @route   GET /api/profile/user/:user_id
   * @desc    Get profile by user id
   * @access  Public
   */

  router.get("/user/:user_id", (req, res) => {
    Profile.findById(req.params.user_id)
      .populate("user", ["name", "avatar"]) // Get referenced data
      .then(profile => {
        const errors = {};

        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        }

        res.json(profile);
      })
      .catch(error => {
        console.error(`/api/profile/user/${req.params.user_id} error`, error.message);
        return res.status(404).json({
          noprofile: "Invalid user id passed"
        });
      });
  });

  /**
   * @route   PUT /api/profile/experience
   * @desc    Add experience to profile
   * @access  Private
   */
  router.put(
    "/experience",
    passport.authenticate("jwt", {
      session: false
    }),
    addExperience
  );
  router.post(
    "/experience",
    passport.authenticate("jwt", {
      session: false
    }),
    addExperience
  );

  function addExperience(req, res) {
    const { errors, isValid } = validateExperienceInput(req.body);

    // Check Validation
    if (!isValid) return res.status(400).json(errors);

    Profile.findOne({
      user: req.user.id
    }).then(profile => {
      // Add to experience array
      // req.body keys = title, company, location, from, to, current, description
      profile.experience.unshift(
        _.pick(req.body, "title", "company", "from", "to", "current", "description")
      );
      profile.save().then(profile => res.json(profile));
    });
  }

  /**
   * @route   DELETE /api/profile/experience/:exp_id
   * @desc    Remove education entry from profile
   * @access  Private
   */
  router.delete(
    "/experience/:exp_id",
    passport.authenticate("jwt", {
      session: false
    }),
    (req, res) => {
      const errors = {};

      Profile.findOne({
        user: req.user.id
      })
        .then(profile => {
          let matchingExperience = !_.find(profile.experience, experience => {
            return experience._id.equals(ObjectId(req.params.exp_id));
          });

          if (matchingExperience) {
            errors.experience = "No matching experience entry found";
            return res.status(404).json(errors);
          }

          // Remove element from array
          profile.experience.pull({
            _id: req.params.exp_id
          });
          profile.save().then(profile => res.json(profile));
        })
        .catch(error => {
          console.error(`/api/profile/experience/${req.params.exp_id} error`, error);
          res.status(404).json({
            education: "No matching experience entry found"
          });
        });
    }
  );

  /**
   * @route   PUT /api/profile/education
   * @desc    Add education to profile
   * @access  Private
   */
  router.put(
    "/education",
    passport.authenticate("jwt", {
      session: false
    }),
    addEducation
  );
  router.post(
    "/education",
    passport.authenticate("jwt", {
      session: false
    }),
    addEducation
  );

  function addEducation(req, res) {
    const { errors, isValid } = validateEducationInput(req.body);

    // Check Validation
    if (!isValid) return res.status(400).json(errors);

    Profile.findOne({
      user: req.user.id
    }).then(profile => {
      // Add to experience array
      // req.body keys = title, company, location, from, to, current, description
      profile.education.unshift(
        _.pick(
          req.body,
          "school",
          "degree",
          "fieldOfStudy",
          "from",
          "to",
          "current",
          "description"
        )
      );
      profile.save().then(profile => res.json(profile));
    });
  }

  /**
   * @route   DELETE /api/profile/experience/:exp_id
   * @desc    Remove education entry from profile
   * @access  Private
   */
  router.delete(
    "/education/:edu_id",
    passport.authenticate("jwt", {
      session: false
    }),
    (req, res) => {
      const errors = {};

      Profile.findOne({
        user: req.user.id
      })
        .then(profile => {
          let matchingEducation = !_.find(profile.education, education => {
            return education._id.equals(ObjectId(req.params.edu_id));
          });

          if (matchingEducation) {
            errors.education = "No matching education entry found";
            return res.status(404).json(errors);
          }

          // Remove element from array
          profile.education.pull({
            _id: req.params.edu_id
          });
          profile.save().then(profile => res.json(profile));
        })
        .catch(error => {
          console.error(`/api/profile/education/${req.params.edu_id} error`, error);
          res.status(404).json({
            education: "No matching education entry found"
          });
        });
    }
  );

  return router;
};

// ==================================
// Global Functions =================
// ==================================

/**
 * Takes an Express Request object then formats and returns the profile
 *
 * @param   {object}  req   ExpressJS Request Object: { body: { key: "value" } }
 * @returns {object}        Returns a properly formatted Profile Object
 */
function formatProfile(req) {
  const profileFields = {};

  // Defaults
  profileFields.user = req.user.id;
  profileFields.social = {};

  // Get Fields From Request Body
  _.extend(profileFields, req.body);

  // Format Social Fields appropriately
  const socialFields = ["facebook", "instagram", "linkedIn", "twitter", "youtube"];
  socialFields.forEach(type => {
    if (profileFields[type]) {
      profileFields.social[type] = profileFields[type]; // Nest appropriately
      delete profileFields[type]; // Remove from root level
    }
  });

  // Split skills from CSV to Array
  if (typeof profileFields.skills === "string")
    profileFields.skills = profileFields.skills.split(",");

  return profileFields;
}
