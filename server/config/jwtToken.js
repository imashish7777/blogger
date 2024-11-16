const jwt = require("jsonwebtoken");
const AsynceHandler = require("express-async-handler");

const generateToken = AsynceHandler(async (_id) => {
  return await jwt.sign({ _id }, "MAINPETER", { expiresIn: "1d" });
});

const generateRefreshToken = AsynceHandler(async (_id) => {
  return await jwt.sign({ _id }, "MAINPETER", { expiresIn: "2d" });
});

module.exports = { generateRefreshToken, generateToken };
