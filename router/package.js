// Creating a package
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
  const _packageid = req.query.packageid;

  Organization.findOne({ "packages._packageid": _packageid }, (err, docs) => {
    if (err) throw err;

    res.json({
      OrgName: docs.OrgName,
      OrgPackages: docs.OrgPackages,
      // OrgPackages: docs.OrgPackages[1],

      // PackageName: docs.OrgPackages.PackageName,
      // PackageType: docs.OrgPackages.PackageType,
      // PackageDescription: docs.OrgPackages.PackageDescription,
      // image: docs.OrgPackages.image,
      // ActualPrice: docs.OrgPackages.ActualPrice,
      // PortalPrice: docs.OrgPackages.PortalPrice,
    });
  });
});

router.delete("/deletepackage/:packageid", protect, async (req, res, next) => {
  const _id = req.params.packageid;
  try {
    const result = await Organization.findOneAndDelete({ _packageid: _id });
    res.status(200).json({ message: "Deleted successfully", result });
    next();
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.put("/updatepackage/:packageid", protect, async (req, res, next) => {
  try {
    const _id = req.params.packageid;
    const updates = req.body;
    const options = { new: true };

    const result = await Organization.findOneAndUpdate(
      { "packages._packageid": _id },
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
