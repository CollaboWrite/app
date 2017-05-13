import React from 'react'
import { browserHistory } from 'react-router'
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
      currentAtom: null
    }
  }
  componentDidMount() {
    console.log('im mounting agian~~~')
    this.createUser()
    const userId = this.props.user.uid
    const usersProjectsRef = firebase.database().ref('users').child(userId).child('projects')
    // TO DO: to get collaborations
    const usersCollabRef = firebase.database().ref('users').child(userId).child('collaborations')
    this.listenTo(usersProjectsRef, usersCollabRef)
  }
  listenTo = (usersProjectsRef, usersCollabRef) => {
    console.log('listening....')
    if (this.unsubscribe) this.unsubscribe()
    const projectListener = usersProjectsRef.on('child_added', snapshot => {
      const userProjectKey = snapshot.val()
      firebase.database().ref('projects').child(userProjectKey).on('value', project => {
        const currentProject = project.val()
        console.log('key', userProjectKey)
        console.log('current project', currentProject)
        this.setState({ projectList: [...this.state.projectList, { title: currentProject.projectTitle, id: userProjectKey, currentAtom: currentProject.current.root }] })
      })
      console.log('what is this projectListener doing', snapshot.val())
    })

    const collabListener = usersCollabRef.on('value', snapshot => {
      const collabKeys = Object.keys(snapshot.val())
      // we are putting the key for each key into the projectList
      collabKeys.forEach(collabKey => {
        firebase.database().ref('projects').child(collabKey).on('value', snapshot => {
          const currentCollab = snapshot.val()
          // add each project title into the projectsList - MUST BE DONE THIS WAY TO UPDATE STATE
          this.setState({ collabList: [...this.state.collabList, { title: currentCollab.projectTitle, id: collabKey, currentAtom: currentCollab.current.root }] })
        })
      })
    })

    this.unsubscribe = () => {
      usersProjectsRef.off('value', projectListener)
      usersCollabRef.off('value', collabListener)
    }
  }
  componentWillUnmount() {
    console.log('Im unmounting!')
    this.unsubscribe()
  }

  // ****** CREATE NEW PROJECTS ****** //

  setProjectName = (evt) => {
    evt.preventDefault()
    this.setState({ newProjectName: evt.target.value })
  }
  createProject = (evt) => {
    evt.preventDefault()
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

  // ****** CHECK FOR USER & CREATE USER ****** //

  createUser = () => {
    const project = {'Ella&Maritza': 55}
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
      if (!snapshot.val()) {
        firebase.database().ref('/users/' + this.props.user.uid).set(user)
      }
      this.setState({ userKey: Object.keys(snapshot.val())[0] })
    })
  }

  // ******* SELECT & NAV TO SELECTED PAGE ****** //

  goToPage = (evt) => {
    // this needs to navigate to project selected, then to current atom on that project ${this.props.user.uid}
    browserHistory.push(`/${this.props.user.uid}/project/${this.state.projectId}/${this.state.currentAtom}`)
  }

  selectProject = (evt) => {
    // console.log('select project id & atom', evt.target.value)
    // had to do this b/c value can only carry string
    const valueObj = evt.target.value.split(':')
    this.setState({ projectId: valueObj[0], currentAtom: +valueObj[1] })
  }

  render() {
    console.log('this is the stae', this.state)
    return (
      <div>
        <h2>Welcome, {this.props.user.displayName}</h2>
        <h3>Create a new project</h3>
        <form onSubmit={this.createProject}>
          <label>Project Name</label>
          <input type="text" onChange={this.setProjectName} />
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
