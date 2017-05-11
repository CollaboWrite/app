import React from 'react'
import { browserHistory } from 'react-router'
import firebase from 'APP/server/db'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      projectId: null,
      projectList: [],
      newProjectName: '',
      userKey: ''
    }
  }

  componentDidMount() {
    this.createUser()
    const userId = this.props.user.uid
    this.listenTo(firebase.database().ref('users').child(userId).child('projects'))
  }

  goToPage = (evt) => {
    browserHistory.push(`/project/${this.state.projectId}`)
  }

  selectProject = (evt) => {
    evt.preventDefault()
    this.setState({ projectId: evt.target.value })
  }

  setProjectName = (evt) => {
    evt.preventDefault()
    this.setState({ newProjectName: evt.target.value })
  }

  createProject = () => {
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

    const projectKey = firebase.database().ref('projects').push().key
    const updates = {}
    updates['/projects/' + projectKey] = project
    updates['/users/' + this.props.user.uid + '/projects/' + projectKey] = projectKey
    return firebase.database().ref().update(updates)
  }

  createUser = () => {
    const user = {
      name: this.props.user.displayName,
      email: this.props.user.email,
      uid: this.props.user.uid
    }

    firebase.database().ref('users').orderByChild('uid').equalTo(this.props.user.uid).once('value', snapshot => {
      if (!snapshot.val()) {
        firebase.database().ref('/users/' + this.props.user.uid).set(user)
      }
      this.setState({userKey: Object.keys(snapshot.val())[0]})
    })
  }

  listenTo = (userRef) => {
    if (this.unsubscribe) this.unsubscribe()
    const listener = userRef.on('value', snapshot => {
      console.log(snapshot.val())
      // getting keys from the user's database
      const projectKeys = Object.keys(snapshot.val())
      const projects = []
      // we are putting the key for each key into the projectList
      projectKeys.forEach(projectKey => {
        console.log('projectKey', projectKey)
        firebase.database().ref('projects').orderByKey().equalTo(projectKey).on('value', snapshot => {
          projects.push(snapshot.val()[projectKey].projectTitle)
        })
      }
      )
      this.setState({projectList: projects})
    })
    this.unsubscribe = () => {
      userRef.off('value', listener)
    }
  }
  // generateTitles = (list) => {
  //   const result = []
  //   for (let i = 0; i < list.length; i++) {
  //     result.push(<option key={i}>{list[i]}</option>)
  //   }
  //   return result
  // }
  render() {
    const projectList = this.state.projectList
    console.log(this.state)
    console.log('projectList', projectList)
    return (
      <div>
        <h2>Welcome, {this.props.user.displayName}</h2>
        <h3>Create a new project</h3>
        <form onSubmit={this.createProject}>
          <label>Project Name</label>
          <input type="text" onChange={this.setProjectName} />
          <button type="submit">Create</button>
        </form>
        <ul>
          {projectList && projectList.map(projectTitle => {
            return (<li>{projectTitle}</li>)
          })
          }
        </ul>
        <h3>Pick a project to view:</h3>

        <button type='button' onClick={this.goToPage}>Go to project</button>
      </div>
    )
  }
}

        // <select onChange={this.selectProject}>
        //   <option> </option>
        //   <option>{projectList[0]}</option>
        //   {/*this.generateTitles(projectList)*/}
        // </select>
