import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import App from './App'
import AddNewPost from './components/AddNewPost'
import PostsListWithData from './components/PostsList'
import './index.css'
import deadLink from '../public/dead-link.jpg'

const NotFound = () => (
    <img src={deadLink} />)

ReactDOM.render(
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={AddNewPost} />
        <Route path="new" component={AddNewPost} />
        <Route path="list" component={PostsListWithData} />
        <Route path='*' component={NotFound} />
      </Route>
    </Router>,
    document.getElementById('root')
)
