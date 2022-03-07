const mongoose = require("mongoose");

const PackageSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,

  OrgName: {
    type: String,
    required: true,
  },

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
  },
  PortalPrice: {
    type: Number,
  },
  OfferPrice: {
    type: Number,
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

const Package = mongoose.model("Package", PackageSchema);

module.exports = Package;
