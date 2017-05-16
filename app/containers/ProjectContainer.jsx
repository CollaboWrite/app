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
    // When the component mounts, start listening to the fireRef
    // we were given.
    const currentProjectRef = firebase.database().ref('users').child(this.props.params.uid).child('viewingProject')
    const rootRef = projectsRef.child(this.props.params.id).child('current').child('root').once('value')
      .then(snapshot => { this.setState({ root: snapshot.val() }) })
      .then(() => this.listenTo(
        projectsRef.child(this.state.viewingProject).child('current')
        , projectsRef
        , currentProjectRef)
      )
      .catch(error => console.error(error))
  }
  componentWillUnmount() {
    // When we unmount, stop listening.
    this.unsubscribe()
  }
  // listen to the fireRef.child
  listenTo(projectRef, projectsRef, currentProjectRef) {
    // If we're already listening to a ref, stop listening there.
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
    const getBinder = (refOrRefId) => {
      let _projectRef = refOrRefId
      if (typeof refOrRefId === 'string') {
        _projectRef = projectsRef.child(refOrRefId).child('current')
      }
      return _projectRef.child('atoms').child('0').child('children').once('value', snapshot => {
        const newBinderView = []
        snapshot.forEach(childSnap => {
          _projectRef.child('atoms').child(childSnap.key).once('value', childSnap => {
            newBinderView.push([childSnap.key, childSnap.val(), 0, false])
          })
        })
        this.setState({binderView: newBinderView})
      })
    }
    const rootListener = getBinder(projectRef)
    const viewingProjectListener = currentProjectRef.on('value', snapshot => {
      const newViewingProject = snapshot.val()
      getBinder(newViewingProject)
      this.setState({ viewingProject: newViewingProject })
      browserHistory.push(`/${this.props.params.uid}/project/${newViewingProject}/0`)
    })
    this.unsubscribe = () => {
      projectsRef.off('child_added', projectsListener)
      projectsRef.off('child_added', collabsListener)
      projectRef.off('value', rootListener)
      currentProjectRef.off('value', viewingProjectListener)
    }
  }

  toggleProject = (evt) => {
    const projectId = evt.target.value
    firebase.database().ref('/users/' + this.props.params.uid + '/viewingProject').set(projectId)
  }

  toggleChildren = (atomId, ind, level, expanded) => {
    const projectId = this.props.params.id
    const atomPointer = firebase.database().ref('projects').child(projectId).child('current').child('atoms')
    atomPointer.child(atomId).child('children').on('value', childList => {
      const newBinderView = [...this.state.binderView]
      if (expanded) {
        newBinderView[ind][3] = false
        newBinderView.splice(++ind, Object.keys(childList.val()).length)
      } else {
        const newLevel = ++level
        newBinderView[ind][3] = true
        childList.forEach(child => {
          atomPointer.child(child.key).once('value', atomSnap => {
            const atomToPush = [child.key, atomSnap.val(), newLevel, false]
            newBinderView.splice(++ind, 0, atomToPush)
          })
        })
      }
      this.setState({ binderView: newBinderView })
    })
  }

  toggleAddedChildren = (atomId, ind, level, expanded) => {
    const projectId = this.props.params.id
    const atomPointer = firebase.database().ref('projects').child(projectId).child('current').child('atoms')
    atomPointer.child(atomId).child('children').on('value', childList => {
      const newBinderView = [...this.state.binderView]
      if (expanded) {
        newBinderView[ind][3] = false
        newBinderView.splice(++ind, Object.keys(childList.val()).length)
        this.setState({ binderView: newBinderView }, () => this.toggleChildren(atomId, ind, level, false))
      } else {
        const newLevel = ++level
        newBinderView[ind][3] = true
        childList.forEach(child => {
          atomPointer.child(child.key).once('value', atomSnap => {
            const atomToPush = [child.key, atomSnap.val(), newLevel, false]
            newBinderView.splice(++ind, 0, atomToPush)
          })
        })
        this.setState({ binderView: newBinderView })
      }

    })
  }

  render() {
    const uid = this.props.params.uid
    const projectId = this.state.viewingProject // Should this should be informed by users/uid/viewingProject?
    const atomId = this.props.params.atomId
    return (
      <div>
        <div className='col-xs-12'>
          <Toolbar projects={this.state.projects} projectId={projectId} toggleProject={this.toggleProject} />
        </div>
        <div className='col-xs-3 sidebar-left'>
          <Binder toggleChildren={this.toggleChildren} toggleAddedChildren={this.toggleAddedChildren} uid={uid} atoms={this.state.binderView} projectId={projectId} root={this.state.root} atomId={atomId} />
          <Trashcan />
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
