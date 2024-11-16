const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    first: { type: String, required: true },
    last: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, requird: true },
    password: { type: String, require: true },
    refreshToken: { type: String },

    isblocked: { type: Boolean, default: false },
    blogs: [{ type: mongoose.Types.ObjectId, ref: "blogs" }],
    friends:[{type:mongoose.Types.ObjectId,ref:"users"}]

  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

userSchema.methods.isPasswordMatched = async function (enteredpassword) {
  return await bcrypt.compare(enteredpassword, this.password);
};

module.exports = userModel = mongoose.model("users", userSchema);
