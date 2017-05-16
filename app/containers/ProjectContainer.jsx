import React from 'react'
import { browserHistory } from 'react-router'

import firebase from 'APP/server/db'
import Toolbar from '../components/Toolbar'
import Binder from '../components/Binder'
import Trashcan from '../components/Trashcan'
import AtomEditor from './AtomEditor'
import CollabForm from '../components/CollabForm'

const projectsRef = firebase.database().ref('projects')

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      projects: {},
      root: null,
      binderView: [],
      viewingProject: this.props.params.id
    }
    this.listenTo = this.listenTo.bind(this)
  }

  componentDidMount() {
    const currentProjectRef = firebase.database().ref('users').child(this.props.params.uid).child('viewingProject')
    this.listenTo(
      projectsRef.child(this.state.viewingProject).child('current')
      , projectsRef
      , currentProjectRef)
  }
  componentWillUnmount() {
    this.unsubscribe()
  }

  listenTo(projectRef, projectsRef, currentProjectRef) {
    if (this.unsubscribe) this.unsubscribe()
    // grabs THIS user's projects and adds it as an object {projectKey: projectTitle}
    const projectsListener = firebase.database().ref(`/users/${this.props.params.uid}/projects`).on('child_added', projectSnap => {
      // making a projects obj to add to projects list
      const projectObj = {}
      projectObj.key = projectSnap.key
      projectsRef.child(projectSnap.key).on('value', project => {
        projectObj.title = project.val().projectTitle
        this.setState({ projects: [...this.state.projects, projectObj] })
      })
    })
    const collabsListener = firebase.database().ref(`/users/${this.props.params.uid}/collaborations`).on('child_added', projectSnap => {
      // making a projects obj to add to projects list
      const projectObj = {}
      projectObj.key = projectSnap.key
      projectsRef.child(projectSnap.key).child('projectTitle').on('value', project => {
        projectObj.title = project.val()
        this.setState({ projects: [...this.state.projects, projectObj] })
      })
    })
    const viewingProjectListener = currentProjectRef.on('value', snapshot => {
      const newViewingProject = snapshot.val()
      this.setState({ viewingProject: newViewingProject })
      browserHistory.push(`/${this.props.params.uid}/project/${newViewingProject}/0`)
    })
    this.unsubscribe = () => {
      projectsRef.off('child_added', projectsListener)
      projectsRef.off('child_added', collabsListener)
      currentProjectRef.off('value', viewingProjectListener)
    }
  }

  toggleProject = (evt) => {
    const projectId = evt.target.value
    firebase.database().ref('/users/' + this.props.params.uid + '/viewingProject').set(projectId)
  }

  render() {
    const uid = this.props.params.uid
    const projectId = this.state.viewingProject
    const atomId = this.props.params.atomId
    return (
      <div>
        <div className='col-xs-12'>
          <Toolbar projects={this.state.projects} projectId={projectId} toggleProject={this.toggleProject} />
        </div>
        <div className='col-xs-3 sidebar-left'>
          <Binder uid={uid} projectId={projectId} />
        </div>
        <div>
          <AtomEditor uid={uid} projectId={projectId} atomId={atomId} />
        </div>
        <div className='col-xs-3 sidebar-right'>
          <CollabForm uid={uid} projectId={projectId} atomId={atomId} />
        </div>
      </div>
    )
  }
}
