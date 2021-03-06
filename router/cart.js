const express = require("express");
const router = express.Router();
const Organization = require("../models/OrganizatioSchema");
const { protect } = require("../middleware/authMiddleware");

router.post("/addcart", protect, (req, res) => {
  let user = req.user;

  Organization.find(
    { "OrgPackages._packageid": req.query.packageid },
    { "OrgPackages.$": 1 }
  )
    .then((data) => {
      const cartdata = data[0].OrgPackages[0];
      user.addToCart(cartdata);
    })
    .catch((err) => res.json({ error: err }));

  res.json("added successfully to cart");
});

router.get("/getcart", protect, (req, res) => {
  let user = req.user;

  user
    .populate("cart.items._packageid")

    .then((user) => {
      res.json({ cart: user.cart });
    })
    .catch((err) => {
      res.json({ err: err });
    });
});

router.delete("/deleteIncart", protect, (req, res) => {
  req.user.removeFromCart(req.query.packageid);
  res.json("removed from cart");
});

router.get("/checkoutcart", protect, (req, res) => {
  res.json({ cart: req.user.cart });
});

router.post("/pay", protect, (req, res) => {
  res.json({ message: "payment done successfully throgh COD" });
});

module.exports = router;
