const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/UserSchema");
const Lead = require("../models/LeadsSchema");

//refer route
router.post("/patientrefer", protect, (req, res) => {
  let user = req.user;
  let referDetails = req.body;

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

      // res.json(doc.refer);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/patientrefer/:userid", (req, res) => {
  const _userid = req.params.userid;
  User.findById(_userid)
    .then((user) => {
      res.json({ referedetails: user.Patientrefer });
    })
    .catch((err) => {
      console.error(err);
    });
  // res.json({ message: "working" });
});

router.post("/addlead/:leadid", protect, (req, res, next) => {
  let user = req.user;
  const _leadid = req.params.leadid;
  console.log(_leadid);
  Lead.findById(_leadid)
    .then((leaddata) => {
      user.addLead(leaddata);
    })
    .catch((err) => console.log(err));

  res.json("added");

  next();
});

router.get("/leadrefer/:userid", (req, res) => {
  const _userid = req.params.userid;
  Lead.findById(_userid)
    .then((user) => {
      res.json({ referedetails: user.Lead });
    })
    .catch((err) => {
      console.error(err);
    });
  // res.json({ message: "working" });
});

module.exports = router;
