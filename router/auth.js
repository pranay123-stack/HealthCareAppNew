const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/UserSchema");
const { protect } = require("../middleware/authMiddleware");
const Organization = require("../models/OrganizatioSchema");

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
    return res.status(200).json({ error: "Please filled the fields properly" });
  }

  try {
    const userExist = await User.findOne({ email: req.body.email });

    if (userExist) {
      return res.status(200).json({ error: "email already exists" });
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
      Status: req.body.Status,
    });
    await user.save();
    res.status(200).json({
      message: "user registered successfully",
      _userid: user._userid,
      firstname: user.firstname,
      password: user.password,
      lastname: user.lastname,
      gender: user.gender,
      email: user.email,
      usertype: user.usertype,
      phone: user.phone,
      OrgName: user.OrgName,
      Status: user.Status,
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.post("/login", async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(200).json({ message: "please fill login details" });
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
      res.status(200).json({
        error: "Invalid credentials",
        loginstatus: "false",
      });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.get("/users", protect, (req, res) => {
  if (req.user.usertype == "superAdmin" && req.user.Status == "Active") {
    User.find({}, { _id: 0, tokens: 0 })

      .then((users) => {
        res.status(200).json({ results: users });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  } else if (req.user.usertype == "admin" && req.user.Status == "Active") {
    User.find({ OrgName: req.user.OrgName }, { _id: 0, tokens: 0 })
      .then((users) => {
        res.status(200).json({ results: users });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }
});

router.get("/packages", protect, (req, res) => {
  var user = req.user;
  if (user.usertype == "doctor") {
    console.log(user.usertype);
    Organization.find({ OrgName: user.OrgName }, "OrgPackages")
      .exec()
      .then((packages) => {
        if (packages.length > 0) {
          var result = packages[0].OrgPackages;

          res.status(200).json({
            result,
          });
        } else {
          res.status(400).json("no packages found for given OrgName");
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  } else {
    Organization.find({}, "OrgPackages", function (err, result) {
      if (err) {
        res.json(err);
      }

      if (result.length > 0) {
        var final = [];
        var finalobj = {};
        for (var i = 0; i < result.length; i++) {
          for (var j = 0; j < result[i].OrgPackages.length; j++) {
            final.push(result[i].OrgPackages[j]);
          }
        }

        for (var k = 0; k < final.length; k++) {
          finalobj[k] = final[k];
        }

        res.status(200).json({ results: final });
      } else {
        res.status(400).json("no packages avaialble");
      }
    });
  }
});

router.put("/userupdate/:userid", protect, (req, res) => {
  User.findOne({ _userid: req.params.userid }, function (err, user) {
    if (err) return false;
    (user.firstname = req.body.firstname || user.firstname),
      (user.lastname = req.body.lastname || user.lastname),
      (user.gender = req.body.gender || user.gender),
      (user.phone = req.body.phone || user.phone),
      (user.email = req.body.email || user.email),
      (user.Status = req.body.Status || user.Status),
      (user.OrgName = req.body.OrgName || user.OrgName),
      (user.usertype = req.body.usertype || user.usertype),
      (user.password = req.body.password || user.password);
    user.save().then((user) => {
      var updateuser = {
        firstname: user.firstname,
        lastname: user.lastname,
        gender: user.gender,
        phone: user.phone,
        usertype: user.usertype,
        OrgName: user.OrgName,
        email: user.email,
        Status: user.Status,
      };

      res.json(updateuser);
    });
  });
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
