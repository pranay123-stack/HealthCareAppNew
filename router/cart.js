const express = require("express");
const router = express.Router();
const Organization = require("../models/OrganizatioSchema");
// const Package = require("../models/PackageSchema");
const { protect } = require("../middleware/authMiddleware");

router.post("/addtocart/:packageid", protect, (req, res, next) => {
  let user = req.user;
  const _packageid = req.params.packageid;

  Organization.findById(_packageid)
    .then((package) => {
      user.addToCart(package);
    })
    .catch((err) => console.log(err));

  res.json("added");

  next();
});

router.get("/getcart", protect, (req, res) => {
  let user = req.user;
  user
    .populate("cart.items.packageId")

    .then((user) => {
      console.log(user);
      res.json({ cart: user.cart });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.delete("/deletecart", protect, (req, res) => {
  let user = req.user;
  const { cartid } = req.query;
  const { cart } = user;
  cart
    .findById(cartid)
    .then((cartdata) => {
      user.removeFromCart(cartdata);
    })
    .catch((err) => {
      res.json(err);
    });

  res.json("deleted cart");
});

module.exports = router;
