import React from 'react'
import {connect} from 'react-redux'

import Toolbar from '../components/Toolbar'
import Binder from '../components/Binder'
import Trashcan from '../components/Trashcan'
import Editor from '../components/Editor'
import Notes from '../components/Notes'
import Summary from '../components/Summary'
import Resources from '../components/Resources'

import firebase from 'APP/fire'
const projectsRef = firebase.database().ref('projects')

// use props.params.id to get the project id for the firebase query
// being passed from the userPage when the user chooses the project to view

export default class AppContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      projects: {},
      selected: {}
    }
  }

  componentDidMount() {
    // When the component mounts, start listening to the fireRef
    // we were given.
    this.listenTo(projectsRef)
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
      this.setState({projects: snapshot.val()})
    )
    this.unsubscribe = () => {
      projectsRef.off('value', listener)
    }
  }
  selectAtom = (evt) => {
    evt.preventDefault()
    this.setState({selected: evt.target.value})
  }
  render() {
    const currentProject = this.state.projects[1] ? this.state.projects[1].current : {}
    console.log('project', this.state.projects)
    console.log('current project', currentProject)
    return (
      <div>
        <div className='col-lg-12'>
          <Toolbar projects={currentProject}/>
        </div>
        <div className='col-lg-3 sidebar-right'>
          <Binder atoms={currentProject.atoms} selectAtom={this.selectAtom}/>
          <Trashcan project={currentProject}/>
        </div>
        <div className='col-lg-6 project-center'>
          <Editor atom={this.state.selected}/>
        </div>
        <div className='col-lg-3 sidebar-left'>
          <Notes atom={this.state.selected}/>
          <Summary atom={this.state.selected} />
          <Resources atom={this.state.selected} />
        </div>
      </div>
    )
  }
}

// const mapStateToProps = (state) => ({projects: state.projects.list})

// const mapDispatchToProps = null

// export default connect(mapStateToProps, mapDispatchToProps)(AppContainer)
