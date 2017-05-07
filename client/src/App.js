import React, { Component } from 'react';
import { Link } from 'react-router'
import './App.css';

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
                    <div className="navbar">Hackerrank-like test app <span><Link to={'new'}>Add a new Link</Link></span><span><Link to={'list'}>List all links</Link></span></div>
                    {this.props.children}
                </div>
            </ApolloProvider>
        );
    }
}

export default App;
