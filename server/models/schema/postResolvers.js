import mongoose from 'mongoose'
import config from '../../config/base'
import PostSchema from '../mongo/post'
import request from 'request'
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
          request.get(args.pageURL, (err, response, body) => {
            if (!err && response.statusCode < 400) {
              let parsedPageTitle
              let $ = cheerio.load(body)
              parsedPageTitle = $('title').text() || 'No title available'
              const newPost = new PostModel({
                posterNick: args.posterNick,
                pageURL: args.pageURL,
                pageTitle: parsedPageTitle,
                upvotes: 0
              })
              return newPost.save()
              .then(data => {
                return data
              }).catch(() => {
                return new Error('Ouch (addPost)!')
              })
            }
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
