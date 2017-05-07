import express from 'express';
import bodyParser from 'body-parser';
import PostsController from './controllers/postController';

const postsController = new PostsController();
import config from './config/base';
import cors from 'cors';

const server = express();

server.use('*', cors({ origin: config.corsWhitelistedOrigin })); // read more about cors module


// not using a router at this point as there are very few different endpoints and a single controller
server.use('/posts', bodyParser.json(), postsController.posts);

if(process.env.TEST || config.appMode === 'test'){
    server.use('/graphiqlcontroller', postsController.graphiqlController);
}

server.listen(config.serverPort, () => console.log(`Server now running on http://localhost:${config.serverPort}`));