"use strict";

const config = require("../../config").server;
const express = require("express");
const router = express.Router();

// Libs
const _ = require("underscore");

// Load input Validation
const validatePostInput = require("../../validation/post");

// Global Variables
const port = process.env.PORT || config.port;

//Database & User model
let User;
let Post;
let Profile;
require("../../lib/databaseConnections").then(dbs => {
  User = dbs.mongo.model("User");
  Post = dbs.mongo.model("Post");
  Profile = dbs.mongo.model("Profile");
});

// Start up info
console.log("-- POST --");
console.log(`  http://localhost:${port}/api/posts/ping`);

module.exports = function(passport) {
  /**
   * @route   GET /api/auth/ping
   * @desc    Test posts route
   * @access  Public
   */
  router.all("/ping", (req, res) => res.send("pong"));

  /**
   * @route   /api/posts
   * @access  Private
   */
  router
    .route("/")

    .all((req, res, next) => {
      console.log(`/api/posts hit with method ${req.method}`);
      next();
    })

    // Create new post
    .put(passport.authenticate("jwt", { session: false }), (req, res) => {
      const { errors, isValid } = validatePostInput(req.body);

      // Check Validation
      if (!isValid) return res.status(400).json(errors);

      const newPost = new Post(_.pick(req.body, "text", "name", "avatar", "user"));
      newPost.user = req.user.id;
      newPost.name = newPost.name || req.user.name;
      newPost.avatar = newPost.avatar || req.user.avatar;

      newPost.save().then(post => res.json(post));
    })

    // Read ALL posts
    .get((req, res) => {
      Post.find()
        .sort({ createdAt: -1 })
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json({ posts: "No posts found" }));
    });

  /**
   * @route   /api/posts/:post_id
   * @access  Private
   */
  router
    .route("/:post_id")

    .all((req, res, next) => {
      console.log(`/api/posts/${req.params.post_id} hit with method ${req.method}`);
      next();
    })

    // Get single post
    .get((req, res) => {
      console.log("Checing for post with id: ", req.params.post_id);

      Post.findById(req.params.post_id)
        .then(post => res.json(post))
        .catch(err => res.json({ post: "No post found" }));
    })

    // Delete Post
    .delete(passport.authenticate("jwt", { session: false }), (req, res) => {
      Profile.findOne({ user: req.user.id })
        .then(profile => {
          Post.findById(req.params.post_id)
            .then(post => {
              // Check for post owner
              if (post.user.toString() !== req.user.id)
                return post.remove().then(() => res.json({ success: true }));

              return res.status(401).send("Unauthorized");
            })
            .catch(err => res.status(404).json({ post: "No post found" }));
        })
        .catch(err => res.status(404).json({ profile: "No profile found with that id" }));
    });

  /**
   * @route   /api/posts/like/:post_id
   * @access  Private
   */
  router
    .route("/like/:post_id")

    .all((req, res, next) => {
      console.log(`/api/posts/like/${req.params.post_id} hit with method ${req.method}`);
      next();
    })

    // Add like to a post
    .post(passport.authenticate("jwt", { session: false }), (req, res) => {
      manageLikes(req, res, "like");
    })

    // Remove like from post
    .delete(passport.authenticate("jwt", { session: false }), (req, res) => {
      manageLikes(req, res, "unlike");
    });

  /**
   * @route   /api/posts/comment/:post_id
   * @access  Private
   */
  router.post(
    "/comment/:post_id/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { errors, isValid } = validatePostInput(req.body);

      // Check Validation
      if (!isValid) return res.status(400).json(errors);

      Post.findById(req.params.post_id)
        .then(post => {
          const newComment = _.pick(req.body, "text", "name", "avatar");
          newComment.user = req.user.id;

          // Add to comments array
          post.comments.unshift(newComment);
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ post: "No post found" }));
    }
  );

  /**
   * @route   /api/posts/comment/:post_id/:comment_id
   * @access  Private
   */
  router.delete(
    "/comment/:post_id/:comment_id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      console.log("Post id", req.params.post_id);
      console.log("Comment id", req.params.comment_id);

      Post.findById(req.params.post_id)
        .then(post => {
          const foundComment = _.find(post.comments, comment => {
            return comment._id.toString() === req.params.comment_id;
          });

          // Ensure comment exists
          if (!foundComment) return res.status(404).json({ comment: "Comment not found" });

          post.comments.pull({ _id: req.params.comment_id });
          post.save().then(post => res.json(post));
        })
        .catch(err => {
          console.log(err);
          res.status(404).json({ post: "No post found" });
        });
    }
  );

  return router;
};

// ==============================================
// Support Functions ============================
// ==============================================

/**
 * Like or unlike a post
 * @param {object}  req   Express Request Object
 * @param {object}  res   Express Response Object
 * @param {string}  type  "like" || "unlike"
 */
function manageLikes(req, res, type) {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.post_id)
        .then(post => {
          let userAlreadyLiked = post.likes.filter(
            like => like.user.toString() === req.user.id
          ).length;

          // Check if user already liked
          switch (type) {
            case "like":
              if (userAlreadyLiked)
                return res.status(400).json({ like: "You already liked this post" });

              post.likes.unshift({ user: req.user.id });
              return post.save().then(post => res.json(post));

            case "unlike":
              if (!userAlreadyLiked)
                return res.status(400).json({ like: "You have not liked this post" });

              post.likes.pull({ user: req.user.id });
              return post.save().then(post => res.json(post));

            default:
              return res.status(500).send("Unknown Like method called");
          }
        })
        .catch(err => res.status(404).json({ post: "No post found with that id" }));
    })
    .catch(err => res.status(404).json({ profile: "No profile found for this user" }));
}
