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
  Organization.find(
    { "OrgPackages._packageid": req.query.packageid },
    { "OrgPackages.$": 1 }
  )

    .then((data) => {
      const newData = data[0];
      const finalData = newData.OrgPackages[0];
      res.json(finalData);
    })
    .catch((err) => {
      res.json({ err: err });
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

// Update package Route
router.put("/updatepackage/:packageid", (req, res) => {
  var updates = req.body;
  var options = { new: true };

  Organization.findOneAndUpdate(
    { "OrgPackages._packageid": req.params.packageid },

    updates,
    options,

    function (err, result) {
      if (err) {
        return err;
      }
      res.json(result);
    }
  );
});

module.exports = router;
