const express = require("express");
const authRouter = express.Router();
const authcontroller = require("../controllers/authcontroller");
const { IS_BLOCKED } = require("../middleware.js/authentication");
const { authMiddleware } = require("../middleware.js/authentication");
authRouter.use(express.json());

// authRouter.post("/login",IS_BLOCKED,);
authRouter.post("/signup", authcontroller.SIGN_UP);
authRouter.post("/login", authcontroller.LOG_IN);
authRouter.patch(
  "/updatepassword",
  authMiddleware,
  IS_BLOCKED,
  authcontroller.UPDATE_PASSWORD
);

module.exports = authRouter;
