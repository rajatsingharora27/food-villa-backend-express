import { ObjectId } from 'mongoose';
export type UserWishList = {
  userId: string;
  email: string;
  wishlistItem: Array<string>;
};

export interface WishListOfUser {
  product: string;
  _id:ObjectId

};
