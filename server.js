const { ApolloServer } = require("apollo-server");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

// Import resolvers and typeDefs (use path module to read file)
const filePath = path.join(__dirname, "typeDefs.gql");
const typeDefs = fs.readFileSync(filePath, "utf-8");
const resolvers = require("./resolvers");

// Bring in Mongoose models and Environment Variables
const User = require("./models/User");
require("dotenv").config({ path: "variables.env" });

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGO_URI,
    { useNewUrlParser: true }
  )
  .then(() => console.log("DB connected"))
  .catch(err => console.error(err));

// Create GraphQL Server using typeDefs / resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    User
  }
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
