import React from 'react'
import { browserHistory } from 'react-router'
import firebase from 'APP/server/db'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      projectId: '',
      projectList: [],
      newProjectName: '',
      userKey: '',
      currentAtom: null
    }
    // this.generateList = this.generateList.bind(this)
  }

  componentDidMount() {
    this.createUser()
    const userId = this.props.user.uid
    this.listenTo(firebase.database().ref('users').child(userId).child('projects'))
  }

  goToPage = (evt) => {
    console.log('project id', this.state.projectId)
    browserHistory.push(`/project/${this.state.projectId}/${this.state.currentAtom}`) // this needs to navigate to project selected, then to current location on that project
  }

  selectProject = (evt) => {
    console.log('select project id & atom', evt.target.value)
    const valueObj = evt.target.value.split(':')
    this.setState({ projectId: valueObj[0], currentAtom: +valueObj[1] })
  }

  setProjectName = (evt) => {
    evt.preventDefault()
    this.setState({ newProjectName: evt.target.value })
  }

  createProject = () => {
    // create project object to add to projects db
    const project = {
      projectTitle: this.state.newProjectName,
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

    // create a new 'key' under 'projects' db
    const projectKey = firebase.database().ref('projects').push().key

    // create updates object
    const updates = {}
    // update projects db with new project
    updates['/projects/' + projectKey] = project
    // update users db at the current user's object with new {project key: project key} object
    updates['/users/' + this.props.user.uid + '/projects/' + projectKey] = projectKey
    return firebase.database().ref().update(updates)
  }

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
      if (!snapshot.val()) {
        firebase.database().ref('/users/' + this.props.user.uid).set(user)
      }
      this.setState({ userKey: Object.keys(snapshot.val())[0] })
    })
  }

  listenTo = (userRef) => {
    if (this.unsubscribe) this.unsubscribe()
    const listener = userRef.on('value', snapshot => {
      // getting keys from the user's database
      const projectKeys = Object.keys(snapshot.val())
      // we are putting the key for each key into the projectList
      projectKeys.forEach(projectKey => {
        firebase.database().ref('projects').child(projectKey).on('value', snapshot => {
          const currentProject = snapshot.val()
          console.log('current root', currentProject.current.root)
          // add each project title into the projectsList - MUST BE DONE THIS WAY TO UPDATE STATE
          this.setState({projectList: [...this.state.projectList, {title: currentProject.projectTitle, id: projectKey, currentAtom: currentProject.current.root}]})
        })
      })
    })
    this.unsubscribe = () => {
      userRef.off('value', listener)
    }
  }
  render() {
    console.log('state in userpage', this.state)
    return (
      <div>
        <h2>Welcome, {this.props.user.displayName}</h2>
        <h3>Create a new project</h3>
        <form onSubmit={this.createProject}>
          <label>Project Name</label>
          <input type="text" onChange={this.setProjectName} />
          <button type="submit">Create</button>
        </form>
        <h3>Pick a project to view:</h3>
        <select onChange={this.selectProject}>
        <option> </option>
        {this.state.projectList.map(project => {
          const valueObj = project.id + ':' + project.currentAtom
          return (<option value={valueObj} key={project.id}>{project.title}</option>)
        })}
        </select>
        <button type='button' onClick={this.goToPage}>Go to project</button>
      </div>
    )
  }
}
