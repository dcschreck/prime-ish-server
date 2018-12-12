const { GraphQLServer } = require('graphql-yoga')
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');

var Schema = mongoose.Schema;

var PrimeNumber = mongoose.model("PrimeNumber", new Schema({
  text: String }),
'primeList' );

var CheckedNumber = mongoose.model("CheckedNumber", {
  text: String,
  matchingPrime: String
});


const typeDefs = `
  type Query {
    primeNumbers: [PrimeNumber]
    checkedNumbers: [CheckedNumber]
  }
  type PrimeNumber {
    id: ID!
    text: String!
  }
  type CheckedNumber {
    id: ID!
    text: String!
    matchingPrime: String
  }
  type Mutation {
    createCheckedNumber(text: String!, matchingPrime: String): CheckedNumber
    updateCheckedNumber(id: ID!): Boolean
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
      const checkedNumber = new CheckedNumber({text, matchingPrime: "nada"});
      await checkedNumber.save();
      return checkedNumber;
    },
    updateCheckedNumber: async (_, {id, matchingPrime}) => {
      await CheckedNumber.findByIdAndUpdate(id, {matchingPrime});
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
