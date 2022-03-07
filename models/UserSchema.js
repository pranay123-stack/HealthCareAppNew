const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Package = require("../models/PackageSchema");

const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
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

  type: {
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
          ref: Package,
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

userSchema.methods.removeFromCart = function (packageId) {
  const cart = this.cart;
  const isExisting = cart.items.findIndex(
    (objInItems) =>
      new String(objInItems.packageId).trim() === new String(packageId).trim()
  );

  if (isExisting >= 0) {
    cart.items.splice(isExisting, 1);
    return this.save();
  }
};
const User = mongoose.model("User", userSchema);

module.exports = User;
