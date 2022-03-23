const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema(
  {
    _leadid: { type: mongoose.Schema.Types.ObjectId },

    _userid: { type: String, ref: "User" },

    PatientName: {
      type: String,
      required: true,
    },

    PatientAge: {
      type: Number,
      required: true,
    },

    PatientGender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },

    PatientDetails: {
      type: String,
      required: true,
    },

    OrgName: {
      type: String,
      required: true,
      ref: "Organization",
    },

    PackageName: {
      type: String,
      required: true,
    },

    LeadsCategory: {
      type: String,
      enum: [
        "OPD",
        "test",
        "IPD",
        "surgery",
        "wellness",
        "dietician",
        "physiotherapy",
        "other",
      ],
      required: true,
    },

    ContactPersonName: {
      type: String,
      required: true,
    },

    ContactPersonEmailId: {
      type: String,
      required: true,
    },

    ContactPersonPhoneNumber: {
      type: Number,
      required: true,
    },

    LeadStatus: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Lead = mongoose.model("Lead", LeadSchema);

module.exports = Lead;
