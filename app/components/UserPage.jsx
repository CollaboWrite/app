import React from 'react'
import { Link, browserHistory } from 'react-router'
import firebase from 'APP/server/db'

const { projectRef, userRef } = require('APP/server/db/model')

export default class UserPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      projectId: '',
      projectList: [],
      collabList: [],
      newProjectName: '',
      userKey: '',
      currentName: '',
      projectKeys: [],
      collabKeys: []
    }
  }
  componentDidMount = () => {
    const userId = this.props.user.uid
    const usersProjectsRef = userRef(userId).child('projects')
    const usersCollabRef = userRef(userId).child('collaborations')
    this.listenTo(usersProjectsRef, usersCollabRef)
    this.createUser()
  }
  listenTo = (usersProjectsRef, usersCollabRef) => {
    if (this.unsubscribe) this.unsubscribe()
    let innerProjectListener
    const projectListener = usersProjectsRef.on('child_added', snapshot => {
      const projectKey = snapshot.key
      innerProjectListener = firebase.database().ref('projects').child(projectKey).on('value', project => {
        const currentProject = project.val()
        this.setState({
          projectKeys: [...this.state.projectKeys, projectKey],
          projectList: [...this.state.projectList, { title: currentProject.projectTitle, id: projectKey }]
        })
      })
    })
    let innerCollabListener
    const collabListener = usersCollabRef.on('child_added', snapshot => {
      const collabKey = snapshot.key
      innerCollabListener = firebase.database().ref('projects').child(collabKey).on('value', project => {
        const currentProject = project.val()
        this.setState({
          collabKeys: [...this.state.collabKeys, collabKey],
          collabList: [...this.state.collabList, { title: currentProject.projectTitle, id: collabKey }]
        })
      })
    })
    this.unsubscribe = () => {
      usersProjectsRef.off('child_added', projectListener)
      usersCollabRef.off('child_added', collabListener)
      // unsubscribing from each 'value' loop above
      this.state.projectKeys.forEach(key => {
        firebase.database().ref('projects').child(key).off('value', innerProjectListener)
      })
      this.state.collabKeys.forEach(key => {
        firebase.database().ref('projects').child(key).off('value', innerCollabListener)
      })
    }
  }
  componentWillUnmount = () => this.unsubscribe()

  // ****** CREATE NEW PROJECTS ****** //

  setProjectName = (evt) => {
    evt.preventDefault()
    this.setState({ newProjectName: evt.target.value })
  }
  createProject = (evt) => {
    evt.preventDefault()
    // create project object to add to projects db
    const uid = this.props.user.uid
    const collaboratorsObj = {}
    const userKey = this.state.userKey
    collaboratorsObj[userKey] = this.state.currentName
    const project = {
      projectTitle: this.state.newProjectName,
      collaborators: collaboratorsObj,
      current: {
        atoms: {
          '0': {
            title: this.state.newProjectName,
            type: 'Project',
          }
        },
        root: '0'
      }
    }

    const updates = {}
    // create a new 'key' under 'projects' db
    const projectKey = firebase.database().ref('projects').push().key
    // update projects db with new project
    updates['/projects/' + projectKey] = project
    // update users db at the current user's object with new {project key: project key} object
    updates['/users/' + this.props.user.uid + '/projects/' + projectKey] = '0'
    // set the new project as the viewingProject
    updates['/users/' + this.props.user.uid + '/viewingProject'] = projectKey
    // redirect to the newly created project's root
    browserHistory.push(`/${this.props.user.uid}/project/${projectKey}/0`)
    this.setState({ newProjectName: '' })
    return firebase.database().ref().update(updates)
  }

  // ****** CHECK FOR USER & CREATE USER ****** //

  createUser = () => {
    // create new user object
    const user = {
      name: this.props.user.displayName,
      email: this.props.user.email,
      uid: this.props.user.uid
    }
    // finding user by current user's uid
    firebase.database().ref('users').orderByChild('uid').equalTo(this.props.user.uid).on('value', snapshot => {
      // if there is no user with current user's uid, set create new user in users db
      const userKey = this.props.user.uid
      if (!snapshot.val()) {
        firebase.database().ref('/users/' + this.props.user.uid).set(user)
      }
      this.setState({ userKey: userKey, currentName: snapshot.val()[userKey].name })
    })
  }

  // ******* SELECT & NAV TO SELECTED PAGE ****** //

  goToPage = () => {
    userRef(this.props.user.uid).child('viewingProject').set(this.state.projectId)
    browserHistory.push(`/${this.props.user.uid}/project/${this.state.projectId}/0`)
  }

  selectProject = (evt) => {
    // had to do this b/c value can only carry string
    this.setState({ projectId: evt.target.value })
  }

  render() {
    return (
      <div className='user-page'>
        <div className='left welcome-div'>
          <h2 id='welcome'>Welcome, {this.props.user.displayName}</h2>
        </div>

        <div className='right welcome-div'>
          <button className='mui-btn mui-btn--raised' onClick={() => this.props.auth.signOut()}>logout</button>
        </div>

        <div className='clearfix'></div>
        <div className='project-selection form-group mui--text-center'>

          <form onSubmit={this.createProject}>
            <h3>Create Project:</h3>
            <input type='text' className='form-control projects-option' onChange={this.setProjectName} />
            <button type='submit' className='mui-btn mui-btn--raised btn-color'>Create</button>
          </form>
          <h3>Your Projects:</h3>
          <div className='form-group inline-form'>
            <select onChange={this.selectProject} className='form-control projects-option'>
              <option> </option>
              {this.state.projectList.map(project =>
                <option value={project.id} key={project.id}>{project.title}</option>
              )}
            </select>
            <button type='button' className='mui-btn mui-btn--raised btn-color' onClick={this.goToPage}>Go</button>
          </div>
          <h3>Shared Projects:</h3>
          <div className='form-group'>
            <select onChange={this.selectProject} className='form-control projects-option'>
              <option> </option>
              {this.state.collabList.map(collab =>
                <option value={collab.id} key={collab.id}>{collab.title}</option>
              )}
            </select>
            <button type='button' className='mui-btn mui-btn--raised btn-color' onClick={this.goToPage}>Go</button>
          </div>
        </div>
      </div>
    )
  }
}
