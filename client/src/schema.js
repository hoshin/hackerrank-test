export const typeDefs = `

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
`;
