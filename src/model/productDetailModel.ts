import mongoose from "mongoose";

const Schema = mongoose.Schema;

const productDetailSchema = new Schema(
  {
    productId: {
      type: String,
      required: true,
      unique: true,
    },

    productName: {
      type: String,
      required: true,
      unique: true,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    tagLine: {
      type: String,
    },
    inventory: {
      type: Number,
      required: true,
      default: 0,
    },
    inStock: {
      type: Boolean,
      required: true,
    },
    productCategory: {
      type: String,
    },
    productDetails: {
      storageAndConsumption: { type: String },
      ingredients: { type: String },
      allergens: { type: String },
    },
    festiveTag: {
      type: String,
      required: true,
    },
  },

  { collection: "productInfo", timestamps: true }
);
export default mongoose.model("productInfo", productDetailSchema);