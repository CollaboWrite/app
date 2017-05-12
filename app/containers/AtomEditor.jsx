import React from 'react'
import Editor from '../components/Editor'
import Notes from '../components/Notes'
import Summary from '../components/Summary'
import Resources from '../components/Resources'

import firebase from 'APP/server/db'
const projectsRef = firebase.database().ref('projects')

export default class AtomEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      atomVal: {},
    }
  }

  componentDidMount() {
    // When the component mounts, start listening to the fireRef
    // we were given.
    this.listenTo(firebase.database().ref('users').child(this.props.uid).child('projects').child(this.props.projectId))
  }
  componentWillUnmount() {
    // When we unmount, stop listening.
    this.unsubscribe()
  }
  // listen to the fireRef.child
  listenTo(atomRef) {
    // If we're already listening to a ref, stop listening there.
    if (this.unsubscribe) this.unsubscribe()
    // Whenever our ref's value changes, set {value} on our state.
    const listener = atomRef.on('value', snapshot => {
      this.setState({ atomVal: snapshot.val() })
    })
    this.unsubscribe = () => {
      atomRef.off('value', listener)
    }
  }

  updateAtom = (updateObj) =>
    projectsRef.child(this.props.params.id).child('current').child('atoms').child(this.props.params.atomId).update(updateObj)

  render() {
    const ref = this.state.atomRef || projectsRef.child(this.props.projectId).child('current').child('atoms').child(this.props.atomId)
    return (
      <div>
        <div className='col-lg-6 project-center'>
          <Editor atomRef={ref} />
        </div>
        <div className='col-lg-3 sidebar-right'>
          <Notes atomRef={ref} />
          <Summary atomRef={ref} />
        </div>
      </div>
    )
  }
}

// add resources function later for now
// <Resources atom={this.state.selected} />
