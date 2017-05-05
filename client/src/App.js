import React, { Component } from 'react';
import './App.css';
import PostsListWithData from './components/PostsListWithData';

import {
    ApolloClient,
    ApolloProvider,
    createNetworkInterface
} from 'react-apollo';


import { makeExecutableSchema } from 'graphql-tools';
import { typeDefs } from './schema';

const schema = makeExecutableSchema({ typeDefs });

const networkInterface = createNetworkInterface({
    uri: 'http://localhost:4000/posts',
});

const client = new ApolloClient({
    networkInterface,
});

class App extends Component {
    render() {
        return (
            <ApolloProvider client={client}>
                <div className="App">
                    <div className="navbar">React + GraphQL Tutorial</div>
                    <PostsListWithData />
                </div>
            </ApolloProvider>
        );
    }
}

export default App;
