import React from 'react';
import { graphql } from 'react-apollo'
import gql from '../util/graphql'

const UpvotePost = ({postId, mutate}) => {
    const upvote = (evt) => {
        evt.persist();
        mutate({
            variables: { postId: postId },
            refetchQueries: [ { query: gql.postsListQuery }]
        })
        .catch( err => {
            console.log(err);
        });
    };

    return (
        <a href="#" postId={postId} onClick={upvote} title="Upvote">[+]</a>
    );
};

const UpvotePostMutation = graphql(
    gql.upvotePostMutation
)(UpvotePost);

export default UpvotePostMutation;