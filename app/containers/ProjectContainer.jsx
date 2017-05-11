import React from 'react'

import firebase from 'APP/server/db'
import Toolbar from '../components/Toolbar'
import Binder from '../components/Binder'
import Trashcan from '../components/Trashcan'
import Editor from '../components/Editor'
import Notes from '../components/Notes'
import Summary from '../components/Summary'
import Resources from '../components/Resources'

const projectsRef = firebase.database().ref('projects')

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      projects: {},
      project: {},
    }
    this.listenTo = this.listenTo.bind(this)
  }

  componentDidMount() {
    // When the component mounts, start listening to the fireRef
    // we were given.
    this.listenTo(projectsRef.child('Ella&Maritza').child('current'), projectsRef)
  }
  componentWillUnmount() {
    // When we unmount, stop listening.
    this.unsubscribe()
  }
  // listen to the fireRef.child
  listenTo(projectRef, projectsRef) {
    // If we're already listening to a ref, stop listening there.
    if (this.unsubscribe) this.unsubscribe()
    // Whenever our ref's value changes, set {value} on our state.
    const listener = projectRef.on('value', snapshot => {
        this.setState({ project: snapshot.val() })
      }
    )
    const listenerProjects = projectsRef.once('value', snapshot => {
      snapshot.forEach(childsnap => {
        let title = childsnap.child('projectTitle').val()
        this.setState({ projects: [ ...this.state.projects, title ] })
      })
    })
    this.unsubscribe = () => {
      projectsRef.off('value', listener)
    }
  }

  render() {
    console.log('state', this.state)
    return (
      <div>
        <div className='col-lg-12'>
          <Toolbar projects={this.state.projects} />
        </div>
        <div className='col-lg-3 sidebar-right'>
          <Binder atoms={this.state.project.atoms} />
          <Trashcan project={this.state.project} />
        </div>
        <div>
          { this.props.children }
        </div>
      </div>      
    )
  }
}

//<Toolbar projects={this.state.projects} />
/*const ProjectContainer = ({children}) =>
  <div>
    {children}
  </div>*/