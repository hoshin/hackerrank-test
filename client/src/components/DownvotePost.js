import React from 'react';
import { graphql } from 'react-apollo'
import gql from '../util/graphql'

const DownvotePost = ({postId, mutate}) => {
    const downvote = (evt) => {
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
        <a href="#" onClick={downvote} title="Downvote">[-]</a>
    );
};


const DownvotePostMutation = graphql(
    gql.downvotePostMutation
)(DownvotePost);

export default DownvotePostMutation;