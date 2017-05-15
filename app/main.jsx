'use strict'
import React from 'react'
import { Router, Route, IndexRedirect, browserHistory, IndexRoute } from 'react-router'
import { render } from 'react-dom'

import LandingPage from './components/LandingPage'
import WhoAmI from './components/WhoAmI'
import NotFound from './components/NotFound'
import AppContainer from './containers/AppContainer'
import ProjectContainer from './containers/ProjectContainer'
import AtomEditor from './containers/AtomEditor'

import firebase from 'APP/server/db'

// Get the auth API from Firebase.

// Ensure that we have (almost) always have a user ID, by creating
// an anonymous user if nobody is signed in.

// Further explanation:
//
// Whenever someone signs in or out (that's an "authStateChange"),
// firebase calls our callback with the user. If nobody is signed in,
// firebase calls us with null. Otherwise, we get a user object.
//
// This line of code thus keeps us logged in. If the user isn't signed
// in, we sign them in anonymously. This is useful, because when the user
// is signed in (even anonymously), they'll have a user id which you can
// access with auth.currentUser.uid, and you can use that id to create
// paths where you store their stuff. (Typically you'll put it somewhere
// like /users/${currentUser.uid}).
//
// Note that the user will still be momentarily null, so your components
// must be prepared to deal with that. This is unavoidable—with Firebase,
// the user will always be null for a moment when the app starts, before
// the authentication information is fetched.
//
// If you don't want this behavior, just remove the line above.

// Our root App component just renders a little frame with a nav
// and whatever children the router gave us.

const RootAtomEditor = (props) => {
  firebase.database().ref('projects').child(props.params.id).child('current').child('root').on('value', snapshot => {
    browserHistory.push(`${props.params.uid}/project/${props.params.id}/${snapshot.val()}`)
  })
  return (<p>Loading...</p>)
}

render(
  <Router history={browserHistory}>
    <Route path='/' component={LandingPage} />
    <Route path='/:uid/project/:id' component={ProjectContainer} >
      <Route path=':atomId' component={AtomEditor} />
      <IndexRoute component={RootAtomEditor} />
    </Route>
    <Route path='/login' component={WhoAmI} />
    <Route path='*' component={NotFound} />
  </Router>,
  document.getElementById('main')
)
