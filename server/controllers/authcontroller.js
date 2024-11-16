const express = require("express");
const userModel = require("../models/user.model");
const AsynceHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const { generateRefreshToken } = require("../config/jwtToken");
const blogModel = require("../models/blog.model");

module.exports.LOG_IN = AsynceHandler(async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await userModel.findOne({ email: email });
    console.log(user);

    if (user && (await user.isPasswordMatched(password))) {
      var token = await generateToken(user._id);
      var RefreshToken = await generateRefreshToken(user._id);
      user.refreshToken = RefreshToken;

      user.save();
      res.json({
        user: {
          first: user.first,
          last: user.last,
          token: token,
          email: user.email,
        },
      });
    } else {
      res.send("please check email or password");
    }
  } catch (err) {
    throw new Error(err);
  }
});

module.exports.SIGN_UP = AsynceHandler(async (req, res) => {
  const { first, last, email, phone, password } = req.body;
  console.log(req.body);
  try {
    const user = await userModel
      .create({ first, last, email, phone, password })
      .then((user) => {
        res.json(user);
      });
  } catch (err) {
    throw new Error(err);
  }
});

module.exports.UPDATE_PASSWORD = AsynceHandler(async (req, res) => {
  const { _id } = req.user;
  const password = req.body.password;
  try {
    const user = await userModel.findById(_id);
    if (user && user.isPasswordMatched(password)) {
      user.password = password;
      user.save();
      res.send(200);
    }
  } catch (err) {
    throw new Error(err);
  }
});

module.exports.DELETE_ACCOUNT = AsynceHandler(async (req, res) => {
  const { _id } = req.user;

  try {
    const user = await userModel.findById(_id);
    user.blogs.map(async (i) => {
      await blogModel.findByIdAndDelete({ _id: i });
    });

    await userModel.findByIdAndDelete(_id);
    res.json("ok");
  } catch (err) {
    throw new Error(err);
  }
});
