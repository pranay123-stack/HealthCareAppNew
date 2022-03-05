const express = require("express");
const router = express.Router();
const Patient = require("../models/PatientSchema");

const { protect } = require("../middleware/authMiddleware");

router.post("/bookings", (req, res) => {
  const {
    PatientName,
    PatientAge,
    PatientGender,
    AttendentName,
    AttendentMobileNumber,
    PackageSellingPrice,
  } = req.body;

  const patient = new Patient({
    PatientName,
    PatientAge,
    PatientGender,
    AttendentName,
    AttendentMobileNumber,
    PackageSellingPrice,
  });

  patient
    .save()
    .then((docs) => {
      return res.json({ docs });
    })
    .catch((err) => {
      return res.json({ err });
    });
});

module.exports = router;
