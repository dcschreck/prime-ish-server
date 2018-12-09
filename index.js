const { GraphQLServer } = require('graphql-yoga')
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test5');

var PrimeNumber = mongoose.model("PrimeNumber", {
  text: String,
  match: Boolean
});

var CheckedNumber = mongoose.model("CheckedNumber", {
  text: String
});


const typeDefs = `
  type Query {
    primeNumbers: [PrimeNumber]
    checkedNumbers: [CheckedNumber]
  }
  type PrimeNumber {
    id: ID!
    text: String!
    match: Boolean!
  }
  type CheckedNumber {
    id: ID!
    text: String!
  }
  type Mutation {
    createCheckedNumber(text: String!): CheckedNumber
    createPrimeNumber(text: String!): PrimeNumber
    updatePrimeNumber(id: ID!, match: Boolean!): Boolean
    removeCheckedNumber(id: ID!): Boolean
    removePrimeNumber(id: ID!): Boolean
  }
`

const resolvers = {
  Query: {
    primeNumbers: () => PrimeNumber.find(),
    checkedNumbers: () => CheckedNumber.find()
  },
  Mutation: {
    createCheckedNumber: async (_, {text}) => {
      const checkedNumber = new CheckedNumber({text});
      await checkedNumber.save();
      return checkedNumber;
    },
    createPrimeNumber: async (_, {text}) => {
      const primeNumber = new PrimeNumber({text, match: false});
      await primeNumber.save();
      return primeNumber;
    },
    updatePrimeNumber: async (_, {id, match}) => {
      await PrimeNumber.findByIdAndUpdate(id, {match});
      return true;
    },
    removeCheckedNumber: async (_, {id}) => {
      await CheckedNumber.findByIdAndRemove(id);
      return true;
    },
    removePrimeNumber: async (_, {id}) => {
      await PrimeNumber.findByIdAndRemove(id);
      return true;
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers })
mongoose.connection.once("open", function() {
  server.start(() => console.log("Server is running on localhost:4000"))
});
