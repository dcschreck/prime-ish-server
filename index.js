const { GraphQLServer } = require('graphql-yoga')
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');

var Schema = mongoose.Schema;

var PrimeNumber = mongoose.model("PrimeNumber", new Schema({
  text: String }),
'primeList' );

// var PrimeNumber = mongoose.model("PrimeNumber", {
//   text: String,
//   match: Boolean
// });

var CheckedNumber = mongoose.model("CheckedNumber", {
  text: String,
  // matchPrime: String
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
  }
  type Mutation {
    createCheckedNumber(text: String!): CheckedNumber
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
      const checkedNumber = new CheckedNumber({text});
      await checkedNumber.save();
      return checkedNumber;
    },
    updateCheckedNumber: async (_, {id, matchPrime}) => {
      await CheckedNumber.findByIdAndUpdate(id);
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
