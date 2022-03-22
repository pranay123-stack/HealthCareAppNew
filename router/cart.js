const express = require("express");
const router = express.Router();
const Organization = require("../models/OrganizatioSchema");

const { protect } = require("../middleware/authMiddleware");

router.post("/addtocart", protect, (req, res, next) => {
  let user = req.user;

  Organization.find(
    { "OrgPackages._packageid": req.query.packageid },
    { "OrgPackages.$": 1 }
  )
    .then((data) => {
      const cartdata = data[0].OrgPackages[0];
      user.addToCart(cartdata);
    })
    .catch((err) => console.log(err));

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
