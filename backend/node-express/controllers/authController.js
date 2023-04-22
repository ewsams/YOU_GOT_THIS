const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
require("dotenv").config();

const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, `${process.env.JWT_SECRET_KEY}`, {
    expiresIn: "1h",
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, `${process.env.JWT_REFRESH_SECRET_KEY}`, {
    expiresIn: "7d",
  });
};

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    const userId = savedUser._id;

    const accessToken = generateAccessToken(savedUser._id);
    const refreshToken = generateRefreshToken(savedUser._id);

    res.status(201).json({ accessToken, refreshToken, userId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    const userId = user._id;

    res.status(200).json({ accessToken, refreshToken, userId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.refreshToken = async (req, res) => {
  const refreshToken = req.body.token;

  if (!refreshToken) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET_KEY
    );
    const accessToken = generateAccessToken(decoded.userId);

    res.status(200).json({ accessToken });
  } catch (error) {
    console.log(error);
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

exports.logout = (req, res) => {
  // Since JWT tokens are stateless, you can't explicitly invalidate them.
  // To implement logout, you can simply delete the token on the client side,
  // or use short-lived tokens and refresh tokens.
  res.status(200).json({ message: "Logged out" });
};
