const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/UserSchema");
const { protect } = require("../middleware/authMiddleware");

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
      OrgName: req.body.OrgName,
    });
    await user.save();
    res.status(200).json({
      message: "user registered successfully",
      _userid: user._userid,
      firstname: user.firstname,
      lastname: user.lastname,
      gender: user.gender,
      email: user.email,
      usertype: user.usertype,
      phone: user.phone,
      OrgName: user.OrgName,
    });
  } catch (err) {
    res.status(500).json({ error: err });
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
          loginstatus: "true",

          _userid: userLogin._userid,
          OrgName: userLogin.OrgName,
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
        error: "Invalid credentials",
        loginstatus: "false",
      });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.get("/users", protect, (req, res) => {
  if (
    req.user.usertype == "admin" &&
    req.user.OrgName == "admin Organization"
  ) {
    User.find({}, { _id: 0, tokens: 0 })

      .then((users) => {
        res.status(200).json({ results: users });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  } else {
    if (req.user.usertype == "doctor") {
      User.find({ OrgName: req.body.OrgName }, { _id: 0, tokens: 0 })

        .then((users) => {
          res.status(200).json({ results: users });
        })
        .catch((err) => {
          res.status(500).json({ error: err });
        });
    }
  }
});

router.put("/userupdate/:userid", protect, (req, res) => {
  const _userid = req.params.userid;
  const updates = req.body;
  const options = { new: true };

  User.findOneAndUpdate(
    { _userid: _userid },
    updates,
    options,
    function (err, result) {
      if (err) {
        res.status(500).json({ error: err });
      }

      var updateduser = {
        firstname: result.firstname,
        lastname: result.lastname,
        gender: result.gender,
        email: result.email,
        phone: result.phone,
        usertype: result.usertype,
      };

      res
        .status(200)
        .json({ message: " user updated successfully", updateduser });
    }
  );
});

router.delete("/userdelete/:userid", protect, (req, res) => {
  const _userid = req.params.userid;

  User.findOneAndDelete({ _userid: _userid }, function (err, result) {
    if (err) {
      return res.status(500).json({ error: err });
    }

    res.status(200).json({ message: "user deleted successfully" });
  });
});

router.get("/getuser/:userid", (req, res) => {
  User.find({ _userid: req.params.userid }, { _id: 0, tokens: 0 })
    .then((user) => {
      const result = user[0];
      res.status(200).json({ result: result });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

module.exports = router;
