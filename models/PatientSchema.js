const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,

  PatientName: {
    type: String,
    require: true,
  },

  PatientAge: {
    type: String,
    require: true,
  },

  PatientGender: {
    type: String,
    enum: ["Male", "Female", "Other"],
  },

  AttendentName: {
    type: String,
    require: true,
  },

  AttendentMobileNumber: {
    type: String,
    require: true,
  },

  PackageSellingPrice: {
    type: String,
    require: true,
  },
});

const Patient = mongoose.model("Patient", PatientSchema);

module.exports = Patient;
