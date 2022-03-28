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

    cart: {
      cartitems: [
        {
          PackageDetails: {
            _packageid: mongoose.Schema.Types.ObjectId,
            packageImage: String,
            packageName: String,
            packageDescription: String,
            ActualPrice: Number,
            OfferPrice: Number,
            packageqty: Number,
          },

          PriceDetails: {
            packageqty: Number,
            ActualPrice: Number,
            Discount: Number,
            SellingPrice: Number,
            TotalPrice: Number,
          },
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
          leadDetails: {
            PatientName: String,
            PatientAge: Number,
            PatientGender: String,
            HospitalName: String,
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
  var OfferPrice = cartdata.OfferPrice;
  var ActualPrice = cartdata.ActualPrice;
  var Discount;
  var SellingPrice;

  if (cart.cartitems.length == 0) {
    cart.cartitems.push({
      PackageDetails: {
        _packageid: cartdata._packageid,
        packageqty: 1,
        packageImage: cartdata.image,
        packageName: cartdata.PackageName,
        packageDescription: cartdata.PackageDescription,
        ActualPrice: cartdata.ActualPrice,
        OfferPrice: cartdata.OfferPrice,
      },

      PriceDetails: {
        ActualPrice: ActualPrice,
        packageqty: 1,
        Discount: ActualPrice - OfferPrice,
      },
    });
  } else {
    const isExisting = cart.cartitems.find((objInItems) => {
      return (
        new String(objInItems._packageid).trim() ===
        new String(cartdata._packageid).trim()
      );
    });
    if (isExisting == -1) {
      cart.cartitems.push({
        PackageDetails: {
          _packageid: cartdata._packageid,
          packageqty: 1,
          packageImage: cartdata.image,
          packageName: cartdata.PackageName,
          packageDescription: cartdata.PackageDescription,
          ActualPrice: cartdata.ActualPrice,
          OfferPrice: cartdata.OfferPrice,
        },

        PriceDetails: {
          ActualPrice: cartdata.ActualPrice,
          packageqty: 1,
          Discount: ActualPrice - OfferPrice,
        },
      });
    } else {
      existingPackageInCart = cart.cartitems;

      console.log(existingPackageInCart);

      // existingPackageInCart.packageqty += 1;
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
    var newcart = cart.items[0];
    var Price = newcart.ActualPrice;

    if (newcart.qty == 1) {
      cart.items.splice(isExisting, 1);
    } else {
      newcart.qty = newcart.qty - 1;

      cart.totalPrice -= Price;
    }

    return this.save();
  }
};

userSchema.methods.addLead = function (leaddata) {
  let Leadsrefer = this.Leadsrefer;
  Leadsrefer.referedLeads.push({
    leadDetails: {
      PatientName: leaddata.PatientName,
      PatientAge: leaddata.PatientAge,
      PatientGender: leaddata.PatientGender,
      HospitalName: leaddata.HospitalName,
      PackageName: leaddata.PackageName,
    },
  });

  return this.save();
};

userSchema.methods.addPatientRefer = function (referaldetails) {
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
  // var file = req.files.image;

  return this.save();
};

const User = mongoose.model("User", userSchema);

module.exports = User;
