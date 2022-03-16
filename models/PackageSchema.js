const mongoose = require("mongoose");

const PackageSchema = new mongoose.Schema({
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

const Package = mongoose.model("Package", PackageSchema);

module.exports = Package;
