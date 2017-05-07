import {
  makeExecutableSchema,
} from 'graphql-tools';
import PostResolvers from './postResolvers';
const resolvers = new PostResolvers().resolvers;

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
  downvotePost(postId: String!): Post
}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });
export { schema };