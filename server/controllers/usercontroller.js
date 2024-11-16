const express = require("express");
const AsynceHandler = require("express-async-handler");
const blogModel = require("../models/blog.model");
const userModel = require("../models/user.model");

//user profile blogs //

//fetch all user blogs//
module.exports.FETCH_BLOGS = AsynceHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const blogs = await userModel.findById(_id).populate("blogs");
    res.json(blogs.blogs).statusCode(200);
  } catch (err) {
    throw new Error(err);
  }
});

//write blogs from userprofile//
module.exports.WRITE_BLOGS = AsynceHandler(async (req, res) => {
  const { _id } = req.user;
  req.body.userId = req.user._id;

  try {
    const newblog = await blogModel.create(req.body);
    if (newblog) {
      const blogs = await userModel.findByIdAndUpdate(
        _id,
        {
          $push: { blogs: newblog._id },
        },
        { new: true }
      );
      res.json(blogs).statusCode(200);
    } else {
      res.statusCode(409);
    }
  } catch (err) {
    throw new Error(err);
  }
});

//glober blog update//
module.exports.UPDATE_BLOG = AsynceHandler(async (req, res) => {
  const userId = req.user._id;
  const blogId = req.body._id;
  try {
    const blog = await blogModel
      .findByIdAndUpdate({ _id: blogId }, req.body)
      .limit(10)
      .sort({ createdAt: -1 })
      .populate("userId");
    res.json(blog).statusCode(200);
  } catch (err) {
    throw new Error(err);
  }
});

//global blog page delete page//
module.exports.DELETE_BLOG = AsynceHandler(async (req, res) => {
  const userId = req.user._id;
  const blogId = req.body._id;

  try {
    const blogs = await blogModel
      .findOneAndDelete({ _id: blogId }, { new: true })
      .limit(10)
      .sort({ createdAt: -1 });

    await userModel.findByIdAndUpdate(
      { _id: userId },
      {
        $pull: {
          blogs: blogId,
        },
      }
    );

    res.json(blogs).sendStatus(200);
  } catch (err) {
    throw new Error(err);
  }
});

//make blog private//

module.exports.MAKE_PRIVATE = AsynceHandler(async (req, res) => {
  const userId = req.user._id;
  const blogId = req.body._id;

  try {
    const blog = await blogModel.findByIdAndUpdate(
      { _id: blogId },
      {
        private: true,
      }
    );
    if (blog) {
      const user = await userModel.findById({ _id: userId }).populate("blogs");
      res.json(user.blogs);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    throw new Error(err);
  }
});

// make blog public//
module.exports.MAKE_PUBLIC = AsynceHandler(async (req, res) => {
  const userId = req.user._id;
  const blogId = req.body._id;

  try {
    const blog = await blogModel.findByIdAndUpdate(
      { _id: blogId },
      {
        private: false,
      }
    );
    if (blog) {
      const user = await userModel.findById({ _id: userId }).populate("blogs");
      res.json(user.blogs);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    throw new Error(err);
  }
});


