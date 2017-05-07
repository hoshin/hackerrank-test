import mongoose from 'mongoose'
import config from '../../config/base'
import PostSchema from '../mongo/post'
import rp from 'request-promise'
import cheerio from 'cheerio'

class PostResolvers {
  constructor () {
    const PostModel = mongoose.model('post', PostSchema)
    this.dbConnection = mongoose.connect(config.mongo.uri, config.mongo.options)

    this.resolvers = {
      Query: {
        posts: () => {
          return PostModel.find({}, {}, { sort: { upvotes: 'descending' } })
          .then(data => {
            data.id = data._id
            return data
          })
          .catch(() => {
            return null
          })
        }
      },
      Mutation: {
        addPost: (root, args) => {
          if(!args.pageURL.match(/^(http[s]?:\/\/).+/)){
            args.pageURL = `http://${args.pageURL}`
          }
          const options = {
            uri: args.pageURL,
            transform: function (body) {
              return cheerio.load(body);
            }
          }
          return rp.get(options)
          .then($ => {
            return this.saveNewPost(PostModel, {
              posterNick: args.posterNick,
              pageURL: args.pageURL,
              pageTitle: this.parsePageTitle($),
              upvotes: 0
            })
          })
        },
        upvotePost: (root, args) => {
          return this.updatePostVotes(PostModel, args, 1, 'up')
        },

        downvotePost: (root, args) => {
          return this.updatePostVotes(PostModel, args, -1, 'down')
        }
      }
    }
  }

  parsePageTitle ($) {
    return $('title').text() || 'No title available'
  }

  saveNewPost (PostModel, newPostData) {
    const newPost = new PostModel(newPostData)
    return newPost.save()
    .then(data => {
      return data
    }).catch(() => {
      return new Error('Ouch (addPost)!')
    })
  }

  updatePostVotes (PostModel, args, increment, type) {
    return PostModel.findOne({ _id: args.postId })
    .then(postToUpvote => {
      postToUpvote.upvotes += increment
      return postToUpvote.save().then(() => {
        return postToUpvote
      })
      .catch(() => {
        return new Error(`Ouch (${type}vote post save)!`)
      })
    })
    .catch(() => {
      return new Error(`Ouch (${type}vote post lookup)!`)
    })
  }
}

export default PostResolvers
