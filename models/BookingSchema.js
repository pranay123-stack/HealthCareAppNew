const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  PackageId: String,
  userId: String,
  PatientName: String,
  PatientAge: String,
  PatientGender: String,
  AttendentName: String,
  MobileNumber: Number,
  SellingPrice: Number,
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
