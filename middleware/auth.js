// auth, isStudent,isAdmin

const jwt = require("jsonwebtoken");
// const User = require("../model/User");
require("dotenv").config();

exports.auth = (req, res, next) => {
  // extract JWT Token
  // PENDING:other ways to fetch token
  try {
    console.log("cookie", req.cookies.token);
    console.log("body", req.body.token);
    console.log("header", req.header("Authorization"));

    var token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization").replace("Bearer", "");

    if (!token || token === undefined) {
      return res.status(401).json({
        success: false,
        message: "Token Missing",
      });
    }

    //   verify the token
    try {
      var payload = jwt.verify(token, process.env.JWT_SECRET);
      console.log(payload);
      req.user = payload;
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "token is invalid",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "something went wrong,while verifying the token",
      error: error.message,
    });
  }
};
