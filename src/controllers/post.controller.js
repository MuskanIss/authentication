const express = require("express");

const Post = require("../models/post.model");
const authMiddleware = require("../Middleware/auth.middleware");

const router = express.Router();

router.post("", authMiddleware, async (req, res) => {
  try {
    req.body.user_id = req.user._id;
    const post = await Post.create(req.body);
    return res.send(post);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

router.get("", authMiddleware, async (req, res) => {
  try {
    console.log(req.user);
    const posts = await Post.find();

    return res.send(posts);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

module.exports = router;
