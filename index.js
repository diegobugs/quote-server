import fetch from "node-fetch";
import { ApolloServer, gql } from "apollo-server";

const typeDefs = gql`
  enum LANG {
    en
    es
    pt
  }

  type Quote {
    id: Int!
    quote: String!
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  type Query {
    quote(lang: LANG): Quote
  }
`;

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    quote: async (root, args) => {
      const { lang = "es" } = args;
      try {
        const options = {
          method: "GET",
          headers: {
            "X-RapidAPI-Host": "quotes15.p.rapidapi.com",
            "X-RapidAPI-Key":
              "69d64a7b01msh6f9799135b7b967p19a2f2jsna414479cc1ce",
          },
        };

        const response = await fetch(
          `https://quotes15.p.rapidapi.com/quotes/random/?language_code=${lang}`,
          options
        );

        if (response.status === 200) {
          const quote = await response.json();

          return {
            id: quote.id,
            quote: quote.content,
            author: quote.originator.name,
          };
        } else {
          throw new Error("Failed");
        }
      } catch (error) {
        console.error(error);
        return;
      }
    },
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`
      🚀  Server is ready at ${url}      
    `);
});
