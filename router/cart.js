const express = require("express");
const router = express.Router();
const Package = require("../models/PackageSchema");
const { protect } = require("../middleware/authMiddleware");

router.get("/cart", (req, res) => {
  res.json({ message: "error" });
});

router.post("/addcart/:packageid", protect, (req, res, next) => {
  let user = req.user;
  const _packageid = req.params.packageid;
  console.log(_packageid);
  Package.findById(_packageid)
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

router.post("/deletecart", protect, (req, res) => {
  let user = req.user;

  user
    .removeFromCart(req.body.packageId)
    .then(() => res.json({ message: "removed from cart" }))
    .catch((err) => console.log(err));
});

module.exports = router;
