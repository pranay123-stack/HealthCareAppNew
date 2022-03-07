const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
var Organization = require("../models/OrganizatioSchema");

const Package = require("../models/PackageSchema");
const cloudinary = require("cloudinary").v2;
const { protect } = require("../middleware/authMiddleware");

cloudinary.config({
  cloud_name: "pranay-gaurav",
  api_key: "949454261729874",
  api_secret: "o_CrJsRu7RG-FRyDBbDGj2o7J8I",
});

router.post("/addorg", (req, res, next) => {
  const file = req.files.image;
  cloudinary.uploader
    .upload(file.tempFilePath, (err, result) => {
      console.log(result);

      organization = new Organization({
        _id: new mongoose.Types.ObjectId(),
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
        ContactName: req.body.ContactName,
        ContactPhoneNumber: req.body.ContactPhoneNumber,
        ContactEmailId: req.body.ContactEmailId,
      });

      organization
        .save()

        .then((result) => {
          res.status(201).json({
            message: "Organization added successfully",
            createdOrg: result,
          });
        });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// updating org to attach package
router.post("/addpackage/:orgid", async (req, res, next) => {
  const file = req.files.image;
  cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
    // console.log(result);

    data = new Package({
      _id: new mongoose.Types.ObjectId(),
      PortalPrice: req.body.PortalPrice,
      PackageType: req.body.PackageType,
      Thumbnail: req.body.Thumbnail,
      PaymentOption: req.body.PaymentOption,
      PackageStatus: req.body.PackageStatus,
      OrgName: req.body.OrgName,
      PackageName: req.body.PackageName,
      PackageDescription: req.body.PackageDescription,
      image: result.url,
      ActualPrice: req.body.ActualPrice,
      OfferPrice: req.body.OfferPrice,
    });

    data
      .save()

      .then(function (dbPackage) {
        console.log(dbPackage);
        try {
          return Organization.updateOne(
            { _id: req.params.orgid },
            { $push: { OrgPackages: dbPackage._id } }
          );
        } catch (err) {
          console.log("-----> ", err.message);
        }
      })

      .then(function (dbOrg) {
        console.log("------> Success!!");
        res.json(dbOrg);
      })
      .catch(function (err) {
        res.json(err);
      });
  });
});

// populating with packages details
router.get("/getorg/:id", function (req, res) {
  Organization.findById({ _id: req.params.id })
    .populate("OrgPackages")
    .then(function (dbOrg) {
      res.json(dbOrg);
    })
    .catch(function (err) {
      res.json(err);
    });
});

router.get("/orgquerybyid", (req, res) => {
  const { id } = req.query;
  //    console.log("id ---> ",id)

  Org.findById(id)

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

router.get("/orgquerybytype", async (req, res) => {
  const { OrgType } = req.query;

  Org.find({ OrgType: OrgType }, {})
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

router.get("/getorgs", async (req, res, next) => {
  try {
    const results = await Organization.find();
    res.status(200).json({ results });
    next();
  } catch (err) {
    res.send(err);
  }
});

router.get("/getorgs/data/categorywise", async (req, res, next) => {
  var hospitalarray = [];
  const finalResults = await new Promise((resolve, reject) => {
    mongoose.connection
      .collection("organizations")
      .find({ OrgType: "HOSPITAL" })
      .toArray(function (err, result) {
        resolve(result);
      });
  });

  for (let i = 0; i < finalResults.length; i++) {
    let a = finalResults[i];
    hospitalarray.push(a);
  }

  var clinicarray = [];
  const finalResult = await new Promise((resolve, reject) => {
    mongoose.connection
      .collection("organizations")
      .find({ OrgType: "CLINIC" })
      .toArray(function (err, result) {
        resolve(result);
      });
  });

  for (let i = 0; i < finalResult.length; i++) {
    let b = finalResult[i];
    clinicarray.push(b);
  }

  return res.json({ hospitalarray, clinicarray });

  next();
});

router.delete("/deleteorg/:id", protect, async (req, res, next) => {
  const _id = req.params.id;
  try {
    const result = await Org.findByIdAndDelete({ _id });
    res.status(200).json({ message: "Deleted successfully", result });
    next();
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.put("/updateorg/:id", protect, async (req, res, next) => {
  try {
    const _id = req.params.id;
    const updates = req.body;
    const options = { new: true };

    const result = await Org.findByIdAndUpdate(_id, updates, options);
    res.status(200).json({ message: "updated successfully", result });

    next();
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

module.exports = router;
