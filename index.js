require("dotenv").config();

const mongoose = require("mongoose");
const url = process.env.MONGO_URL;
mongoose.connect(url).then(() => {
  console.log("MongoDB Server Started");
});

const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const app = express();

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
});

const UserDB = mongoose.model("User", userSchema);

// Define GraphQL schema
const schema = buildSchema(`
  type User {
    name: String
    phone: String
  }

  type Query {
    users: [User]
  }
`);

// Root resolver
const Get_all_users = {
  users: async () => {
    return await UserDB.find();
  },
};

app.use(
  "/",
  graphqlHTTP({
    schema: schema,
    rootValue: Get_all_users,
    graphiql: true, // Enable GraphiQL for testing
  })
);

// Start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is now running on ${PORT}`);
});
