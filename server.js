const { ApolloServer } = require("apollo-server");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// Import resolvers and typeDefs
const filePath = path.join(__dirname, "typeDefs.gql");
const typeDefs = fs.readFileSync(filePath, "utf-8");
const resolvers = require("./resolvers");

// Import Mongoose models and Environment Variables
const User = require("./models/User");
const Product = require("./models/Product");
require("dotenv").config({ path: "variables.env" });

// Connect to MLab Database
mongoose
  .connect(
    process.env.MONGO_URI,
    { useNewUrlParser: true }
  )
  .then(() => console.log("DB connected"))
  .catch(err => console.error(err));

const getUser = async req => {
  const token = req.headers["authorization"];

  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (e) {
      throw new AuthenticationError("Your session expired. Sign in again.");
    }
  }
};

// Create GraphQL Server using typeDefs, resolvers, and Mongoose models
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const currentUser = await getUser(req);
    return { User, Product, currentUser };
  }
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
