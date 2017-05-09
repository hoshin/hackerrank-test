import React from 'react'
import { graphql } from 'react-apollo'
import gql from '../util/graphql'

import UpvotePostMutation from './DownvotePost'
import DownvotePostMutation from './UpvotePost'

const PostsList = ({ data: { loading, error, posts } }) => {
  if (loading) {
    return <p>Loading ...</p>
  }
  if (error) {
    return <p>{error.message}</p>
  }

  return (
      <div className="postsList">
        <div className="section-title">Saved links</div>
        { posts.map(post => <div key={post.id} className="post">
          <a href={post.pageURL}>{post.pageTitle || 'No title available'}</a> by {post.posterNick}
          <span className="upvotes">{`(${post.upvotes} upvotes)`} <UpvotePostMutation className="vote up"
                                                                                      postId={post.id} /> <DownvotePostMutation
              className="vote down" postId={post.id} /></span>
        </div>) }
      </div>
  )
}

export default graphql(gql.postsListQuery)(PostsList)
