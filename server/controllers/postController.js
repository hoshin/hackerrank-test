import {
  graphqlExpress,
  graphiqlExpress
} from 'graphql-server-express'

import { schema } from '../models/schema/schema'
class PostController {
  posts (req, res) {
    return (graphqlExpress({ schema }))(req, res)
  }

  graphiqlController (req, res) {
    return (graphiqlExpress({
      endpointURL: '/posts'
    }))(req, res)
  }
}

export default PostController
