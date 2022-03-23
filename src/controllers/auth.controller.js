const express = require("express");
const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { body, validationResult } = require("express-validator");

const Token = (user) => {
  console.log("sec", process.env.SECRET_KEY);
  return jwt.sign({ user }, process.env.SECRET_KEY);
};
const router = express.Router();

router.post(
  "/signup",
  body("email").isEmail().withMessage("not valid Email "),
  body("password").isLength({ min: 8 }).withMessage("password 8 charaters"),
  body("name").isLength({ min: 3 }).withMessage("name at least 3 characters"),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      var userAvail = await User.findOne({ email: req.body.email });
      if (userAvail) {
        return res.status(400).json("User already exists");
      }
      const user = await User.create(req.body);
      const tok = Token(user);
      return res.status(200).json({ tok });
    } catch (err) {
      return res.status(500).json({ status: "failed", message: err.message });
    }
  }
);

router.post(
  "/signIn",
  body("email").isEmail(),
  body("password").isLength({ min: 5 }),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const users = await User.findOne({ email: req.body.email });
      if (!users) {
        return res.status(400).json("User does not exists");
      }
      const k = users.comPass(req.body.password);
      if (!k) {
        return res.status(400).json("Wrong Password");
      }
      const tok = Token(users);
      return res.status(200).json({ tok });
    } catch (err) {
      return res.status(500).json({ status: "failed", message: err.message });
    }
  }
);
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    return res.status(200).json({ data: user });
  } catch (err) {
    return res.status(500).json({ status: "failed", message: err.message });
  }
});

module.exports = router;
