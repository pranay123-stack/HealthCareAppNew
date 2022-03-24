const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Lead = require("../models/LeadsSchema");
const { protect } = require("../middleware/authMiddleware");

router.post("/addleads", protect, async (req, res) => {
  try {
    var authuser = req.user;

    const {
      OrgName,
      PackageName,
      PatientName,
      PatientAge,
      PatientGender,
      PatientDetails,
      LeadsCategory,
      ContactPersonPhoneNumber,
      ContactPersonEmailId,
      ContactPersonName,
      LeadStatus,
    } = req.body;

    const data = new Lead({
      _leadid: new mongoose.Types.ObjectId(),
      _userid: authuser._userid,
      OrgName,
      PackageName,
      PatientName,
      PatientAge,
      PatientGender,
      PatientDetails,
      LeadsCategory,
      ContactPersonPhoneNumber,
      ContactPersonEmailId,
      ContactPersonName,
      LeadStatus,
    });

    await data.save();

    res.status(201).json({
      message: "Leads added successfully",
      createdLeads: data,
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.get("/getleads", (req, res) => {
  Lead.find({}, { _id: 0 })
    .exec()
    .then((leads) => {
      res.status(200).json({ results: [leads] });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.delete("/deletelead/:leadid", protect, async (req, res, next) => {
  const _id = req.params.leadid;
  try {
    const result = await Lead.findOneAndDelete({ _leadid: _id });
    res.status(200).json({ message: "Deleted successfully", result });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.put("/updatelead/:leadid", protect, async (req, res, next) => {
  try {
    const _id = req.params.leadid;
    const updates = req.body;
    const options = { new: true };

    const result = await Lead.findOneAndUpdate(
      { _leadid: _id },
      updates,
      options
    );
    res.status(200).json({ message: "updated successfully", result });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.get("/getlead/:leadid", (req, res) => {
  Lead.find({ _leadid: req.params.leadid }, { _id: 0 })
    .then((lead) => {
      res.status(200).json(lead);
    })
    .catch((err) => {
      res.status(400).json({ error: err });
    });
});

router.get("/getcreatedleadsbyuserid/:userid", async (req, res, next) => {
  var createdLeadsarray = [];

  var leadResults = await mongoose.connection
    .collection("leads")
    .find({ _userid: req.params.userid })

    .toArray();

  for (let i = 0; i < leadResults.length; i++) {
    let a = leadResults[i];
    createdLeadsarray.push(a);
  }

  return res.json({ createdLeadsarray });

  next();
});

router.get("/getcreatedleadsoforgname/:OrgName", async (req, res) => {
  var createdLeadsarray = [];

  var leadResults = await mongoose.connection
    .collection("leads")
    .find({ OrgName: req.params.OrgName })

    .toArray();

  for (let i = 0; i < leadResults.length; i++) {
    let a = leadResults[i];
    createdLeadsarray.push(a);
  }

  return res.json({ createdLeadsarray });

  next();
});

module.exports = router;
