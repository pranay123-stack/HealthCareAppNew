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
    .catch((err) => console.log(err));

  res.json("added");
});

router.get("/getcart", protect, (req, res) => {
  let user = req.user;
  user
    .populate("cart.items._packageid")

    .then((user) => {
      res.json({ cart: user.cart });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.delete("/deleteIncart", protect, (req, res) => {
  const _packageid = req.query.packageid;
  req.user.removeFromCart(_packageid);
  res.json("removed");
});

// checkout razorpay payment gateway

module.exports = router;
