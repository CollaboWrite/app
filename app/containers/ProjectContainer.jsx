import React from 'react'
import { browserHistory } from 'react-router'

import firebase from 'APP/server/db'
import Toolbar from '../components/Toolbar'
import Binder from '../components/Binder'
import Trashcan from '../components/Trashcan'
import AtomEditor from './AtomEditor'
import CollabForm from '../components/CollabForm'
import Chat from '../components/Chat'

const projectsRef = firebase.database().ref('projects')

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      projects: [],
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
      projectsRef.child(projectSnap.key).on('value', project => {
        if (project.val()) {
          this.setState({ projects: [...this.state.projects, [project.key, project.val()]] })
        }
      })
    })
    const collabsListener = firebase.database().ref(`/users/${this.props.params.uid}/collaborations`).on('child_added', projectSnap => {
      projectsRef.child(projectSnap.key).on('value', project => {
        if (project.val()) {
          this.setState({ projects: [...this.state.projects, [project.key, project.val()]] })
        }
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

  handleChange = (evt) => {
    this.setState({ snapshotName: evt.target.value })
  }

  snapshot = (evt) => {
    evt.preventDefault()
    projectsRef.child(this.state.viewingProject).once('value', snapshot => {
      const snapshotObj = snapshot.val()
      snapshotObj.title = this.state.snapshotName
      snapshotObj.timeStamp = Date.now() // can format as needed
      snapshotObj.snapshots = null // removing snapshots of new snapshot to preserve space
      snapshotObj.messages = null // removing messages of new snapshot to preserve space
      snapshotObj.collaborators = null // removing collaborators from snapshot
      projectsRef.child(this.state.viewingProject + '/snapshots').push(snapshotObj)
    })
    this.setState({ snapshotName: '' })
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
          <form className="inline-form" onSubmit={this.snapshot}>
            <label>Save current version as: </label>
            <input type='text' onChange={this.handleChange} value={this.state.snapshotName} />
            <button className='btn btn-xs' type="submit" >Save</button>
          </form>
          <CollabForm uid={uid} projectId={projectId} atomId={atomId} />
        </div>
        <div>
          <AtomEditor uid={uid} projectId={projectId} atomId={atomId} />
        </div>
        <div className='col-xs-3 sidebar-right'>
          <Chat uid={uid} projectId={projectId} />          
        </div>
      </div>
    )
  }
}
