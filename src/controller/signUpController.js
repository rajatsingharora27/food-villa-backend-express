const {UsertSignUp} =require("../service/index")
const {StatusCodes}=require("http-status-codes")
const { v4: uuidv4 } = require('uuid');

const refid=uuidv4();
class SignUpController {

  userSignUp = new UsertSignUp();

  addNewUser = async (req, res) => {
    try {
      console.log(refid);
      const userSignUp= await this.userSignUp.userSignup(req.body);
      console.log(userSignUp)
      return res.status(StatusCodes.OK).json({
        refid:refid,
        message:userSignUp.message,
        data:{},
        error:userSignUp.errorList
      })
    } catch (ex) {
      console.log(ex)
    }
  };
}

module.exports = SignUpController;
