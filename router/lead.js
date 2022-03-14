const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Lead = require("../models/LeadsSchema");
const User = require("../models/UserSchema");

const { protect } = require("../middleware/authMiddleware");

router.post("/addleads", protect, async (req, res) => {
  try {
    var authuser = req.user;

    const {
      HospitalName,
      PackageName,
      PatientName,
      PatientAge,
      PatientGender,
      PatientDetails,
      LeadsCategory,
      ContactPersonPhoneNumber,
      ContactPersonEmailId,
      ContactPersonName,
    } = req.body;

    const data = new Lead({
      _id: new mongoose.Types.ObjectId(),
      userId: authuser._id,
      HospitalName,
      PackageName,
      PatientName,
      PatientAge,
      PatientGender,
      PatientDetails,
      LeadsCategory,
      ContactPersonPhoneNumber,
      ContactPersonEmailId,
      ContactPersonName,
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
  Lead.find()
    .exec()
    .then((docs) => {
      console.log(docs);
      // if(docs.length > 0){
      res.status(200).json({
        docs,
      });
      // }else{
      //     res.status(400).json({message:'No entries found'})
      // }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.delete("/deletelead/:leadid", protect, async (req, res, next) => {
  const _id = req.params.id;
  try {
    const result = await Lead.findByIdAndDelete({ _id });
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

    const result = await Lead.findByIdAndUpdate(_id, updates, options);
    res.status(200).json({ message: "updated successfully", result });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.get("/getlead/:leadid", (req, res) => {
  Lead.findById(req.params.leadid)
    .then((lead) => {
      res.status(200).json(lead);
    })
    .catch((err) => {
      res.status(400).json({ error: err });
    });
});

router.get("/getcreatedleadsbyuserid/:userid", async (req, res, next) => {
  var createdLeadsarray = [];

  var finalResults = await mongoose.connection
    .collection("leads")
    .find({
      userId: req.params.userid,
    })
    .toArray();

  for (let i = 0; i < finalResults.length; i++) {
    let a = finalResults[i];
    createdLeadsarray.push(a);
  }

  return res.json({ createdLeadsarray });

  next();
});

router.get("/getreferleadsbyuserid/:userid", (req, res, next) => {
  User.findById(req.params.userid)
    .then((user) => {
      res.json(user.ReferLeads);
    })
    .catch((err) => {
      res.json(err);
    });
});

module.exports = router;
