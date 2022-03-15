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

router.post("/addorg", protect, (req, res, next) => {
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
        ContactPersonName: req.body.ContactPersonName,
        ContactPersonPhoneNumber: req.body.ContactPersonPhoneNumber,
        ContactPersonEmailId: req.body.ContactPersonEmailId,
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

router.get("/getorgs", async (req, res, next) => {
  try {
    const results = await Organization.find();
    res.status(200).json({ results });
    next();
  } catch (err) {
    res.send(err);
  }
});

// updating org to attach package
router.post("/addpackage/:orgid", protect, async (req, res, next) => {
  const file = req.files.image;
  cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
    // console.log(result);

    data = new Package({
      _id: new mongoose.Types.ObjectId(),

      PackageType: req.body.PackageType,
      Thumbnail: req.body.Thumbnail,
      PaymentOption: req.body.PaymentOption,
      PackageStatus: req.body.PackageStatus,
      OrgName: req.body.OrgName,
      PackageName: req.body.PackageName,
      PackageDescription: req.body.PackageDescription,
      image: result.url,
      Quantity: req.body.Quantity,
      ActualPrice: req.body.ActualPrice,
      OfferPrice: req.body.OfferPrice,
      PortalPrice: req.body.PortalPrice,
      MaxPrice: req.body.MaxPrice,
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
router.get("/getorg/:orgid", function (req, res) {
  const id = req.params.orgid;
  Organization.findById(id)
    .populate("OrgPackages")
    .then(function (dbOrg) {
      res.json(dbOrg);
    })
    .catch(function (err) {
      res.json(err);
    });
});

router.get("/orgquerybyorgid", (req, res) => {
  const _id = req.query.id;

  Organization.findById(_id)
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

router.get("/orgquerybyOrgType", async (req, res) => {
  const { OrgType } = req.query;

  Organization.find({ OrgType: OrgType }, {})
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

router.get("/getorgs/data/categorywise", async (req, res, next) => {
  try {
    var hospitalarray = [];

    var finalResults = await mongoose.connection
      .collection("organizations")
      .find({
        OrgType: "HOSPITAL",
      })
      .toArray();

    for (let i = 0; i < finalResults.length; i++) {
      let a = finalResults[i];
      hospitalarray.push(a);
    }

    var clinicarray = [];

    var finalResult = await mongoose.connection
      .collection("organizations")
      .find({
        OrgType: "CLINIC",
      })
      .toArray();

    for (let i = 0; i < finalResult.length; i++) {
      let b = finalResult[i];
      clinicarray.push(b);
    }

    return res.json({ hospitalarray, clinicarray });

    next();
  } catch (error) {
    res.json({ error: error });
  }
});

router.delete("/deleteorg/:orgid", protect, async (req, res, next) => {
  const _id = req.params.orgid;
  try {
    const result = await Organization.findByIdAndDelete({ _id });
    res.status(200).json({ message: "Deleted successfully", result });
    next();
  } catch (err) {
    res
      .status(500)
      .json({ error: "user is not allowed to delete before authorized" });
  }
});

router.put("/updateorg/:orgid", protect, async (req, res, next) => {
  try {
    const _id = req.params.orgid;
    const updates = req.body;
    const options = { new: true };

    const result = await Organization.findByIdAndUpdate(_id, updates, options);
    res.status(200).json({ message: "updated successfully", result });

    next();
  } catch (err) {
    res
      .status(500)
      .json({ error: "user is not allowed to update before authorized" });
  }
});

module.exports = router;
