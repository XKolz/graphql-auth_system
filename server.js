
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

// Determine the MongoDB URI based on the environment
const mongoURI = process.env.NODE_ENV === 'production' ? process.env.MONGODB_URI_LIVE : process.env.MONGODB_URI_LOCAL;

// Enable Mongoose debugging
mongoose.set('debug', true);

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Adjust as needed
  socketTimeoutMS: 45000, // Adjust as needed
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err.message);
});

const User = mongoose.model('User', new mongoose.Schema({
  name: String,
  email: String,
  password: String,
}));

// Define the schema
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type AuthPayload {
    token: String
    user: User
  }

  type Query {
    hello: String
    users: [User]
  }

  type Mutation {
    addUser(name: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
  }
`;

const secretKey = 'your_secret_key';

// const resolvers = {
//   Query: {
//     hello: () => 'Hello, world!',
//     users: async (_, __, { user }) => {
//       if (!user) throw new Error('Authentication required');
//       console.log('Authenticated user:', user);
//       return await User.find();
//     },
//   },
//   Mutation: {
//     addUser: async (_, { name, email, password }) => {
//       const hashedPassword = await bcrypt.hash(password, 10);
//       const user = new User({ name, email, password: hashedPassword });
//       await user.save();

//       const token = jwt.sign({ userId: user.id }, secretKey);
//       console.log('User added:', user);
//       return {
//         token,
//         user,
//       };
//     },
//     login: async (_, { email, password }) => {
//       const user = await User.findOne({ email });
//       if (!user) throw new Error('No user found');

//       const valid = await bcrypt.compare(password, user.password);
//       if (!valid) throw new Error('Invalid password');

//       const token = jwt.sign({ userId: user.id }, secretKey);
//       console.log('User logged in:', user);
//       return {
//         token,
//         user,
//       };
//     },
//   },
// };
const resolvers = {
  Query: {
    hello: () => 'Hello, world!',
    users: async (_, __, { user }) => {
      if (!user) throw new Error('Authentication required');
      console.log('Authenticated user:', user);
      return await User.find();
    },
  },
  Mutation: {
    addUser: async (_, { name, email, password }) => {
      // Check if the user with the given email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, email, password: hashedPassword });
      await user.save();

      const token = jwt.sign({ userId: user.id }, secretKey);
      console.log('User added:', user);
      return {
        token,
        user,
      };
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error('No user found');

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error('Invalid password');

      const token = jwt.sign({ userId: user.id }, secretKey);
      console.log('User logged in:', user);
      return {
        token,
        user,
      };
    },
  },
};


const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers.authorization || '';
    console.log('Token received:', token);
    try {
      if (token.startsWith('Bearer ')) {
        const realToken = token.slice(7, token.length).trimLeft();
        const { userId } = jwt.verify(realToken, secretKey);
        const user = await User.findById(userId);
        return { user };
      }
    } catch (err) {
      console.log('Invalid token:', token, err.message);
    }
    return {};
  },
});

const startServer = async () => {
  await server.start();

  const app = express();
  server.applyMiddleware({ app });

  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}${server.graphqlPath}`);
  });
};

startServer();
