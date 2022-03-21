const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Lead = require("../models/LeadsSchema");

const userSchema = new mongoose.Schema({
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

  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],

  cart: {
    items: [
      {
        packageId: {
          type: mongoose.Schema.Types.ObjectId,
          // ref: Package,
          required: true,
        },

        packageImage: String,
        packageName: String,
        packageOrgName: String,
        description: String,

        qty: {
          type: Number,
          required: true,
        },
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
          _leadid: mongoose.Schema.Types.ObjectId,
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
    walletitems: [
      {
        PatientReferWallet: {
          PatientRefer: String,
          PatientName: String,
        },

        PackageSaleWallet: {
          PackageSale: String,
          PatientName: String,
        },
      },
    ],

    WalletAmount: Number,
  },
});

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

userSchema.methods.addToCart = function (package) {
  let cart = this.cart;
  if (cart.items.length == 0) {
    cart.items.push({
      packageId: package._id,
      qty: 1,
      packageImage: package.image,
      packageName: package.PackageName,
      packageOrgName: package.OrgName,
      description: package.PackageDescription,
    });
    cart.totalPrice = Number(package.ActualPrice);
  } else {
    const isExisting = cart.items.findIndex((objInItems) => {
      return (
        new String(objInItems.packageId).trim() ===
        new String(package._id).trim()
      );
    });
    if (isExisting == -1) {
      cart.items.push({
        packageId: package._id,
        qty: 1,
        packageImage: package.image,
        packageName: package.PackageName,
        packageOrgName: package.OrgName,
        description: package.PackageDescription,
      });
      cart.totalPrice += package.ActualPrice;
    } else {
      existingPackageInCart = cart.items[isExisting];
      existingPackageInCart.qty += 1;
    }
    cart.totalPrice += package.ActualPrice;
  }

  return this.save();
};

userSchema.methods.addLead = function (leaddata) {
  let Leadsrefer = this.Leadsrefer;
  Leadsrefer.referedLeads.push({
    leadDetails: {
      _leadid: leaddata._leadid,
      PatientName: leaddata.PatientName,
      PatientAge: leaddata.PatientAge,
      PatientGender: leaddata.PatientGender,
      HospitalName: leaddata.HospitalName,
      PackageName: leaddata.PackageName,
    },
  });

  return this.save();
};

userSchema.methods.addWallet = function (referdata) {
  let wallet = this.wallet;
  wallet.walletitems.push({
    PatientReferWallet: {
      PatientRefer: "date",
      PatientName: "referdata.PatientName",
    },

    walletAmount: 500,
  });

  return this.save();
};

userSchema.methods.removeFromCart = function (cartdata) {
  const cart = this.cart;
  cartId = cartdata._id;
  const isExisting = cart.items.findIndex(
    (objInItems) =>
      new String(objInItems.cartId).trim() === new String(cartId).trim()
  );

  if (isExisting >= 0) {
    cart.items.splice(isExisting, 1);
    return this.save();
  }
};

userSchema.methods.addPatientRefer = function (referalDetails) {
  let Patientrefer = this.Patientrefer;
  Patientrefer.items.push({
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
