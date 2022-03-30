const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "pranay-gaurav",
  api_key: "949454261729874",
  api_secret: "o_CrJsRu7RG-FRyDBbDGj2o7J8I",
});

const userSchema = new mongoose.Schema(
  {
    _userid: { type: mongoose.Schema.Types.ObjectId },

    firstname: {
      type: String,
      required: true,
    },

    lastname: {
      type: String,
      required: true,
    },

    gender: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    usertype: {
      type: String,
      required: true,
    },

    phone: {
      type: Number,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    OrgName: {
      type: String,
      ref: "Organization",
    },

    Status: {
      type: String,
      enum: ["Active", "InActive"],
      default: "Active",
    },

    cart: {
      items: [
        {
          _packageid: mongoose.Schema.Types.ObjectId,
          packageImage: String,
          packageName: String,
          packageDescription: String,
          ActualPrice: Number,
          OfferPrice: Number,
          packageqty: Number,
          Discount: Number,
          SellingPrice: Number,
          Total: Number,
        },
      ],
    },

    Patientsrefer: {
      referedPatients: [
        {
          referalDetails: {
            PatientName: String,
            PatientAge: Number,
            PatientGender: String,
            PatientAttendentName: String,
            PatientMobileNumber: Number,
            OrgType: { type: String, ref: "Organization" },
            OrgName: { type: String, ref: "Organization" },
            ServiceType: String,
            Description: String,
            uploadDocument: String,
          },
        },
      ],
    },

    Leadsrefer: {
      referedLeads: [
        {
          referalDetails: {
            _leadid: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },
            PatientName: String,
            PatientAge: Number,
            PatientGender: String,
            OrgName: { type: String, ref: "Organization" },
            PackageName: String,
          },
        },
      ],
    },

    wallet: {
      PaymentHistory: {
        PatientsRefered: [
          {
            PatientDetails: {
              // details of patient
            },

            PatientReferEarnedAmount: {
              type: Number,
            },
          },
        ],

        PackagesSold: [
          {
            PackageDetails: {
              // package details
            },

            PackageSaleEarnedAmount: {
              type: Number,
            },
          },
        ],

        LeadsRefered: [
          {
            LeadDetails: {
              // details of lead
            },

            LeadReferEarnedAmount: {
              type: Number,
            },
          },
        ],
      },

      AvailableBalance: {
        // total of  PackageSaleEarnedAmount +   PatientReferEarnedAmount + LeadsreferEarned
        type: Number,
      },
    },

    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true },
  { versionKey: true }
);

userSchema.pre("save", async function save(next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

userSchema.methods.generateAuthToken = async function () {
  try {
    let newtoken = jwt.sign({ _id: this._id }, process.env.SECRET_KEY, {
      expiresIn: "3000s",
    });
    this.tokens = this.tokens.concat({ token: newtoken });
    await this.save();
    return newtoken;
  } catch (err) {
    console.log(err);
  }
};

userSchema.methods.addToCart = function (cartdata) {
  let cart = this.cart;

  if (cart.items.length == 0) {
    let Discount = cartdata.ActualPrice - cartdata.OfferPrice;
    let SellingPrice = cartdata.ActualPrice - Discount;
    cart.items.push({
      _packageid: cartdata._packageid,
      packageqty: 1,
      packageImage: cartdata.image,
      packageName: cartdata.PackageName,
      packageDescription: cartdata.PackageDescription,
      OfferPrice: cartdata.OfferPrice,
      ActualPrice: cartdata.ActualPrice,
      SellingPrice: SellingPrice,
      Discount: Discount,
      Total: SellingPrice,
    });
  } else {
    const isExisting = cart.items.findIndex((objInItems) => {
      return (
        new String(objInItems._packageid).trim() ===
        new String(cartdata._packageid).trim()
      );
    });
    if (isExisting == -1) {
      let Discount = cartdata.ActualPrice - cartdata.OfferPrice;
      let SellingPrice = cartdata.ActualPrice - Discount;

      cart.items.push({
        _packageid: cartdata._packageid,
        packageqty: 1,
        packageImage: cartdata.image,
        packageName: cartdata.PackageName,
        packageDescription: cartdata.PackageDescription,
        OfferPrice: cartdata.OfferPrice,
        ActualPrice: cartdata.ActualPrice,
        SellingPrice: SellingPrice,
        Discount: Discount,
        Total: SellingPrice,
      });
    } else {
      existingPackageInCart = cart.items[isExisting];

      existingPackageInCart.packageqty += 1;

      existingPackageInCart.Total += existingPackageInCart.SellingPrice;
    }
  }

  return this.save();
};

userSchema.methods.removeFromCart = function (packageid) {
  let cart = this.cart;
  const isExisting = cart.items.findIndex(
    (objInItems) =>
      new String(objInItems._packageid).trim() === new String(packageid).trim()
  );
  if (isExisting >= 0) {
    existingPackageInCart = cart.items[isExisting];
    if (existingPackageInCart.packageqty == 1) {
      cart.items.splice(isExisting, 1);
    } else {
      existingPackageInCart = cart.items[isExisting];

      existingPackageInCart.packageqty -= 1;

      existingPackageInCart.Total -= existingPackageInCart.SellingPrice;
    }

    return this.save();
  }
};

userSchema.methods.addLeadRefer = function (referdata) {
  let Leadsrefer = this.Leadsrefer;
  Leadsrefer.referedLeads.push({
    referalDetails: {
      _leadid: referdata._leadid,
      PatientName: referdata.PatientName,
      PatientAge: referdata.PatientAge,
      PatientGender: referdata.PatientGender,
      OrgName: referdata.OrgName,
      PackageName: referdata.PackageName,
    },
  });

  return this.save();
};

userSchema.methods.addPatientRefer = function (referaldetails) {
  if (referaldetails.image) {
    let Patientsrefer = this.Patientsrefer;
    Patientsrefer.referedPatients.push({
      referalDetails: {
        PatientName: referaldetails.data.PatientName,
        PatientAge: referaldetails.data.PatientAge,
        PatientGender: referaldetails.data.PatientGender,
        PatientAttendentName: referaldetails.data.PatientAttendentName,
        PatientMobileNumber: referaldetails.data.PatientMobileNumber,
        OrgType: referaldetails.data.OrgType,
        OrgName: referaldetails.data.OrgName,
        ServiceType: referaldetails.data.ServiceType,
        Description: referaldetails.data.Description,
        uploadDocument: referaldetails.image,
      },
    });
  } else {
    let Patientsrefer = this.Patientsrefer;
    Patientsrefer.referedPatients.push({
      referalDetails: {
        PatientName: referaldetails.data.PatientName,
        PatientAge: referaldetails.data.PatientAge,
        PatientGender: referaldetails.data.PatientGender,
        PatientAttendentName: referaldetails.data.PatientAttendentName,
        PatientMobileNumber: referaldetails.data.PatientMobileNumber,
        OrgType: referaldetails.data.OrgType,
        OrgName: referaldetails.data.OrgName,
        ServiceType: referaldetails.data.ServiceType,
        Description: referaldetails.data.Description,
      },
    });
  }

  // var file = req.files.image;

  return this.save();
};

const User = mongoose.model("User", userSchema);

module.exports = User;
