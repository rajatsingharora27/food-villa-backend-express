import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userCartDetailsSchema = new Schema(
  {
    userId: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
    },

    cartItem: [
      {
        productId: {
          type: String,
          ref: "productInfo", // Reference to the Product model
        },
        isPurchased: {
          type: Boolean,
          default: false,
        },
        quantity: {
          type: Number,
        },
        name: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("userCart", userCartDetailsSchema);
