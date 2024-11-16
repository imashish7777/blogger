const express = require("express");
const morgon = require("morgan");
const { connection } = require("./config/db");
const cors = require("cors");
const authRouter = require("./routes/auth.route");
const userRouter = require("./routes/user.route");
const blogRouter = require("./routes/blog.route");
const PORT = 3002;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgon());

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/blog", blogRouter);
//port connection
app.listen(PORT, async () => {
  try {
    await connection;
    console.log("Connected to database");
  } catch (err) {
    console.log("unable to connect to database");
    throw new Error(err);
  }
});
