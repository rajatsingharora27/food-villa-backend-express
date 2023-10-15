// const { false, true } = require("../constants/applicationConstants");
import  userWishListModel from "../model/userWishListModel";
// const wishListModel = require("../model/userWishListModel");
import log from "../config/logger";
// const { PRODUCT_ADDED_TO_WISH_LIST_0004_2, PRODUCT_ADDED_TO_WISH_LIST_0004_1 } = require("../constants/informationaMessage");

class UserWishListService {
  addToWishList = async (req:any, userDetailsFromUserInfoModel:any, refId:string) => {
    let errorList:Array<String>=[];
    try {
      //check if user is present in whish list model
      log.info(`{addToWishList() method started refId: ${refId}}`);

      //Finding the user from "userWishlists" database
      const userWishlistDetails = await userWishListModel.findOne({
        email: req.emailId,
      });
     

      //If user if not prent in "userWishlists" database
      //and user request to store in wish list
      //make the new user in table and store the user with product id relation
      if (userWishlistDetails == null) {
        log.info(`User not prenset in "userWishlists" table refId:${refId}`)
        const userWishListData = {
          userId: userDetailsFromUserInfoModel?.userData?.user?.userId,
          email: req.emailId,
          wishlistItem: [
            {
              product: req.productId,
              isPurchased: false,
            },
          ],
        };
        const userwishList = await userWishListModel.create(userWishListData);
        userwishList.save();
        log.info(`User created and saved in "userWishlists" table refId:${refId}`)
      }
      //If already presnt then update the wishlist coloßum
      else {
        const currentWishListItemsUserHave = userWishlistDetails.wishlistItem;
       
        //it that product is already prent in wish list remove that product
        let listOfItemsToBeAddedInWishList = [];

        const listIfItemIsAlreadyThere = currentWishListItemsUserHave.filter(
          (item) => item.product != req.productId
        );
        if (
          listIfItemIsAlreadyThere.length !==
          currentWishListItemsUserHave.length
        ) {
          // it the list of wishlist product and filted item are not same
          //means user wants to remove from wish list
          listOfItemsToBeAddedInWishList = listIfItemIsAlreadyThere;
        } else {
          //new item is there to be added in wishList
          currentWishListItemsUserHave.push({
            product: req.productId,
            //@ts-ignore
            isPurchased: false,
          });
          listOfItemsToBeAddedInWishList=currentWishListItemsUserHave;
        }
        // userWishlistDetails.wishlistItem = currentWishListItemsUserHave;
        await userWishlistDetails.updateOne({
          wishlistItem: listOfItemsToBeAddedInWishList,
        });
        log.info(`Product added to the wishlist  productId:${req.productId} , refId:${refId}`)
      }
      return {
        isValid: true,
        errorList: errorList,
        message: [
           "wishList updated"
        ],
        error:[]
      };
    }catch(ex){
        log.error(`Excption occurred  {addToWishList()} refId:${refId} , ex:${ex}`)
        return {
            isValid: false,
            errorList: errorList,
            message: [
               "Product cannot be adde to wishlist"
            ],
            error:[ex]
          };
    }
     
  };
}

export default UserWishListService;
