const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    cartItems: [
      {
        package: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Package",
          required: true,
        },
        quantity: { type: Number, default: 1 },
        price: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", CartSchema);

module.exports = Cart;
