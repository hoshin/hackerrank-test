import React from 'react';
import {
    gql,
    graphql,
} from 'react-apollo';

const postsListQuery = gql`
  query PostsListQuery {
    posts {
      id
      pageURL
      posterNick
      pageTitle
      upvotes
    }
  }
`;

const UpvotePost = ({postId, mutate}) => {
    const upvote = (evt) => {
        evt.persist();
        mutate({
            variables: { postId: postId },
            refetchQueries: [ { query: postsListQuery }]
        })
        .catch( err => {
            console.log(err);
        });
    };

    return (
        <a href="#" postId={postId} onClick={upvote} title="Upvote">[+]</a>
    );
};

const upvotePostMutation = gql`
  mutation upvotePost($postId: String!) {
    upvotePost(postId: $postId) {
      id
      posterNick
      pageURL
      upvotes
      pageTitle
    }
  }
`;

const UpvotePostMutation = graphql(
    upvotePostMutation
)(UpvotePost);

export default UpvotePostMutation;