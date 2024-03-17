const { ApolloServer, gql } = require("apollo-server-express");
const express = require("express");

const app = express();

const typeDefs = gql`
  type AuthResponse {
    token: String!
    email: String!
    expired: Int!
  }

  type User {
    name: String!
    memberNo: String!
  }

  type Payment {
    memberNo: String!
    amount: Float!
  }

  type Query {
    getUser(tokenId: String!, email: String!): User!
    getPayment(memberNo: String!): Payment!
  }

  type Mutation {
    login(email: String!): AuthResponse!
  }
`;

const fakeUserData = {
  "99999999999999999999999999999999": { name: "fake", memberNo: "12345" },
};

const fakePaymentData = {
  12345: { memberNo: "12345", amount: 500000.0 },
};

const resolvers = {
  Query: {
    getUser: (_, { tokenId, email }) => {
      return fakeUserData[tokenId];
    },
    getPayment: (_, { memberNo }) => {
      return fakePaymentData[memberNo];
    },
  },
  Mutation: {
    login: (_, { email }) => {
      const token = "99999999999999999999999999999999";
      const expired = 600;
      return { token, email, expired };
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

async function startApolloServer() {
    try {
      await server.start();
      server.applyMiddleware({ app });
    } catch (error) {
      console.error("Error starting Apollo Server:", error);
    }
  }
  

startApolloServer().then(() => {
  app.listen({ port: 4000 }, () =>
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
  );
});
