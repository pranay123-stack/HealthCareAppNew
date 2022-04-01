const express = require("express");
const router = express.Router();

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "pranay-gaurav",
  api_key: "949454261729874",
  api_secret: "o_CrJsRu7RG-FRyDBbDGj2o7J8I",
});

router.post("/profile", protect, (req, res) => {
  const file = req.files.image;

  cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
    var detail = {
      _packageid: new mongoose.Types.ObjectId(),
      OrgName: req.body.OrgName,
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
          detail["OrgName"] = req.body.OrgName;
          res.json({
            message: "Package added successfully",
            createdPackage: detail,
          });
        }
      }
    );
  });
});
