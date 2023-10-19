import jwt from "jsonwebtoken";
import { C_W_ProdcutAdd, JwtTokenType } from "../Types/WislistType";
import { VerifyCallback } from "jsonwebtoken";
import log from "../config/logger";
import { reddis } from "../config/redisConfig";
import userWishListModel from "../model/userWishListModel";

class AddProductToCartOrWishListService {
  addProduct = async(inputRequest: C_W_ProdcutAdd, refId: string) => {
    if (process.env.JWT_SECRET !== undefined) {
      const decode : JwtTokenType | any= jwt.verify(inputRequest.token, process.env.JWT_SECRET);
      if(decode){
        if(decode.exp > Math.floor(Date.now() / 1000)){
            console.log(decode.data);
            
            const userEmail=decode.data.email;
            if(){
                // in redis logic to add here in wish list
            }else{
                // const userWishlistDetails = await userWishListModel.findOne({
                //     email: userEmail,
                //   });


                // check in database and add in redis
                // and do further operations
            }


            
            //not expired token
            // const userInCasche=reddis.get()

        }
      }
      console.log("service == >", decode);
    }
  };
}
export default AddProductToCartOrWishListService;
