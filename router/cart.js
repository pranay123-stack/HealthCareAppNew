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
  let user = req.user;
  var _packageid = req.query.packageid;
  user
    .removeFromCart(_packageid)
    .then(() => {
      res.json({ removed: _packageid });
    })
    .catch((err) => {
      res.json(err);
    });
});

module.exports = router;
