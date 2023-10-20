// import userSignupModel from "../model/userSignModel";
// import StatusCodes from "http-status-codes";
// import { v4 as uuidv4 } from "uuid";
// import log from "../config/logger";
// import {
//   USER_NOT_FOUND_0010_1,
//   USER_NOT_FOUND_0010_2,
// } from "../constants/errorMessage";
// import { NextFunction, Request, Response } from "express";
// import { C_W_ProdcutAdd } from "../Types/WislistType";
// const refid = uuidv4();

// export const verifyUserDetails = async (req: Request, res: any, next: any) => {
//   try {
//     const user = await userSignupModel.findOne({ email: req.body.emailId });
//     if (user == null) {
//       return res.status(StatusCodes.NOT_FOUND).json({
//         refid: refid,
//         message: {},
//         data: {},
//         error: USER_NOT_FOUND_0010_1 + req.body.emailId + USER_NOT_FOUND_0010_2,
//       });
//     } else {
//       let obj = {
//         refId: refid,
//         user: user,
//         productId:req.body.productId,
//       };
//       res.userData = obj;
//     }
//     next();
//   } catch (ex) {
//     log.error(`Exception occurrecd due to  ,${ex} `);

//     return res.status(StatusCodes.NOT_FOUND).json({
//       refid: refid,
//       message: {},
//       data: {},
//       error: USER_NOT_FOUND_0010_1 + req.body.emailId + USER_NOT_FOUND_0010_2,
//     });
//   }
// };

// export const verifyAddProdutToWishLsitOrCartRequestMiddleWare = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const requestBody: C_W_ProdcutAdd = req.body;

//   //if token is not prenset
//   // signin user
//   //if check if user is present
//   // add pass details to next service function

//   // const user = await userSignupModel.findOne({ email: requestBody.email });
//   //if  user not registerd
//   //reutrn to sign up
//   if (requestBody.token.trim()== "") {
//      const user = await userSignupModel.findOne({ email: requestBody.email });
//      log.info(`{{verifyAddProdutToWishLsitOrCartRequestMiddleWare()}}  started refId:${refid}  `)
//      if (user == null) {
//       return res.status(StatusCodes.NOT_FOUND).json({
//         refid: refid,
//         message: {},
//         data: {},
//         error: USER_NOT_FOUND_0010_1 + req.body.emailId + USER_NOT_FOUND_0010_2,
//       });
//     }
//   }next();
// };

// // module.exports = {
// //   verifyUserSignUpDetailMiddleWare: verifyUserDetails,

// // };
