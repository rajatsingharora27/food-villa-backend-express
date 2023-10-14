var jwt = require("jsonwebtoken");

const generateJWTtoken = (userObject) => {
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
};

module.exports = {
  jwtToken: generateJWTtoken,
};
