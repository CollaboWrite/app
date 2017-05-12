import React from 'react'

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
      project: {},
      root: null,
      binderView: []
    }
    this.listenTo = this.listenTo.bind(this)
  }

  componentDidMount() {
    // When the component mounts, start listening to the fireRef
    // we were given.
    const rootRef = projectsRef.child(this.props.params.id).child('current').child('root').once('value')
      .then(snapshot => { this.setState({ root: snapshot.val() }) })
      .then(() => this.listenTo(projectsRef.child(this.props.params.id).child('current'), projectsRef))
      .catch(error => console.error(error))
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
    const listener = projectRef.on('value', snapshot =>
      this.setState({ project: snapshot.val() })
    )
    const listenerProjects = projectsRef.on('value', snapshot => {
      snapshot.forEach(childsnap => {
        let title = childsnap.child('projectTitle').val()
        this.setState({ projects: [...this.state.projects, title] })
      })
    })
    const rootListener = projectRef.child('atoms').child(this.state.root).child('children').once('value', snapshot =>
      snapshot.forEach(childSnap => {
        projectRef.child('atoms').child(childSnap.key).once('value', childSnap => {
          this.setState({ binderView: [...this.state.binderView, [childSnap.key, childSnap.val()]] })
        })
      })
    )
    this.unsubscribe = () => {
      projectsRef.off('value', listener)
    }
  }

  handleExpand = (atomId) => {
    const projectId = this.props.params.id
    const atomPointer = firebase.database().ref('projects').child(projectId).child('current').child('atoms')
    firebase.database().ref('projects').child(projectId).child('current').child('atoms').child(atomId).child('children').on('value', childList => {
      childList.forEach(child => {
        atomPointer.child(child.key).once('value', atomSnap => {
          console.log('child.key is', child.key)
          console.log('atomSnap.val() is', atomSnap.val())
        })
      })
    })
  }

  render() {
    console.log(this.state.binderView)
    const uid = this.props.params.uid
    const projectId = this.props.params.id
    const atomId = this.props.params.atomId
    return (
      <div>
        <div className='col-lg-12'>
          <Toolbar projects={this.state.projects} projectId={projectId}/>
        </div>
        <div className='col-lg-3 sidebar-left'>
          <Binder handleExpand={this.handleExpand} uid={uid} atoms={this.state.binderView} projectId={projectId} />
          <Trashcan project={this.state.project} />
        </div>
        <div>
          <AtomEditor uid={uid} projectId={projectId} atomId={atomId} />
        </div>
        <div className='col-lg-3 sidebar-right'>
          <CollabForm projectId={projectId} atomId={atomId}/>
        </div>
      </div>
    )
  }
}
