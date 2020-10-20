const gql = require("graphql-tag");
const { ApolloServer } = require("apollo-server");

const typeDefs = gql`
  type User {
    email: String!
    avatar: String
    shoes: [Shoe]!
  }

  enum ShoeType {
    JORDAN
    NIKE
    ADIDAS
    TIMBERLAND
  }

  interface Shoe {
    brand: ShoeType!
    size: Int!
    user: User!
  }

  type Sneaker implements Shoe {
    brand: ShoeType!
    size: Int!
    user: User!
    sport: String!
  }

  type Boot implements Shoe {
    brand: ShoeType!
    size: Int!
    user: User!
    hasGrip: Boolean!
  }

  input ShoesInput {
    brand: ShoeType
    size: Int
  }

  type Query {
    me: User!
    shoes(input: ShoesInput): [Shoe]!
  }
`;
const user = {
  id: 1,
  email: "yoda@masters.com",
  avatar: "http://yoda.png",
  shoes: [],
};

const shoes = [
  { brand: "JORDAN", size: 9, sport: "basketball", user: 1 },
  { brand: "TIMBERLAND", size: 12, hasGrip: true, user: 1 },
];

const resolvers = {
  Query: {
    me() {
      return user;
    },
    shoes(_, { input }) {
      return shoes;
    },
  },
  User: {
    shoes() {
      return shoes;
    },
  },
  Shoe: {
    __resolveType(shoe) {
      if (shoe.sport) return "Sneaker";
      return "Boot";
    },
  },
  Sneaker: {
    user(shoe) {
      console.log(shoe.user);

      return user;
    },
  },
  Boot: {
    user(shoe) {
      console.log(shoe.user);

      return user;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen(4000).then(() => console.log("on port 4000"));
