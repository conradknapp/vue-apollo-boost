const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  joinDate: {
    type: Date,
    default: Date.now
  }
  // favorites: {
  //   type: [Schema.Types.ObjectId],
  //   required: true,
  //   ref: "Product"
  // }
});

module.exports = mongoose.model("User", UserSchema);
