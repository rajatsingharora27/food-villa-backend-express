import  jwt from "jsonwebtoken" ;

export const generateJWTtoken = (userObject:any) => {

if( !process.env.JWT_SECRET && process.env.JWT_SECRET!==undefined ){
    return jwt.sign(
      {
        data: {
          userName: userObject.userName,
          email: userObject.email,
          role: userObject.role,
        },
      },
      process.env.JWT_SECRET,
      { expiresIn: "2 days" }
    );
  }


};




// module.exports = {
//   jwtToken: generateJWTtoken,
// };
