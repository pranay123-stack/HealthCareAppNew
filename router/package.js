const express = require("express");
const router = express.Router();
const Organization = require("../models/OrganizatioSchema");
const { protect } = require("../middleware/authMiddleware");

router.get("/querypackagebyOrgName", (req, res) => {
  const { OrgName } = req.query;
  Organization.find({ OrgName: OrgName }, "OrgPackages")
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

router.get("/querypackagebypackageid", (req, res) => {
  Organization.find(
    { "OrgPackages._packageid": req.query.packageid },
    { "OrgPackages.$": 1 }
  )

    .then((data) => {
      res.json(data[0].OrgPackages[0]);
    })
    .catch((err) => {
      res.json({ err: err });
    });
});

router.get("/allpackages", (req, res) => {
  Organization.find({}, "OrgPackages", function (err, result) {
    if (err) {
      res.json(err);
    }

    var final = [];
    var finalobj = {};
    for (var i = 0; i < result.length; i++) {
      for (var j = 0; j < result[i].OrgPackages.length; j++) {
        final.push(result[i].OrgPackages[j]);
      }
    }

    for (var k = 0; k < final.length; k++) {
      finalobj[k] = final[k];
    }

    res.json(finalobj);
  });
});

router.delete("/deletepackage/:packageid", protect, async (req, res, next) => {
  Organization.findOneAndUpdate(
    { "OrgPackages._packageid": req.params.packageid },
    { $pull: { OrgPackages: { _packageid: req.params.packageid } } },
    { new: true }
  )
    .then((data) => {
      res.json("package data of corresponding packageid deleted successfully");
    })
    .catch((err) => {
      res.json({ err: err });
    });
});

router.get("/querypackagenamedetail", (req, res) => {
  Organization.find(
    { "OrgPackages.PackageName": req.query.packagename },
    { "OrgPackages.$": 1 }
  )

    .then((data) => {
      res.json(data[0].OrgPackages[0]);
    })
    .catch((err) => {
      res.json({ err: err });
    });
});

router.put("/updatepackage/:packageid", protect, (req, res) => {
  Organization.updateOne(
    { "OrgPackages._packageid": req.params.packageid },
    {
      $set: {
        "OrgPackages.$.PackageName":
          req.body.PackageName || "OrgPackages".PackageName,

        "OrgPackages.$.PackageDescription":
          req.body.PackageDescription || "OrgPackages".PackageDescription,

        "OrgPackages.$.PackageType":
          req.body.PackageType || "OrgPackages".PackageType,

        "OrgPackages.$.Thumbnail":
          req.body.Thumbnail || "OrgPackages".Thumbnail,

        "OrgPackages.$.ActualPrice":
          req.body.ActualPrice || "OrgPackages".ActualPrice,

        "OrgPackages.$.PortalPrice":
          req.body.PortalPrice || "OrgPackages".PortalPrice,

        "OrgPackages.$.OfferPrice":
          req.body.OfferPrice || "OrgPackages".OfferPrice,

        "OrgPackages.$.MaxPrice": req.body.MaxPrice || "OrgPackages".MaxPrice,

        "OrgPackages.$.Quantity": req.body.Quantity || "OrgPackages".Quantity,

        "OrgPackages.$.PaymentOption":
          req.body.PaymentOption || "OrgPackages".PaymentOption,

        "OrgPackages.$.PackageStatus":
          req.body.PackageStatus || "OrgPackages".PackageStatus,
      },
    },
    (err, result) => {
      if (err) {
        res.status(500).json({ error: "Unable to update OrgPackages" });
      } else {
        res.status(200).json(result);
      }
    }
  );
});

module.exports = router;
