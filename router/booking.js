const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Organization = require("../models/OrganizatioSchema");
const { protect } = require("../middleware/authMiddleware");

router.put("/addbooking/:packageid", protect, (req, res) => {
  var _packageid = req.params.packageid;

  var bookingdetail = {
    _bookingid: new mongoose.Types.ObjectId(),

    PatientName: String,
    PatientAge: String,
    PatientGender: String,
    AttendentName: String,
    MobileNumber: Number,
    SellingPrice: Number,
  };

  Organization.updateOne(
    { _packageid: _packageid },
    { $push: { PackageBookings: bookingdetail } },

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
router.get("/getbookingsbypackageid/:packageid", (req, res) => {
  Organization.findById(req.params.packageid)
    .then((bookings) => {
      res.status(200).json(bookings);
    })
    .catch((err) => {
      res.status(500).json({ err: err });
    });
});

router.get("/bookdetailbybookid/:bookid", (req, res) => {
  Organization.findById(req.params.bookid)
    .then((booking) => {
      res.status(200).json(booking);
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
});

module.exports = router;
