const userModel = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const Create = async (req, res, next) => {
  const { email, password } = req.body;
  const repeatedUser = await userModel.findOne({ email: email });
  if (repeatedUser) {
    return res.status(400).json({
      message: `${email} is already exist!`,
    });
  }
  try {
    const newUser = new userModel({
      email,
      password: await bcrypt.hash(password, 10),
    });

    const savedUser = await newUser.save();
    res.status(201).json({
      message: "new user is created!",
      savedUser,
    });
  } catch (err) {
    res.status(500).json({
      message: "Created user failed" + err,
    });
  }
};

const GetAll = async (req, res, next) => {
  try {
    const users = await userModel.find();
    if (!users) {
      return res.status(404).json({
        message: "Users not available",
      });
    }
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({
      message: "Get all user failed !" + err,
    });
  }
};

const Login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Crediential do not matched",
      });
    }
    const verifyPassword = await bcrypt.compare(user.password, password);
    if (verifyPassword) {
      return res.status(400).json({
        message: "Credential dont matched",
      });
    }

    const token = await jwt.sign({ _id: user._id }, "MYSECRETKEY", {
      expiresIn: "2 days",
    });
    res.status(200).json({
      message: "logged in",
      token: token,
      user,
    });
  } catch (err) {
    res.status(500).json("Server failed");
  }
};

const GoogleLogin = async (req, res, next) => {
  const { idToken } = req.body;
  const client = new OAuth2Client(process.env.CLIENT_ID);
  const ticket = await client.verifyIdToken({
    idToken: idToken,
    audience: process.env.CLIENT_ID,
  });
  const { email, email_verified, at_hash } = ticket.getPayload();
  if (email_verified) {
    const repeatedEmail = await userModel.findOne({ email });
    if (repeatedEmail) {
      const token = jwt.sign({ _id: repeatedEmail._id }, "MYSECRETKEY", {
        expiresIn: "2 days",
      });
      return res.status(200).json({
        message: "login success",
        token,
        user: repeatedEmail,
      });
    }
    const newUser = new userModel({
      email,
      password: at_hash,
    });
    const savedUser = await newUser.save();
    const token = jwt.sign({ _id: savedUser._id }, "MYSECRETKEY", {
      expiresIn: "2 days",
    });
    res.status(200).json({
      message: "login success",
      token,
      user: savedUser,
    });
  } else {
    res.status(500).json({
      message: "email is not verified",
    });
  }
};

const DeletebyId = async (req, res, next) => {
  try {
    const { id } = req.body;
    const deletedUser = await userModel.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).send("User not found");
    }
    res.status(200).json({
      message: "user deleted successfully",
      deletedUser,
    });
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = {
  Create,
  GetAll,
  Login,
  GoogleLogin,
  DeletebyId,
};
