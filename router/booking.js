const express = require("express");
const router = express.Router();
const Booking = require("../models/BookingSchema");
const { protect } = require("../middleware/authMiddleware");

router.post("/addbookingbypackageid/:packageid", protect, (req, res) => {
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

// list ALL BOOKINGS using booking id
router.get("/allbookings", (req, res) => {
  Booking.find()
    .then((bookings) => {
      res.status(200).json(bookings);
    })
    .catch((err) => {
      res.json(err);
    });
});

// list all bookings of a particular package
router.get("/getbookingsbypackageid/:packageid", (req, res) => {
  Booking.findById(req.params.packageid)
    .then((bookings) => {
      res.status(200).json(bookings);
    })
    .catch((err) => {
      res.status(500).json({ err: err });
    });
});

router.get("/bookdetailbybookid/:bookid", (req, res) => {
  Booking.findById(req.params.bookingid)
    .then((booking) => {
      res.status(200).json(booking);
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
});

module.exports = router;
