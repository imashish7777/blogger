const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/usercontroller");
const {
  authMiddleware,
  IS_BLOCKED,
} = require("../middleware.js/authentication");

userRouter.use(express.json());
////fetch blogs
userRouter.get("/fetchblogs", authMiddleware, userController.FETCH_BLOGS);

//write blog//
userRouter.post(
  "/writeblog",
  authMiddleware,

  userController.WRITE_BLOGS
);

//update blog//
userRouter.patch(
  "/updateblog",
  authMiddleware,
  IS_BLOCKED,
  userController.UPDATE_BLOG
);

//delete blog//
userRouter.delete("/deleteblog", authMiddleware, userController.DELETE_BLOG);
userRouter.patch("/makeprivate", authMiddleware, userController.MAKE_PRIVATE);
userRouter.patch("/matkepublic", authMiddleware, userController.MAKE_PUBLIC);

module.exports = userRouter;
