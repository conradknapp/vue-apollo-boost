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
        products = await Product.find({}).limit(size);
      } else {
        const skips = size * (page - 1);
        products = await Product.find({})
          .skip(skips)
          .limit(size);
      }
      const countDocs = await Product.countDocuments();
      const hasMore = countDocs > size * page;
      return { products, hasMore };
    },
    getProduct: async (_, { _id }, { Product }) => {
      const product = await Product.findOne({ _id });
      return product;
    },
    getProducts: async (_, { size }, { Product }) => {
      let products;
      if (size) {
        products = await Product.find({})
          .sort({ createdDate: "desc" })
          .limit(size);
      } else {
        products = await Product.find({}).sort({ createdDate: "desc" });
      }
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
      }).populate({
        path: "favorites",
        model: "Product"
      });
      return user;
    }
  },
  Mutation: {
    addProduct: async (
      _,
      { title, imageUrl, description, categories },
      { Product }
    ) => {
      const newProduct = await new Product({
        title,
        imageUrl,
        description,
        categories
      }).save();
      return newProduct;
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
