import React from 'react'
import { Link, browserHistory } from 'react-router'
import firebase from 'APP/server/db'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      projectId: '',
      projectList: [],
      collabList: [],
      newProjectName: '',
      userKey: '',
      currentAtom: null,
      currentName: '',
      projectKeys: [],
      collabKeys: []
    }
  }
  componentDidMount = () => {
    const userId = this.props.user.uid
    const usersProjectsRef = firebase.database().ref('users').child(userId).child('projects')
    const usersCollabRef = firebase.database().ref('users').child(userId).child('collaborations')
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
          projectList: [...this.state.projectList, { title: currentProject.projectTitle, id: projectKey, currentAtom: currentProject.current.root }] })
      })
    })
    let innerCollabListener
    const collabListener = usersCollabRef.on('child_added', snapshot => {
      const collabKey = snapshot.key
      innerCollabListener = firebase.database().ref('projects').child(collabKey).on('value', project => {
        const currentProject = project.val()
        this.setState({
          collabKeys: [...this.state.collabKeys, collabKey],
          collabList: [...this.state.collabList, { title: currentProject.projectTitle, id: collabKey, currentAtom: currentProject.current.root }] })
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
    this.setState({newProjectName: ''})
    return firebase.database().ref().update(updates)
  }

  // ****** CHECK FOR USER & CREATE USER ****** //

  createUser = () => {
    const project = { 'Ella&Maritza': 55 }
    // create new user object
    const user = {
      name: this.props.user.displayName,
      email: this.props.user.email,
      uid: this.props.user.uid,
      projects: project
    }
    // finding user by current user's uid
    firebase.database().ref('users').orderByChild('uid').equalTo(this.props.user.uid).on('value', snapshot => {
      // if there is no user with current user's uid, set create new user in users db
      const userKey = Object.keys(snapshot.val())[0]
      if (!snapshot.val()) {
        firebase.database().ref('/users/' + this.props.user.uid).set(user)
      }
      this.setState({userKey: userKey, currentName: snapshot.val()[userKey].name})
    })
  }

  // ******* SELECT & NAV TO SELECTED PAGE ****** //

  goToPage = () => {
    browserHistory.push(`/${this.props.user.uid}/project/${this.state.projectId}/${this.state.currentAtom}`)
  }

  selectProject = (evt) => {
    // had to do this b/c value can only carry string
    const valueObj = evt.target.value.split(':')
    this.setState({ projectId: valueObj[0], currentAtom: +valueObj[1] })
  }

  render() {
    console.log(this.state)
    return (
      <div>
        <h2>Welcome, {this.props.user.displayName}</h2>
        <h3>Create a new project</h3>
        <form onSubmit={this.createProject}>
          <label>Project Name</label>
          <input type="text" value={this.state.newProjectName} onChange={this.setProjectName} />
          <button type="submit">Create</button>
        </form>
        <h3>Your Projects:</h3>
        <select onChange={this.selectProject}>
          <option> </option>
          {this.state.projectList.map(project => {
            const valueObj = project.id + ':' + project.currentAtom
            return (<option value={valueObj} key={project.id}>{project.title}</option>)
          })}
        </select>
        <button type='button' onClick={this.goToPage}>Go to project</button>
        <h3>Shared Projects:</h3>
        <select onChange={this.selectProject}>
          <option> </option>
          {this.state.collabList.map(collab => {
            const valueObj = collab.id + ':' + collab.currentAtom
            return (<option value={valueObj} key={collab.id}>{collab.title}</option>)
          })}
        </select>
        <button type='button' onClick={this.goToPage}>Go to project</button>
      </div>
    )
  }
}


// this.state.projectList map creates a 'valueObj' to pass into this.selectProject
// since we need to grab both the project id & current atom of the project into option's value


      // // getting keys from the user's database
      // const projectKeys = Object.keys(snapshot.val())
      // // we are putting the key for each key into the projectList
      // projectKeys.forEach(projectKey => {
      //   firebase.database().ref('projects').child(projectKey).on('value', snapshot => {
      //     const currentProject = snapshot.val()
      //     // add each project title into the projectsList - MUST BE DONE THIS WAY TO UPDATE STATE
      //     this.setState({ projectList: [...this.state.projectList, { title: currentProject.projectTitle, id: projectKey, currentAtom: currentProject.current.root }] })
      //   })
      // })
