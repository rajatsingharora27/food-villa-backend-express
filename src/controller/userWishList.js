 const { UserWishListService } = require("../service/index");
const { StatusCodes } = require("http-status-codes");
const { v4: uuidv4 } = require("uuid");
const log = require("../config/logger");

const refid = uuidv4();
class WishListController {  
  userWishList = new UserWishListService();

  addToUserWishList = async (req, res) => {
    try {
      log.info(`{addToUserWishList()} started ,refID:${refid}`);
      const userSignUp = await this.userWishList.addToWishList(req.body, res, refid);
      return res.status(StatusCodes.OK).json({
        refid: refid,
        message: userSignUp.message,
        data: userSignUp.token,
        error: userSignUp.errorList,
      });
    } catch (ex) {
      log.error(`Excption occurred in {addToUserWishList()} refId:${refid} ex:${ex}`);
    }
  };
}

module.exports = WishListController;
