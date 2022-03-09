const express = require("express");
const router = express.Router();
const Booking = require("../models/BookingSchema");
const { protect } = require("../middleware/authMiddleware");

router.post("/booking/:packageid", protect, (req, res) => {
  let user = req.user;
  const _packageid = req.params.packageid;

  const booking = new Booking({
    UserId: user.id,
    PackageId: _packageid,
    PatientName: req.body.PatientName,
    PatientAge: req.body.PatientAge,
    PatientGender: req.body.PatientGender,
    AttendentName: req.body.AttendentName,
    MobileNumber: req.body.MobileNumber,
    SellingPrice: req.body.SellingPrice,
  });
  booking
    .save()
    .then((result) => {
      res.json({ message: "booking confirmed", bookingdeatils: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
