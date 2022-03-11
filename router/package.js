// Creating a package
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Package = require("../models/PackageSchema");
const cloudinary = require("cloudinary").v2;
const { protect } = require("../middleware/authMiddleware");

cloudinary.config({
  cloud_name: "pranay-gaurav",
  api_key: "949454261729874",
  api_secret: "o_CrJsRu7RG-FRyDBbDGj2o7J8I",
});

router.post("/addpackage", protect, (req, res, next) => {
  const file = req.files.image;
  cloudinary.uploader
    .upload(file.tempFilePath, (err, result) => {
      console.log(result);

      data = new Package({
        _id: new mongoose.Types.ObjectId(),
        PortalPrice: req.body.PortalPrice,
        Thumbnail: req.body.Thumbnail,
        PackageType: req.body.PackageType,
        PaymentOption: req.body.PaymentOption,
        PackageStatus: req.body.PackageStatus,
        OrgName: req.body.OrgName,
        PackageName: req.body.PackageName,
        PackageDescription: req.body.PackageDescription,
        image: result.url,
        ActualPrice: req.body.ActualPrice,
        OfferPrice: req.body.OfferPrice,
      });

      data.save().then((result) => {
        res.status(201).json({
          message: "Package added successfully",
          createdPackage: result,
        });
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.get("/allpackages", async (req, res, next) => {
  try {
    const results = await Package.find();
    res.status(200).json({ results });
    next();
  } catch (err) {
    res.send(err);
  }
});

router.get("/queryorgpackage", (req, res) => {
  const { OrgName } = req.query;
  Package.find({ OrgName: OrgName }, {})
    .exec()
    .then((docs) => {
      console.log(docs);

      res.status(200).json({
        docs,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.get("/querypackagedetail", (req, res) => {
  const { PackageName } = req.query;
  Package.find({ PackageName: PackageName })
    .exec()
    .then((doc) => {
      console.log(doc);

      res.status(200).json({
        doc,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.get("/querypackageid", (req, res) => {
  const { id } = req.query;
  //    console.log("id ---> ",id)

  Package.findById(id)
    .exec()
    .then((doc) => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          doc,
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for the provided id" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.delete("/deletepackage/:id", protect, async (req, res, next) => {
  const _id = req.params.id;
  try {
    const result = await Package.findByIdAndDelete({ _id });
    res.status(200).json({ message: "Deleted successfully", result });
    next();
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.put("/updatepackage/:id", protect, async (req, res, next) => {
  try {
    const _id = req.params.id;
    const updates = req.body;
    const options = { new: true };

    const result = await Package.findByIdAndUpdate(_id, updates, options);
    res.status(200).json({ message: "updated successfully", result });

    next();
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

module.exports = router;
