import React from 'react'
import { graphql } from 'react-apollo'
import gql from '../util/graphql'

const AddNewPost = ({ mutate }) => {
  const saveNewLinkAndResetForm = () => {
    mutate({
      variables: {
        posterNick: document.getElementById('posterNick').value,
        pageURL: document.getElementById('postURL').value
      },
      refetchQueries: [{ query: gql.postsListQuery }]
    })
    .then(() => {
      document.getElementById('posterNick').value = ''
      document.getElementById('postURL').value = ''
    })
    .catch(err => {
      console.log(err)
    })
  }
  const handleKeyUp = (evt) => {
    if (evt.keyCode === 13) {
      evt.persist()
      saveNewLinkAndResetForm()
    }
  }

  const handleButtonClick = (evt) => {
    evt.persist()
    saveNewLinkAndResetForm()
  }

  return (
      <div className="new-post-form">
        <div className="form-fields">
          <div className="section-title">Add a new link</div>
          <input
              id="postURL"
              type="text"
              placeholder="New Post URL"
              onKeyUp={handleKeyUp}
          />
          <input
              id="posterNick"
              type="text"
              placeholder="Nick"
              onKeyUp={handleKeyUp}
          />
          <a href="#" onClick={handleButtonClick}>Add it !</a>
        </div>
      </div>
  )
}

const AddPostWithMutation = graphql(
    gql.addPostMutation
)(AddNewPost)

export default AddPostWithMutation
