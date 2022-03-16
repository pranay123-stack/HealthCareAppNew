const mongoose = require("mongoose");

var packages = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,

  PackageName: {
    type: String,
    required: true,
  },

  PackageType: {
    type: String,
    enum: ["Package", "OT", "Bed", "Test", "Surgery", "Consultation"],
    default: "Package",
    required: true,
  },

  PackageDescription: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
  },

  Thumbnail: {
    type: String,
    required: true,
  },

  ActualPrice: {
    type: Number,
    required: true,
  },
  PortalPrice: {
    type: Number,
    required: true,
  },
  OfferPrice: {
    type: Number,
    required: true,
  },

  MaxPrice: {
    type: Number,
    required: true,
  },

  Quantity: {
    type: Number,
    required: true,
  },

  PaymentOption: {
    type: String,
    enum: ["Offline", "Online"],
    default: "Offline",
    required: true,
  },

  PackageStatus: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
    required: true,
  },
});

const OrganizationSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,

  OrgPackages: [packages],

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
