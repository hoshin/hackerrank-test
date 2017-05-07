import { gql } from 'react-apollo'
export default {
  postsListQuery: gql`
  query PostsListQuery {
    posts {
      id
      pageURL
      posterNick
      pageTitle
      upvotes
    }
  }`,
  upvotePostMutation: gql`
  mutation upvotePost($postId: String!) {
    upvotePost(postId: $postId) {
      id
      posterNick
      pageURL
      upvotes
      pageTitle
    }
  }`,
  downvotePostMutation : gql`
  mutation downvotePost($postId: String!) {
    downvotePost(postId: $postId) {
      id
      posterNick
      pageURL
      upvotes
      pageTitle
    }
  }`,
  addPostMutation : gql`
  mutation addPost($pageURL: String!, $posterNick: String!) {
    addPost(posterNick: $posterNick, pageURL: $pageURL) {
      id
      posterNick
      pageURL
      upvotes
      pageTitle
    }
  }`
}