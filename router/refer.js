const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/UserSchema");
const Lead = require("../models/LeadsSchema");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "pranay-gaurav",
  api_key: "949454261729874",
  api_secret: "o_CrJsRu7RG-FRyDBbDGj2o7J8I",
});

//refer route
router.post("/patientrefer", protect, (req, res) => {
  let user = req.user;

  if (req.files) {
    let file = req.files.uploadDocument;
    cloudinary.uploader
      .upload(file.tempFilePath, (err, uploadresult) => {
        let detail = req.body;

        let referaldetail = {
          data: detail,
          image: uploadresult.url,
        };

        var referedpatientdetails = {
          PatientName: referaldetail.data.PatientName,
          PatientAge: referaldetail.data.PatientAge,
          PatientGender: referaldetail.data.PatientGender,
          PatientAttendentName: referaldetail.data.PatientAttendentName,
          PatientMobileNumber: referaldetail.data.PatientMobileNumber,
          OrgType: referaldetail.data.OrgType,
          OrgName: referaldetail.data.OrgName,
          ServiceType: referaldetail.data.ServiceType,
          Description: referaldetail.data.Description,
          uploadDocument: referaldetail.image,
        };

        user
          .addPatientRefer(referaldetail)
          .then((doc) => {
            res.json({ "added successfully": referedpatientdetails });
          })
          .catch((err) => {
            res.json(err);
          });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  } else {
    let details = req.body;

    let referaldetails = {
      data: details,
    };

    let referedpatientdetails = {
      PatientName: referaldetails.data.PatientName,
      PatientAge: referaldetails.data.PatientAge,
      PatientGender: referaldetails.data.PatientGender,
      PatientAttendentName: referaldetails.data.PatientAttendentName,
      PatientMobileNumber: referaldetails.data.PatientMobileNumber,
      OrgType: referaldetails.data.OrgType,
      OrgName: referaldetails.data.OrgName,
      ServiceType: referaldetails.data.ServiceType,
      Description: referaldetails.data.Description,
    };

    user
      .addPatientRefer(referaldetails)
      .then((doc) => {
        res.json({
          "added successfully withot uploading": referedpatientdetails,
        });
      })
      .catch((err) => {
        res.json(err);
      });
  }
});

router.get("/patientsrefered/:userid", (req, res) => {
  const _userid = req.params.userid;
  User.find({ _userid: _userid })
    .then((userdata) => {
      var data = userdata[0];
      var result = data.Patientsrefer;

      res.json(result);
    })
    .catch((err) => {
      console.error(err);
    });
});

router.post("/leadsrefer", protect, (req, res) => {
  Lead.find({ _leadid: req.query.leadid }, { _id: 0 })
    .then((leaddata) => {
      var referdata = leaddata[0];
      req.user
        .addLeadRefer(referdata)
        .then((doc) => {
          res.json(leaddata[0]);
        })
        .catch((err) => {
          res.json(err);
        });
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get("/leadsrefered/:userid", (req, res) => {
  const _userid = req.params.userid;
  User.find({ _userid: _userid }, { _id: 0 })
    .then((userdata) => {
      var data = userdata[0];
      var result = data.Leadsrefer;
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
    });
});

module.exports = router;
