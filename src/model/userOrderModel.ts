import mongoose from "mongoose";

const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      set: (value: string) => value.trim(),
    },

    razorPayId: {
      type: String,
      required: true,
      unique: true,
      set: (value: string) => value.trim(),
    },
    userName: {
      type: String,
      required: true,
    },
    userAddress: {
      type: String,
    },
    userPhoneNumber: {
      type: String,
    },
    userPin: {
      type: Number,
    },
    orderStatus: {
      type: String,
      enum: ["Accepted", "Processing", "Completed", "Cancelled"],
      default: "Accepted",
    },
    userOrder: [
      {
        productId: {
          type: String,
          required: true,
        },
        productName: {
          type: String,
          required: true,
        },
        productPrice: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ], // what is in request body
  },

  { collection: "orderDetail", timestamps: true }
);
export default mongoose.model("orderDetail", orderSchema);
