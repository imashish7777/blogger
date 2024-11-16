const mongoose = require("mongoose");

const connection = mongoose.connect(
  "mongodb+srv://ashishkumar155223:dOx9GnozSPzaoNMz@pankajopticals.dwraj7z.mongodb.net/blogger"
);

module.exports = { connection };
