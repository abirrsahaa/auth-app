const express = require("express");
const router = express.Router();

const User = require("../model/User");

const { login, signup } = require("../controllers/Auth");
const { auth } = require("../middleware/auth");

router.post("/login", login);
router.post("/signup", signup);

// testing protected routes for single middleware
router.get("/", (req, res) => {
  res.json({ message: "welcome to the user route" });
});
router.get("/test", auth, (req, res) => {
  res.json({
    success: true,
    message: "welcome to the protected route for tests",
  });
});

// protected route

module.exports = router;
