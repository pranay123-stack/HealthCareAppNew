const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const User = require("../models/UserSchema");

router.post("/register", async (req, res) => {
  if (
    !req.body.firstname ||
    !req.body.lastname ||
    !req.body.gender ||
    !req.body.email ||
    !req.body.type ||
    !req.body.phone ||
    !req.body.password
  ) {
    return res.status(422).json({ error: "Please filled the fields properly" });
  }

  try {
    const userExist = await User.findOne({ email: req.body.email });

    if (userExist) {
      return res.status(422).json({ error: "email already exists" });
    }

    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      gender: req.body.gender,
      email: req.body.email,
      type: req.body.type,
      phone: req.body.phone,
      password: req.body.password,
    });
    await user.save();
    res.status(201).json({
      _id: user._id,
      message: "user registered successfully",
      firstname: user.firstname,
      lastname: user.lastname,
      gender: user.gender,
      email: user.email,
      type: user.type,
      phone: user.phone,
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(404).json({ message: "please fill login details" });
    }

    const userLogin = await User.findOne({ email: req.body.email });

    if (userLogin) {
      const isMatch = await bcrypt.compare(
        req.body.password,
        userLogin.password
      );

      const signtoken = await userLogin.generateAuthToken();
      console.log(signtoken);

      if (!isMatch) {
        res.status(400).json({ message: "Invalid credentials" });
      } else {
        res.status(200).json({
          message: "user sign in successfully",

          status: "true",

          user_id: userLogin._id,

          firstname: userLogin.firstname,
          lastname: userLogin.lastname,
          gender: userLogin.gender,
          email: userLogin.email,
          type: userLogin.type,
          phone: userLogin.phone,
        });
        // res.redirect('/')
      }
    } else {
      res.status(400).json({
        message: "Invalid credentials",
        status: "false",
      });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
