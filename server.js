const { ApolloServer, AuthenticationError } = require("apollo-server");
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
const Post = require("./models/Post");
require("dotenv").config({ path: "variables.env" });

// Connect to MLab Database
mongoose
  .connect(
    process.env.MONGO_URI,
    { useNewUrlParser: true }
  )
  .then(() => console.log("DB connected"))
  .catch(err => console.error(err));

// Verify user token
const getUser = async token => {
  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (err) {
      throw new AuthenticationError(
        "Your session has ended. Please sign in again."
      );
    }
  }
};

// Create GraphQL Server using typeDefs, resolvers, and Mongoose models
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: error => ({
    name: error.name,
    message: error.message.replace("Context creation failed:", "")
  }),
  context: async ({ req }) => {
    const token = req.headers["authorization"];
    return {
      User,
      Post,
      currentUser: await getUser(token)
    };
  }
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
