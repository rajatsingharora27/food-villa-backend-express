import logger from "../config/logger";
import cartUserModel from "../model/cartUserModel";
import userSignModel from "../model/userSignModel";
import userWishListModel from "../model/userWishListModel";

class DeleteRegisteredUserService {
  deleteUser = async (userEmailId: string, refId: string) => {
    logger.info(`class : {{DeleteRegisteredUserService}} started the function {deleteUser} , refId: ${refId}`);

    try {
      const [userDelete, userCartDelete, userWishListDelet] = await Promise.all([
        this.deleteUserFormDb(userEmailId),
        this.deleteCart(userEmailId),
        this.deleteWishList(userEmailId),
      ]);
      logger.info(`user ${userEmailId}  deleted successfully`);
      return {
        refId,
        message: [`user ${userEmailId}  deleted successfully`],
        data: {},
      };
    } catch (ex) {
      logger.error(`Exception occurred in {deleteUser} , refId: ${refId}, ex:${ex}`);
    }
  };

  async deleteWishList(userEmailId: string) {
    await userWishListModel.deleteOne({ email: userEmailId });
  }
  async deleteUserFormDb(userEmailId: string) {
    await userSignModel.deleteOne({ email: userEmailId });
  }
  async deleteCart(userEmailId: string) {
    await cartUserModel.deleteOne({ email: userEmailId });
  }
}

export default DeleteRegisteredUserService;
