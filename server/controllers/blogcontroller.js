const express = require("express");
const AsynceHandler = require("express-async-handler");
const blogModel = require("../models/blog.model");
const userModel = require("../models/user.model");

//global blog page//
//write blogs//

module.exports.WRITE_BLOGS = AsynceHandler(async (req, res) => {
  const { _id } = req.user;
  req.body.userId = req.user._id;

  try {
    const newblog = await blogModel.create(req.body);

    const blog = await blogModel.find().limit(10).sort({ createdAt: -1 });
    res.json(blog);
    await userModel.findByIdAndUpdate(
      _id,
      {
        $push: { blogs: newblog._id },
      },
      { new: true }
    );
    await user.save();
  } catch (err) {
    throw new Error(err);
  }
});

//glober blog update//
module.exports.UPDATE_BLOG = AsynceHandler(async (req, res) => {
  const updatevalues = {};
  const userId = req.user._id;
  const blogId = req.body._id;
  if (req.body.blog) {
    updatevalues.blog = req.body.blog;
  }
  if (req.body.heading) {
    updatevalues.heading = req.body.heding;
  }

  try {
    const blog = await blogModel
      .findByIdAndUpdate({ _id: blogId }, updatevalues, { new: true })
      .sort({ createdAt: -1 })
      .populate("userId");
    res.json(blog);
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

    res.json(blogs);
  } catch (err) {
    throw new Error(err);
  }
});

// fetch glober blogs
module.exports.FETCH_GLOBAL_BLOGS = AsynceHandler(async (req, res) => {
  try {
    const blogs = await blogModel.find().limit(10).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    throw new Error(err);
  }
});

module.exports.GIVE_LIKE = AsynceHandler(async (req, res) => {
  const userId = req.user._id;
  const blogId = req.body._id;
  try {
    const blog = await blogModel
      .findByIdAndUpdate(
        { _id: blogId },
        {
          $push: {
            likes: { likedby: userId },
          },
        },
        { new: true }
      )
      .populate("likes.likedby");

    res.json(blog);
  } catch (err) {
    throw new Error(err);
  }
});

module.exports.REMOVE_LIKE = AsynceHandler(async (req, res) => {
  const userId = req.user._id;
  const blogId = req.body._id;
  try {
    const blog = await blogModel.findByIdAndUpdate(
      { _id: blogId },
      { $pull: { likes: { likedby: userId } } },
      {
        new: true,
      }
    );
    res.json(blog);
  } catch (err) {
    throw new Error(err);
  }
});

module.exports.COMMENT = AsynceHandler(async (req, res) => {
  const comment = req.body.comment;
  const userId = req.user._id;
  const blogId = req.body._id;

  try {
    const blog = await blogModel
      .findByIdAndUpdate(
        { _id: blogId },
        {
          $push: {
            comments: {
              comment: comment,
              commentby: userId,
            },
          },
        },
        { new: true }
      )
      .populate("comments.commentby");
    res.json(blog);
  } catch (err) {
    throw new Error(err);
  }
});

//delete a any comment from own post///
module.exports.REMOVE_COMMENT = AsynceHandler(async (req, res) => {
  const userId = req.user._id;
  const blogId = req.body._id;
  const commentId = req.body.commentId;

  try {
    const blog = await blogModel.findOneAndUpdate(
      { _id: blogId, userId: userId },
      {
        $pull: { comments: { _id: commentId } },
      },
      {
        new:true
      }
    );
    res.json(blog);
  } catch (err) {
    throw new Error(err);
  }
});

//delete own comment from other blog//
module.exports.DELETE_COMMENT_FROM_OTHER=AsynceHandler(async(req,res)=>{
  
})

//profile blogs fetch//
module.exports.FETCH_BLOGS = AsynceHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const blogs = await userModel
      .findById(_id, {
        blogs: 1,
        likes: 1,
        comments: 1,
      })
      .populate("blogs");
    res.json(blogs.blogs);
  } catch (err) {
    throw new Error(err);
  }
});
