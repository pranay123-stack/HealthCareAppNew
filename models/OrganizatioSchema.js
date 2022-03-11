const mongoose = require("mongoose");

const OrganizationSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,

  OrgPackages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
    },
  ],

  OrgName: {
    type: String,
    required: true,
  },

  OrgType: {
    type: String,
    enum: ["HOSPITAL", "CLINIC", "DIAGNOSTIC", "WELLNESS", "LABS"],
    default: "HOSPITAL",
  },

  image: {
    type: String,
    required: true,
  },
  OrgAddress: {
    type: String,
    required: true,
  },
  OrgLocation: {
    type: String,
    required: true,
  },
  OrgCity: {
    type: String,
    required: true,
  },
  State: {
    type: String,
    required: true,
  },
  Country: {
    type: String,
    required: true,
  },

  OrgDescription: {
    type: String,
    required: true,
  },

  ContactPersonName: {
    type: String,
    required: true,
  },

  ContactPersonPhoneNumber: {
    type: String,
    required: true,
  },

  ContactPersonEmailId: {
    type: String,
    required: true,
  },

  Status: {
    type: String,
    enum: ["OPEN", "CLOSED"],
    default: "OPEN",
  },

  Availability: {
    type: String,
    required: true,
  },
});

const Organization = mongoose.model("Organization", OrganizationSchema);

module.exports = Organization;
