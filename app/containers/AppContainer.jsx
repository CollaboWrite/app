import React from 'react'
import { connect } from 'react-redux'

import Toolbar from '../components/Toolbar'
import Binder from '../components/Binder'
import Trashcan from '../components/Trashcan'
import Editor from '../components/Editor'
import Notes from '../components/Notes'
import Summary from '../components/Summary'
import Resources from '../components/Resources'

import firebase from 'APP/server/db'
const projectsRef = firebase.database().ref('testProjects')
const project1Ref = projectsRef.child('project1').child('current') // should target id of project

// use props.params.id to get the project id for the firebase query
// being passed from the userPage when the user chooses the project to view

export default class AppContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      projects: [],
      project: {},
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
    const listener = project1Ref.on('value', snapshot =>
      this.setState({ project: snapshot.val(), selected: snapshot.child('root').val() })
    )
    const listenerProjects = projectsRef.on('value', snapshot => {
      snapshot.forEach(childsnap => {
        childsnap.forEach(grandsnap => {
          if (grandsnap.key === 'current') {
            this.setState({
              projects: [...this.state.projects, grandsnap.child('root').child('title').val()]
            })
          }
        })
      })
    })
    this.unsubscribe = () => {
      projectsRef.off('value', listener)
      project1Ref.off('value', listenerProjects)
    }
  }
  selectAtom = (atom) => {
    // evt.preventDefault()
    this.setState({ selected: atom })
  }
  render() {
    // const currentProject = this.state.projects[1] ? this.state.projects[1].current : {}
    const currentProject = this.state.project || { title: '', summary: '', notes: '', resources: '', text: '', atoms: {} }
    // console.log('state in appcontainer', this.state)
    // console.log('current project', currentProject)
    return (
      <div>
        <div className='col-lg-12'>
          <Toolbar projects={this.state.projects} />
        </div>
        <div className='col-lg-3 sidebar-right'>
          <Binder atoms={this.state.project.atoms} selectAtom={this.selectAtom} />
          <Trashcan project={currentProject} />
        </div>
        <div className='col-lg-6 project-center'>
          <Editor atom={this.state.selected} />
        </div>
        <div className='col-lg-3 sidebar-left'>
          <Notes atom={this.state.selected} />
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
