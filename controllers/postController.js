import {
    graphqlExpress,
    graphiqlExpress,
} from 'graphql-server-express';

import { schema } from '../models/schema/schema';
class PostController {
    constructor() {

    }

    list(req, res) {
        return (graphqlExpress({ schema }))(req, res);
    }

    graphiqlContoller(req, res) {
        return (graphiqlExpress({
            endpointURL: '/posts'
        }))(req, res);
    };
}

module.exports = PostController;