const bcrypt = require("bcrypt");
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const { options } = require("../routes/user");
require("dotenv").config();

// signup route handler
exports.signup = async (req, res) => {
  try {
    // get data
    const { name, email, password, role } = req.body;
    // check if the user is already present
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "user is already exists",
      });
    }

    // secure password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "error in hashing password",
      });
    }

    // create entry for User
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return res.status(200).json({
      success: true,
      message: "User created Successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered,please try again later",
    });
  }
};

exports.login = async (req, res) => {
  // taking out the data from the req
  // let me take out the email to verify
  // and also the password
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "user is not registered",
      });
    }

    const payload = {
      email: user.email,
      id: user._id, //do check this syntax for _id
      role: user.role,
    };

    // verify password and generate jwt token
    if (await bcrypt.compare(password, user.password)) {
      //because the compare syntax takes the string and the encrypted thing as inputs
      // password match
      let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      user = user.toObject();
      user.token = token;
      user.password = undefined;

      // here what we did is we have made an object of the
      // mongo db object into js object

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      // explain me more about cookie !!

      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "user logged in successfully",
      });
    } else {
      // password do not match
      return res.status(403).json({
        success: false,
        message: "Password Incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Login Failure",
    });
  }
};
