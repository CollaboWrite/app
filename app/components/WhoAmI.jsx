import React from 'react'
import UserPage from './UserPage'
import { browserHistory } from 'react-router'
const { userRef } = require('APP/server/db/model')

import firebase from 'APP/server/db'
const auth = firebase.auth()
const google = new firebase.auth.GoogleAuthProvider()
auth.onAuthStateChanged(user => user || auth.signInAnonymously())

export const name = user => {
  if (!user) return 'Nobody'
  if (user.isAnonymous) return 'Anonymous'
  return user.displayName || user.email
}

export const WhoAmI = ({ user, auth }) =>
  <div id="whoami">
    <span className="whoami-user-name"></span>
    { // If nobody is logged in, or the current user is anonymous,
      (!user || user.isAnonymous) ?
        // ...then show signin links...
        <div id="login">
          <h1 id='app-title'>CollaboWrite</h1>
          <button className='mui-btn mui-btn--raised'
            onClick={() => auth.signInWithPopup(google)}>Log In with Google</button>
          <button className='mui-btn mui-btn--raised'
            onClick={() => {
              userRef('qln1WPVpP1fGQPBRAnigIrhOOi23').child('viewingProject').set('-KkM-Rqjj-RUjD2jsgL_')
              browserHistory.push('/qln1WPVpP1fGQPBRAnigIrhOOi23/project/-KkM-Rqjj-RUjD2jsgL_/0')
            }}>Try the Demo</button>
        </div>
        /// ...otherwise, bring in the UserPage
        : <UserPage auth={auth} user={user} />
    }
  </div>

export default class extends React.Component {
  componentDidMount() {
    this.unsubscribe = auth.onAuthStateChanged(user => this.setState({ user }))
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    const { user } = this.state || {}
    return <WhoAmI user={user} auth={auth} />
  }
}
