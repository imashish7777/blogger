const express = require("express");
const AsynceHandler = require("express-async-handler");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

const authMiddleware = AsynceHandler((req, res, next) => {
  const token = req.header("x-auth-token");

  // Check for token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, "MAINPETER");

    //Add user from payload

    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ msg: "Token is not valid" });
  }
});

const IS_BLOCKED = AsynceHandler(async (req, res, next) => {
  const { _id } = req.user;
  try {
    const user = await userModel.findOne({ _id: _id });
    if (user) {
      if (user.isblocked === false) {
        next();
      } else {
        res.send("acceset denied");
      }
    } else {
      res.send("user not found");
    }
    next();
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = { IS_BLOCKED, authMiddleware };
