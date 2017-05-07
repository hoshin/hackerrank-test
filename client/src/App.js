import React, { Component } from 'react';
import './App.css';
import PostsListWithData from './components/PostsListWithData';

import {
    ApolloClient,
    ApolloProvider,
    createNetworkInterface
} from 'react-apollo';

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
                    <div className="navbar">Hackerrank-like test app</div>
                    <PostsListWithData />
                </div>
            </ApolloProvider>
        );
    }
}

export default App;
