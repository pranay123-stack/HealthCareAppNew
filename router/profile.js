const express = require("express");
const router = express.Router();
const User = require("../models/UserSchema");
const { protect } = require("../middleware/authMiddleware");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "pranay-gaurav",
  api_key: "949454261729874",
  api_secret: "o_CrJsRu7RG-FRyDBbDGj2o7J8I",
});

router.put("/profile", protect, (req, res) => {
  let user = req.user;
  const file = req.files.image;

  cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
    User.findOne({ _userid: user.userid }, function (err, user) {
      if (err) return false;

      (user.firstname = req.body.firstname || user.firstname),
        (user.lastname = req.body.lastname || user.lastname),
        (user.gender = req.body.gender || user.gender),
        (user.phone = req.body.phone || user.phone),
        (user.email = req.body.email || user.email),
        (user.Status = req.body.Status || user.Status),
        (user.OrgName = req.body.OrgName || user.OrgName),
        (user.usertype = req.body.usertype || user.usertype),
        (user.password = req.body.password || user.password);
      user.image = result.url || user.image;

      user.save().then((user) => {
        var updateuser = {
          firstname: user.firstname,
          lastname: user.lastname,
          gender: user.gender,
          phone: user.phone,
          usertype: user.usertype,
          OrgName: user.OrgName,
          email: user.email,
          Status: user.Status,
          image: user.image,
        };

        res.json(updateuser);
      });
    });
  });
});

module.exports = router;
