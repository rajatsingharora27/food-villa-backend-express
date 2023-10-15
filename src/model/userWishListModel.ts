// import mongoose from "mongoose";

// const Schema = mongoose.Schema;

// const wishListSchema = Schema(
//   {
//     userId: {
//       type: String,
//       unique: true,
//     },
//     email: {
//       type: String,
//       unique: true,
//     },
//     wishlistItem: [
//       {
//         product: {
//           type: String,
//           ref: "productInfo", // Reference to the Product model
//           isPurchased:{
//             type:Boolean,
//             default:false,
//           }
//         },
//       },
//     ],
//   },
//   {
//     timestamps: true,
//   }
// );

//  export default mongoose.model("userWishlist", wishListSchema);

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const wishListSchema = new Schema(
  {
    userId: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
    },
    wishlistItem: [
      {
        product: {
          type: String,
          ref: "productInfo", // Reference to the Product model
          isPurchased: {
            type: Boolean,
            default: false,
          },
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("userWishlist", wishListSchema);
