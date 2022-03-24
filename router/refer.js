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
      res.json({ "added successfully": referDetails });
      // Also update the wallet
    })
    .catch((err) => {
      res.json(err);
    });
});

router.post("/leadsrefer", protect, (req, res) => {
  let user = req.user;
  var _leadid = req.query.leadid;

  Lead.find({ _leadid: _leadid }, { _id: 0 })
    .then((leaddata) => {
      user
        .addLead(leaddata)
        .then((doc) => {
          res.json({ added: leaddata });
          // Also update the wallet
        })
        .catch((err) => {
          res.json(err);
        });
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get("/patientsrefered/:userid", (req, res) => {
  const _userid = req.params.userid;
  User.find({ _userid: _userid })
    .then((userdata) => {
      var data = userdata[0];
      var result = data.Patientsrefer;

      res.json(result);
    })
    .catch((err) => {
      console.error(err);
    });
});

router.get("/leadsrefered/:userid", (req, res) => {
  const _userid = req.params.userid;
  User.find({ _userid: _userid })
    .then((userdata) => {
      var data = userdata[0];
      var result = data.Leadsrefer;
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
    });
});

module.exports = router;
