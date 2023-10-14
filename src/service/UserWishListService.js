const { FALSE } = require("../constants/applicationConstants");
const userWishListModel = require("../model/userWishListModel");
const wishListModel =require("../model/userWishListModel")


class UserWishListService {

    addToWishList =async (req,res,refId)=>{
        try{
            //check if user is present in whish list model
           const userWishlistDetails= await wishListModel.findOne({email:req.emailId});
           console.log(userWishlistDetails)
           if(userWishlistDetails==null){
            const userWishListData ={
                userId:"12345",
                email:req.emailId,
                wishlistItem:[
                    {
                        product:req.productId,
                        isPurchased:FALSE
                    }
                ]
            }
            const userwishList=await userWishListModel.create(userWishListData);
            userwishList.save();

            console.log(req);
            console.log(res.userData)
            
           }else{
            console.log(userWishlistDetails.wishlistItem)
            const currentWishListItemsUserHave=userWishlistDetails.wishlistItem;
            console.log(currentWishListItemsUserHave)
            currentWishListItemsUserHave.push({
                
                    product:req.productId,
                    isPurchased:FALSE
                
            })
            console.log(currentWishListItemsUserHave)
            const update = {
                $set: {
                    product: currentWishListItemsUserHave
                },
              };
              
                userWishlistDetails.wishlistItem=currentWishListItemsUserHave;
                const data=await userWishListModel.updateOne({userId:"12345"} , update);
                data.save();
                console.log(data);


           }
            //if not 
                //add the product in wishlistItem field of schema
            //if the size of wishlistItem becomse zero remove user from the wishlist table
        }catch(ex){
            console.log(ex);
        }
    }


}

module.exports=UserWishListService;