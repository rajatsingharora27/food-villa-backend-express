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


export interface C_W_ProdcutAdd{
  email:string,
  productId:string,
  cartOrWishlist:string,
  token:string

}

export interface JwtTokenType{
  data:{
    userName:string,
    email:string,
    role:string,
  },
  iat:number,
  exp:number,
}