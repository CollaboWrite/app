import React from 'react'
import firebase from 'APP/server/db'
import { Link, browserHistory } from 'react-router'

const auth = firebase.auth()

const Toolbar = (props) => {
  return (<nav className='toolbar navbar'>
    <select onChange={(evt) => {
    }}>
      {
        props.projects.length && props.projects.map((project, indx) => (
          <option value={project.key} key={project.key}>{project.title}</option>
        ))
      }
    </select>
    <button>Tree View</button>
    <button>Timeline View</button>
    <button><Link to="/login">Back to User Page</Link></button>
    <button
      className='logout'
      onClick={() => {
        auth.signOut()
        browserHistory.push('/login')
      }
    }>Log Out</button>
  </nav>)
}
export default Toolbar
