const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const createToken = (user, secret, expiresIn) => {
  const { username, email } = user;
  return jwt.sign({ username, email }, secret, { expiresIn });
};

module.exports = {
  Query: {
    productsPage: async (_, { page, size }, { Product }) => {
      let products;
      if (page === 1) {
        products = await Product.find({})
          .sort({ createdDate: "desc" })
          .limit(size)
          .populate({ path: "createdBy", model: "User" });
      } else {
        const skips = size * (page - 1);
        products = await Product.find({})
          .sort({ createdDate: "desc" })
          .skip(skips)
          .limit(size)
          .populate({
            path: "createdBy",
            model: "User"
          });
      }
      const countDocs = await Product.countDocuments();
      const hasMore = countDocs > size * page;
      return { products, hasMore };
    },
    getProduct: async (_, { _id }, { Product }) => {
      const product = await Product.findOne({ _id }).populate({
        path: "messages.messageUser",
        model: "User"
      });
      return product;
    },
    getProducts: async (_, { size }, { Product }) => {
      let products;
      if (size) {
        products = await Product.find({})
          .sort({ createdDate: "desc" })
          .limit(size)
          .populate({
            path: "createdBy",
            model: "User"
          });
      } else {
        products = await Product.find({})
          .sort({ createdDate: "desc" })
          .populate({
            path: "createdBy",
            model: "User"
          });
      }
      return products;
    },
    getUserProducts: async (_, { userId }, { Product }) => {
      const products = await Product.find({
        createdBy: userId
      });
      return products;
    },
    searchProducts: async (_, { searchTerm }, { Product }) => {
      if (searchTerm) {
        const searchResults = await Product.find(
          {
            $text: { $search: searchTerm }
          },
          {
            score: { $meta: "textScore" }
          }
        )
          .sort({
            score: { $meta: "textScore" },
            likes: "desc"
          })
          .limit(5);
        return searchResults;
      }
    },
    getCurrentUser: async (_, args, { User, currentUser }) => {
      if (!currentUser) {
        return null;
      }
      const user = await User.findOne({
        username: currentUser.username
      }).populate({ path: "favorites", model: "Product" });
      return user;
    }
  },
  Mutation: {
    addProduct: async (
      _,
      { title, imageUrl, description, categories, creatorId },
      { Product }
    ) => {
      const newProduct = await new Product({
        title,
        imageUrl,
        description,
        categories,
        createdBy: creatorId
      }).save();
      return newProduct;
    },
    addProductMessage: async (
      _,
      { messageBody, userId, productId },
      { Product }
    ) => {
      const newMessage = {
        messageBody,
        messageUser: userId
      };
      const product = await Product.findOne({ _id: productId }).then(
        product => {
          product.messages.unshift(newMessage);
          return product.save();
        }
      );
      return product;
    },
    updateUserProduct: async (
      _,
      { productId, userId, title, imageUrl, categories, description },
      { Product }
    ) => {
      const product = await Product.findOneAndUpdate(
        { _id: productId, createdBy: userId },
        {
          $set: { title, imageUrl, categories, description }
        },
        { new: true }
      );
      return product;
    },
    deleteUserProduct: async (_, { productId }, { Product }) => {
      const product = await Product.findOneAndRemove({ _id: productId });
      return product;
    },

    likeProduct: async (_, { _id, username }, { Product, User }) => {
      const product = await Product.findOneAndUpdate(
        { _id },
        { $inc: { likes: 1 } },
        { new: true }
      );
      const user = await User.findOneAndUpdate(
        { username },
        { $addToSet: { favorites: _id } },
        { new: true }
      ).populate({ path: "favorites", model: "Product" });
      return { likes: product.likes, favorites: user.favorites };
    },
    unlikeProduct: async (_, { _id, username }, { Product, User }) => {
      const product = await Product.findOneAndUpdate(
        { _id },
        { $inc: { likes: -1 } },
        { new: true }
      );
      const user = await User.findOneAndUpdate(
        { username },
        { $pull: { favorites: _id } },
        { new: true }
      ).populate({ path: "favorites", model: "Product" });
      return { likes: product.likes, favorites: user.favorites };
    },
    signinUser: async (_, { username, password }, { User }) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error("User not found");
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error("Invalid password");
      }
      return { token: createToken(user, process.env.SECRET, "1hr") };
    },
    signupUser: async (_, { username, email, password }, { User }) => {
      const user = await User.findOne({ username });
      if (user) {
        throw new Error("User already exists");
      }
      const newUser = await new User({
        username,
        email,
        password
      }).save();
      return { token: createToken(newUser, process.env.SECRET, "1hr") };
    }
  }
};
