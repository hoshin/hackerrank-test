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

const DownvotePost = ({postId, mutate}) => {
    const downvote = (evt) => {
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
        <a href="#" postId={postId} onClick={downvote} title="Downvote">[-]</a>
    );
};

const downvotePostMutation = gql`
  mutation downvotePost($postId: String!) {
    downvotePost(postId: $postId) {
      id
      posterNick
      pageURL
      upvotes
      pageTitle
    }
  }
`;

const DownvotePostMutation = graphql(
    downvotePostMutation
)(DownvotePost);

export default DownvotePostMutation;