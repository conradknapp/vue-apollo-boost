const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  categories: {
    type: [String],
    required: true
  },
  description: {
    type: String,
    trim: true,
    required: true
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  likes: {
    type: Number,
    default: 0
  },
  // username: {
  //   type: String
  // }
});

ProductSchema.index({
  "$**": "text"
});

module.exports = mongoose.model("Product", ProductSchema);