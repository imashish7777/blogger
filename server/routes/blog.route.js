const express = require("express");
const blogRouter = express.Router();
const blogController = require("../controllers/blogcontroller");
const {
  authMiddleware,
  IS_BLOCKED,
} = require("../middleware.js/authentication");

blogRouter.use(express.json());

blogRouter.post(
  "/writeblog",
  authMiddleware,

  blogController.WRITE_BLOGS
);

blogRouter.get(
  "/fetchblogs",
  authMiddleware,
  blogController.FETCH_GLOBAL_BLOGS
);
blogRouter.patch(
  "/updateblog",
  authMiddleware,
//   IS_BLOCKED,
  blogController.UPDATE_BLOG
);
blogRouter.delete("/deleteblog", authMiddleware, blogController.DELETE_BLOG);

//
blogRouter.get("/fetchglobalblog", blogController.FETCH_GLOBAL_BLOGS);

blogRouter.post("/givelike", authMiddleware,blogController.GIVE_LIKE);
blogRouter.post("/removelike",authMiddleware,blogController.REMOVE_LIKE);
blogRouter.post("/writecomment",authMiddleware,blogController.COMMENT);
blogRouter.post("/deletecomment",authMiddleware,blogController.REMOVE_COMMENT);

module.exports = blogRouter;
