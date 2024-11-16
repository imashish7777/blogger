const mongoose = require("mongoose");
const blogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "users", required: true },
    heading: { type: String },
    blog: { type: String },
    photos: [{ type: String }],
    likes: [
      {
        likedby: { type: mongoose.Types.ObjectId, ref: "users" },
      },
    ],
    comments: [
      {
        comment: { type: String },
        likedby: { type: mongoose.Types.ObjectId, ref: "users" },
        commentby: { type: mongoose.Types.ObjectId, ref: "users" },
        reply: [
          {
            likedby: { type: mongoose.Types.ObjectId, ref: "users" },
            replytext: { type: String },
          },
        ],
      },
    ],
    private: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = blogModel = mongoose.model("blogs", blogSchema);
