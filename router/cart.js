const express = require("express");
const router = express.Router();
const Cart = require("../models/CartSchema");

const { protect } = require("../middleware/authMiddleware");

router.post("/user/cart/addtocart", protect, (req, res, next) => {
  res.json({ message: "user" });
  // Cart.findOne({ user: req.user._id }).exec((err, cart) => {
  //   if (err) return res.status(400).json({ err });
  //   if (cart) {
  //     const item = cart.cartItems.find(
  //       (c) => c.package == req.body.cartItems.package
  //     );

  //     if (item) {
  //       Cart.findOneAndUpdate(
  //         { user: req.user._id, "cartItems.product": product },
  //         {
  //           $set: {
  //             cartItems: {
  //               ...req.body.cartItems,
  //               quantity: item.quantity + req.body.cartItems.quantity,
  //             },
  //           },
  //         }
  //       );
  //     } else {
  //       Cart.findOneAndUpdate(
  //         { user: req.user._id },
  //         {
  //           $push: {
  //             cartItems: req.body.cartItems,
  //           },
  //         }
  //       );
  //     }
  //   } else {
  //     const cart = new Cart({
  //       user: req.user._id,
  //       cartItems: [req.body.cartItems],
  //     });

  //     cart.save((error, cart) => {
  //       if (error) return res.status(400).json({ error });
  //       if (cart) {
  //         return res.status(200).json({ cart });
  //       }
  //     });
  //   }
  // });
});

module.exports = router;
