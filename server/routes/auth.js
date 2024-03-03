import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const router = express.Router();

/* User Registration */
router.post("/register", async (req, res) => {
  try {
    /* Salting and Hashing the Password */
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    console.log("works")
    /* Create a new user */
    const newuser = await new User({
      userType: req.body.userType,
      username: req.body.username,
      gender: req.body.gender,
      mobile: req.body.mobile,
      email: req.body.email,
      password: hashedPass,
    });

    /* Save User and Return */
    const {userType , username , gender , mobile , email , _id , availableCoins } = await newuser.save();
    res.status(200).json({_id,userType,username,gender,mobile,email,availableCoins});
  } catch (err) {
    res.status(404).json({error:err.code});
  }
});

/* User Login */
router.post("/signin", async (req, res) => {
  try {
    const user = req.body.email
      ? await User.findOne({
          email: req.body.email,
        })
      : "";

    console.log(user, "user");

    !user && res.status(404).json("User not found");

    const validPass = await bcrypt.compare(req.body.password, user.password);
    !validPass && res.status(400).json("Wrong Password");

    const {userType , username , gender , mobile , email , _id , availableCoins } = user;

    res.status(200).json({ _id ,  userType , username , gender , mobile , email , availableCoins});
  } catch (err) {
    console.log(err);
  }
});

export default router;
