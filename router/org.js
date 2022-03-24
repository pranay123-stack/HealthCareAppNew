const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
var Organization = require("../models/OrganizatioSchema");
const cloudinary = require("cloudinary").v2;
const { protect } = require("../middleware/authMiddleware");

cloudinary.config({
  cloud_name: "pranay-gaurav",
  api_key: "949454261729874",
  api_secret: "o_CrJsRu7RG-FRyDBbDGj2o7J8I",
});

router.post("/addorg", protect, (req, res, next) => {
  const file = req.files.image;
  cloudinary.uploader
    .upload(file.tempFilePath, (err, result) => {
      organization = new Organization({
        _orgid: new mongoose.Types.ObjectId(),
        OrgName: req.body.OrgName,
        image: result.url,

        Status: req.body.Status,
        Availability: req.body.Availability,
        ServiceTiming: req.body.ServiceTiming,
        OrgType: req.body.OrgType,
        OrgAddress: req.body.OrgAddress,
        OrgLocation: req.body.OrgLocation,
        OrgCity: req.body.OrgCity,
        State: req.body.State,
        Country: req.body.Country,
        OrgDescription: req.body.OrgDescription,
        ContactPersonName: req.body.ContactPersonName,
        ContactPersonPhoneNumber: req.body.ContactPersonPhoneNumber,
        ContactPersonEmailId: req.body.ContactPersonEmailId,
      });

      organization
        .save()

        .then((org) => {
          res.status(201).json({
            message: "Organization added successfully",
            createdOrg: org,
          });
        });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.get("/getorgs", async (req, res, next) => {
  try {
    const results = await Organization.find({}, { _id: 0 });
    res.status(200).json({ results });
    next();
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.put("/addpackage", protect, (req, res) => {
  const file = req.files.image;

  cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
    var detail = {
      _packageid: new mongoose.Types.ObjectId(),
      PackageName: req.body.PackageName,
      PackageType: req.body.PackageType,
      Thumbnail: result.url,
      PaymentOption: req.body.PaymentOption,
      PackageStatus: req.body.PackageStatus,
      OrgType: req.body.OrgType,
      PackageDescription: req.body.PackageDescription,
      image: result.url,
      Quantity: req.body.Quantity,
      ActualPrice: req.body.ActualPrice,
      OfferPrice: req.body.OfferPrice,
      PortalPrice: req.body.PortalPrice,
      MaxPrice: req.body.MaxPrice,
    };

    Organization.updateOne(
      { OrgName: req.body.OrgName },
      { $push: { OrgPackages: detail } },

      function (err, result) {
        if (err) {
          res.json(err);
        } else {
          res.json({
            message: "Package added successfully",
            createdPackage: detail,
          });
        }
      }
    );
  });
});

router.put("/addpackagewithorgid", protect, async (req, res, next) => {
  const file = req.files.image;
  const { orgid } = req.query;
  cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
    var detail = {
      _packageid: new mongoose.Types.ObjectId(),

      PackageType: req.body.PackageType,
      Thumbnail: result.url,
      PaymentOption: req.body.PaymentOption,
      PackageStatus: req.body.PackageStatus,

      PackageName: req.body.PackageName,
      PackageDescription: req.body.PackageDescription,
      image: result.url,
      Quantity: req.body.Quantity,
      ActualPrice: req.body.ActualPrice,
      OfferPrice: req.body.OfferPrice,
      PortalPrice: req.body.PortalPrice,
      MaxPrice: req.body.MaxPrice,
    };

    Organization.updateOne(
      { _orgid: orgid },
      { $push: { OrgPackages: detail } },

      function (err, result) {
        if (err) {
          res.status(500).json({ error: err });
        } else {
          res.status(200).json({
            message: "Package added successfully",
            createdPackage: detail,
          });
        }
      }
    );
  });
});

router.get("/getorg/:orgid", function (req, res) {
  const id = req.params.orgid;
  Organization.find({ _orgid: id }, { _id: 0 })

    .then(function (org) {
      if (org) {
        res.status(200).json({ result: org });
      } else {
        res.status(400).json({ message: "no organization found" });
      }
    })
    .catch(function (err) {
      res.status(500).json({ error: err });
    });
});

router.get("/orgquerybyorgid", (req, res) => {
  const _id = req.query.orgid;

  Organization.find({ _orgid: _id }, { _id: 0 })
    .exec()
    .then((org) => {
      if (org) {
        res.status(200).json({
          result: org,
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for the provided id" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.get("/orgquerybyOrgType", async (req, res) => {
  const { OrgType } = req.query;

  Organization.find({ OrgType: OrgType }, {})
    .exec()
    .then((orgs) => {
      if (orgs.length == 0) {
        res.status(400).json("no orgs found for given OrgType");
      } else {
        res.status(200).json({
          result: orgs,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.get("/getorgs/data/categorywise", async (req, res, next) => {
  try {
    var hospitalarray = [];

    var hospitalResult = await mongoose.connection
      .collection("organizations")
      .find(
        {
          OrgType: "HOSPITAL",
        },
        { _id: 0 }
      )
      .toArray();

    for (let i = 0; i < hospitalResult.length; i++) {
      let a = hospitalResult[i];
      hospitalarray.push(a);
    }

    var clinicarray = [];

    var clinicResult = await mongoose.connection
      .collection("organizations")
      .find({
        OrgType: "CLINIC",
      })
      .toArray();

    for (let i = 0; i < clinicResult.length; i++) {
      let b = clinicResult[i];
      clinicarray.push(b);
    }

    var labarray = [];

    var labResult = await mongoose.connection
      .collection("organizations")
      .find({
        OrgType: "LABS",
      })
      .toArray();

    for (let i = 0; i < labResult.length; i++) {
      let b = labResult[i];
      labarray.push(b);
    }

    var wellnessarray = [];

    var wellnessResult = await mongoose.connection
      .collection("organizations")
      .find({
        OrgType: "WELLNESS",
      })
      .toArray();

    for (let i = 0; i < wellnessResult.length; i++) {
      let b = wellnessResult[i];
      wellnessarray.push(b);
    }

    var diagnosticarray = [];

    var diagnosticResult = await mongoose.connection
      .collection("organizations")
      .find({
        OrgType: "DIAGNOSTIC",
      })
      .toArray();

    for (let i = 0; i < diagnosticResult.length; i++) {
      let b = diagnosticResult[i];
      diagnosticarray.push(b);
    }

    return res.json({
      hospitalarray,
      clinicarray,
      labarray,
      wellnessarray,
      diagnosticarray,
    });

    next();
  } catch (error) {
    res.json({ error: error });
  }
});

router.delete("/deleteorg/:orgid", protect, async (req, res, next) => {
  const _id = req.params.orgid;
  try {
    const result = await Organization.findOneAndDelete({ _orgid: _id });
    res.status(200).json({ message: "Deleted successfully", result });
    next();
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.put("/updateorg/:orgid", protect, async (req, res, next) => {
  try {
    const _id = req.params.orgid;
    const updates = req.body;

    const options = { new: true };

    const result = await Organization.findOneAndUpdate(
      { _orgid: _id },
      updates,
      options
    );
    res.status(200).json({ message: "updated successfully", result });

    next();
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

module.exports = router;
