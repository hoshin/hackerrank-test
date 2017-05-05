import express from 'express';
import {
    graphqlExpress,
    graphiqlExpress,
} from 'graphql-server-express';
import bodyParser from 'body-parser';
import PostsController from './controllers/postController';

const postsController = new PostsController();

import { schema } from './models/schema/schema';
import cors from 'cors';

const PORT = 4000;

const server = express();

server.use('*', cors({ origin: 'http://localhost:3000' }));

// server.get('/', function (req, res) {
//   res.send('Hello World!');
// });

// server.use('/graphql', bodyParser.json(), graphqlExpress({
//     schema
// }));

server.use('/posts', bodyParser.json(), postsController.list);

// server.use('/graphiql', graphiqlExpress({
//     endpointURL: '/graphql'
// }));

server.use('/graphiqlcontroller', postsController.graphiqlContoller);



server.listen(PORT, () => console.log(`Server now running on http://localhost:${PORT}`));