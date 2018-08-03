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
    getAllProducts: async (_, args, { Product }) => {
      const allProducts = await Product.find({}).sort({ createdDate: "desc" });
      return allProducts;
    },
    searchProducts: async () => {}
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
