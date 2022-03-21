const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Organization = require("../models/OrganizatioSchema");
const { protect } = require("../middleware/authMiddleware");

router.put("/addbooking", (req, res) => {
  var detail = {
    _bookingid: new mongoose.Types.ObjectId(),
    PatientName: req.body.PatientName,
    PatientAge: req.body.PatientAge,
    PatientGender: req.body.PatientGender,
    AttendentName: req.body.AttendentName,
    MobileNumber: req.body.MobileNumber,
    SellingPrice: req.body.SellingPrice,
  };

  Organization.updateOne(
    { "OrgPackages._packageid": req.query.packageid },
    // { "OrgPackages.$": 1 },
    { $push: { "OrgPackages.$.PackageBookings": detail } },

    function (err, result) {
      if (err) {
        res.json(err);
      } else {
        res.json(result);
      }
    }
  );
});

// list all bookings of a particular package
router.get("/bookings", (req, res) => {
  Organization.find(
    { "OrgPackages._packageid": req.query.packageid },
    { "OrgPackages.$": 1 }
  )

    .then((data) => {
      const newData = data[0];
      const finalData = newData.OrgPackages[0];
      const allpackageBookings = finalData.PackageBookings;

      res.json({ AllBookings: allpackageBookings });
    })
    .catch((err) => {
      res.json({ err: err });
    });
});

module.exports = router;
