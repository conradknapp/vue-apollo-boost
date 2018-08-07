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
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  messages: [{
    messageBody: {
      type: String,
      required: true
    },
    messageDate: {
      type: Date,
      default: Date.now
    },
    messageUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }]
});

ProductSchema.index({
  "$**": "text"
});

module.exports = mongoose.model("Product", ProductSchema);
