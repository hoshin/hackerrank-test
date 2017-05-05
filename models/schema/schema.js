import {
  makeExecutableSchema,
} from 'graphql-tools';
import { resolvers } from './resolvers';

const typeDefs = `

type Post {
   id: ID!                
   pageURL: String
   posterNick: String
   pageTitle: String
   upvotes: Int
}

type Query {
   posts: [Post]
}

type Mutation {
  addPost(pageURL: String!, posterNick: String!): Post
  upvotePost(postId: String!): Post
}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });
export { schema };