const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
    },

    cart: {
      items: [
        {
          _packageid: mongoose.Schema.Types.ObjectId,
          packageImage: String,
          packageName: String,
          packagedescription: String,
          qty: Number,
        },
      ],

      totalPrice: Number,
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
            OrganizationCategory: String,
            HospitalName: String,
            ServiceType: String,
            Description: String,
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
  if (cart.items.length == 0) {
    cart.items.push({
      _packageid: cartdata._packageid,
      qty: 1,
      packageImage: cartdata.image,
      packageName: cartdata.PackageName,
      packagedescription: cartdata.PackageDescription,
    });
    cart.totalPrice = Number(cartdata.ActualPrice);
  } else {
    const isExisting = cart.items.findIndex((objInItems) => {
      return (
        new String(objInItems._packageid).trim() ===
        new String(cartdata._packageid).trim()
      );
    });
    if (isExisting == -1) {
      cart.items.push({
        _packageid: cartdata._packageid,
        qty: 1,
        packageImage: cartdata.image,
        packageName: cartdata.PackageName,
        packagedescription: cartdata.PackageDescription,
      });
      cart.totalPrice += cartdata.ActualPrice;
    } else {
      existingPackageInCart = cart.items[isExisting];
      existingPackageInCart.qty += 1;
    }
    cart.totalPrice += cartdata.ActualPrice;
  }

  return this.save();
};

userSchema.methods.removeFromCart = function (_packageid) {
  let cart = this.cart;
  const isExisting = cart.items.findIndex(
    (objInItems) =>
      new String(objInItems._packageid).trim() === new String(_packageid).trim()
  );
  if (isExisting >= 0) {
    cart.items.splice(isExisting, 1);
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

userSchema.methods.addPatientRefer = function (referalDetails) {
  let Patientsrefer = this.Patientsrefer;
  Patientsrefer.referedPatients.push({
    referalDetails: {
      PatientName: referalDetails.PatientName,
      PatientAge: referalDetails.PatientAge,
      PatientGender: referalDetails.PatientGender,
      PatientAttendentName: referalDetails.PatientAttendentName,
      PatientMobileNumber: referalDetails.PatientMobileNumber,
      OrganizationCategory: referalDetails.OrganizationCategory,
      HospitalName: referalDetails.HospitalName,
      ServiceType: referalDetails.ServiceType,
      Description: referalDetails.Description,
    },
  });

  return this.save();
};

const User = mongoose.model("User", userSchema);

module.exports = User;
