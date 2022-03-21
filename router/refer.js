const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/UserSchema");
const Lead = require("../models/LeadsSchema");

//refer route
router.post("/patientrefer", protect, (req, res) => {
  let user = req.user;
  var referDetails = req.body;

  user
    .addPatientRefer(referDetails)
    .then((doc) => {
      var referdata = doc.Patientrefer;
      user
        .addWallet(referdata)
        .then((wallet) => {
          res.json("wallet added");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });

  res.json("added successfully");
});

router.post("/leadsrefer/:leadid", protect, (req, res, next) => {
  let user = req.user;
  var _leadid = req.params.leadid;

  Lead.find({ _leadid: _leadid })
    .then((leaddata) => {
      user.addLead(leaddata);
    })
    .catch((err) => console.log(err));

  res.json("added");

  next();
});

router.get("/patientsrefered/:userid", (req, res) => {
  const _userid = req.params.userid;
  User.findById(_userid)
    .then((user) => {
      var { Patientrefer } = user;
      res.json({ referedetails: Patientrefer });
    })
    .catch((err) => {
      console.error(err);
    });
  // res.json({ message: "working" });
});

router.get("/leadsrefered/:userid", (req, res) => {
  const _userid = req.params.userid;
  User.findById(_userid)
    .then((user) => {
      res.json({ referedetails: user.Lead });
    })
    .catch((err) => {
      console.error(err);
    });
  // res.json({ message: "working" });
});

module.exports = router;
