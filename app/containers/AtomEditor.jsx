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
      selected: {}
    }
  }

  componentDidMount() {
    // When the component mounts, start listening to the fireRef
    // we were given.
    this.listenTo(projectsRef.child(this.props.params.id).child('current').child('atoms').child(this.props.params.atomId))
  }
  componentWillUnmount() {
    // When we unmount, stop listening.
    this.unsubscribe()
  }
  // listen to the fireRef.child
  listenTo(projectsRef) {
    // If we're already listening to a ref, stop listening there.
    if (this.unsubscribe) this.unsubscribe()
    // Whenever our ref's value changes, set {value} on our state.
    const listener = projectsRef.on('value', snapshot =>
      this.setState({ selected: snapshot.val() })
    )
    this.unsubscribe = () => {
      projectsRef.off('value', listener)
    }
  }
  updateAtom = (updateObj) =>
    projectsRef.child(this.props.params.id).child('current').child('atoms').child(this.props.params.atomId).update(updateObj)

  render() {
    const atomRef = projectsRef.child(this.props.params.id).child('current').child('atoms').child(this.props.params.atomId)
    console.log('state in atomeditor', this.state)
    console.log('props in atomeditor', this.props)
    return (
      <div>
        <div className='col-lg-6 project-center'>
          <Editor atom={this.state.selected} atomRef={atomRef}/>
        </div>
        <div className='col-lg-3 sidebar-left'>
          <Notes atom={this.state.selected} atomRef={atomRef} />
          <Summary atom={this.state.selected} atomRef={atomRef} />
        </div>
      </div>
    )
  }
}

// add resources function later for now
// <Resources atom={this.state.selected} />
