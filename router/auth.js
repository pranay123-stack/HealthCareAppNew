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
    !req.body.usertype ||
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
      _userid: new mongoose.Types.ObjectId(),
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      gender: req.body.gender,
      email: req.body.email,
      usertype: req.body.usertype,
      phone: req.body.phone,
      password: req.body.password,
    });
    await user.save();
    res.status(201).json({
      _userid: user._userid,
      message: "user registered successfully",
      firstname: user.firstname,
      lastname: user.lastname,
      gender: user.gender,
      email: user.email,
      usertype: user.usertype,
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

      var signtoken = await userLogin.generateAuthToken();
      // if (signtoken) {
      //   res.json(signtoken);
      // }

      if (!isMatch) {
        res.status(400).json({ message: "Invalid credentials" });
      } else {
        res.status(200).json({
          message: "user sign in successfully",

          status: "true",

          _userid: userLogin._userid,

          firstname: userLogin.firstname,
          lastname: userLogin.lastname,
          gender: userLogin.gender,
          email: userLogin.email,
          usertype: userLogin.usertype,
          phone: userLogin.phone,
          signintoken: signtoken,
        });
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

router.get("/users", (req, res) => {
  User.find()
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.put("/userupdate/:userid", async (req, res, next) => {
  try {
    const _userid = req.params.userid;
    const updates = req.body;
    const options = { new: true };

    const result = await User.findOneAndUpdate(
      { _userid: _userid },
      updates,
      options
    );
    res.status(200).json({ message: "user updated successfully", result });

    next();
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.delete("/userdelete/:userid", async (req, res) => {
  const _userid = req.params.userid;
  try {
    const result = await User.findOneAndDelete({ _userid: _userid });
    res.status(200).json({ message: "User deleted successfully", result });
    next();
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

module.exports = router;
