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

  updateAtom = (updateObj) =>
    projectsRef.child(this.props.params.id).child('current').child('atoms').child(this.props.params.atomId).update(updateObj)

  render() {
    const atomRef = projectsRef.child(this.props.params.id).child('current').child('atoms').child(this.props.params.atomId)
    // console.log('state in atomeditor', this.state)
    // console.log('props in atomeditor', this.props)
    return (
      <div>
        <div className='col-lg-6 project-center'>
          <Editor atomRef={atomRef}/>
        </div>
        <div className='col-lg-3 sidebar-left'>
          <Notes atomRef={atomRef} />
          <Summary atomRef={atomRef} />
        </div>
      </div>
    )
  }
}

// add resources function later for now
// <Resources atom={this.state.selected} />
