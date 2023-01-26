const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

// ROUTE 1: Create a user usning post api/auth/createuser. Doesn't require auth
router.post(
  "/createuser",
  [
    body("email").isEmail(),
    body("password").isLength({ min: 8 }),
    body("email", "Please provide valid email id").isEmail(),
    body("username").isLength({ min: 3 }),
    body("name").isLength({ min: 3 }),
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //console.log(req.body);

    let userByUsername = await User.findOne({ username: req.body.username });
    let userByEmail = await User.findOne({ email: req.body.email });
    if (userByUsername) {
      //console.log("userByUsername", userByUsername.email);
      return res.status(400).json({ error: "Username already exist" });
    }
    if (userByEmail) {
      return res.status(400).json({ error: "Email Id already exist" });
    }

    try {
      let SALT = await bcrypt.genSalt(10);
      let secPass = await bcrypt.hash(req.body.password, SALT);
      let JWT_SECRET = process.env.JWT_TOKEN;

      //console.log("Secure Password", secPass);
      let user = await User.create({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: secPass,
      });

      let data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWT_SECRET);
      //   //console.log(jwtData)
      // .then((user) => res.json(user))
      // .catch((err) => {
      //   //console.log(err);
      // });
      //   const user = User(req.body);
      //   user.save();
      //   res.send(req.body);
      res.json({ authToken });
      //console.log("user added sccessfully");
    } catch (err) {
      //console.log(err.message);
    }
  }
);

//ROUTE 2 : Authneticate a user using post api/auth/login. Doesn't require auth

router.get(
  "/login",
  [
    // body("email", "Please provide valid email id or username").exists(),
    body("password", "Password should not be empty").isLength({
      min: 4,
    }),
    body("email", "Please provide valid email id or username")
      .isEmail()
      .isLength({
        min: 4,
      }),
  ],
  async (req, res) => {
    let JWT_SECRET = process.env.JWT_TOKEN;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, username } = req.body;
    try {
      let getUser = await User.findOne({
        $or: [{ email: email }, { username: username }],
      });
      // let userByEmail = await User.findOne({ username: req.body.email });
      if (!getUser) {
        //console.log("userByUsername", userByUsername.email);
        return res.status(400).json({
          error: "User not exist.Please try again with correct credrentioals",
        });
      }
      const comparePassword = await bcrypt.compare(password, getUser.password);
      //console.log("comparePassword", comparePassword);
      if (!comparePassword) {
        return res.status(400).json({
          error: "User not exist.Please try again with correct credrentioals",
        });
      }
      const payload = {
        user: {
          id: getUser.id,
        },
      };

      const authToken = jwt.sign(payload, JWT_SECRET);
      
      res.json({ authToken });
      //console.log("user logged in  sccessfully");
    } catch (err) {
      //console.log(err.message);
      res.status(400).send("Internal Server Error");
    }
  }
);

//ROUTE 3 : get data for a user using post api/auth/getuser.require auth and logged in user

router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userID = res.user.id;
    //console.log("id",userID);
    const user = await User.findById(userID).select("-password");
    res.send(user);
  } catch (err) {
    //console.log(err.message);
    res.status(400).send("Internal Server Error");
  }
});
module.exports = router;
