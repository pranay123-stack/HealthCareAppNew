const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Organization = require("../models/OrganizatioSchema");
const { protect } = require("../middleware/authMiddleware");

router.put("/addbooking/:packageid", (req, res) => {
  const { packageid } = req.params;

  var detail = {
    _bookingid: new mongoose.Types.ObjectId(),
    PatientName: req.body.PatientName,
    PatientAge: req.body.PatientAge,
    PatientGender: req.body.PatientGender,
    AttendentName: req.body.AttendentName,
    MobileNumber: req.body.MobileNumber,
    SellingPrice: req.body.SellingPrice,
  };

  Organization.findOneAndUpdate(
    { "OrgPackages._packageid": packageid },

    {
      $push: {
        OrgPackages: {
          packages: {
            PackageBookings: detail,
          },
        },
      },
    },

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
