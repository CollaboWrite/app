import React from 'react'
import firebase from 'APP/server/db'
const auth = firebase.auth()

import Login from './Login'
import UserPage from './UserPage'

auth.onAuthStateChanged(user => user || auth.signInAnonymously())


export const name = user => {
  if (!user) return 'Nobody'
  if (user.isAnonymous) return 'Anonymous'
  return user.displayName || user.email
}

export const WhoAmI = ({user, auth}) =>
  <div className="whoami">
    <span className="whoami-user-name">Hello, {name(user)}</span>
    { // If nobody is logged in, or the current user is anonymous,
      (!user || user.isAnonymous)?
      // ...then show signin links...
      <Login auth={auth}/>
      /// ...otherwise, show a logout button.
      : <div>
          <UserPage user={user}/>
          <button className='logout' onClick={() => auth.signOut()}>logout</button>
        </div> }
  </div>

export default class extends React.Component {
  componentDidMount() {
    this.unsubscribe = auth.onAuthStateChanged(user => this.setState({user}))
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    const {user} = this.state || {}
    return <WhoAmI user={user} auth={auth}/>
  }
}
