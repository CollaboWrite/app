import React from 'react'
import firebase from 'APP/server/db'
import Chat from './Chat'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      collaboratorEmail: '',
      collaborators: []
    }
  }
  componentDidMount() {
    const usersRef = firebase.database().ref('users')
    this.listenTo(usersRef)
  }
  listenTo = (ref) => {
    if (this.unsubscribe) this.unsubscribe()
    const listener = ref.on('child_added', snapshot => {
      const collaborations = snapshot.val().collaborations || {}
      console.log('what is collaborations', collaborations[this.props.projectId])
      if (collaborations[this.props.projectId] === 0 || collaborations[this.props.projectId]) {
        if (snapshot.val().uid !== this.props.uid) {
          this.setState({ collaborators: [...this.state.collaborators, { name: snapshot.val().name }] })
        }
      }
    })
    this.unsubscribe = () => {
      ref.off('value', listener)
    }
  }
  componentWillUnmount() {
    // When we unmount, stop listening.
    this.unsubscribe()
  }
  handleChange = (evt) => {
    evt.preventDefault()
    this.setState({ collaboratorEmail: evt.target.value })
  }
  handleSubmit = (evt) => {
    const findUserByEmail = firebase.database().ref('users').orderByChild('email').equalTo(this.state.collaboratorEmail)
    evt.preventDefault()
    findUserByEmail.on('value', snapshot => {
      const userObj = snapshot.val() // { uniqueKey: {}}
      const id = Object.keys(snapshot.val())[0] // grabs uniqueKey of user

      // if newCollaborator doesn't have any projects OR isn't the owner of THIS project
      // then they can be a collaborator
      if (!userObj[id].projects || !userObj[id].projects[this.props.projectId]) {
        const updates = {}
        const projectId = this.props.projectId
        const atomId = this.props.atomId
        updates['/users/' + id + '/collaborations/' + projectId] = atomId
        return firebase.database().ref().update(updates)
      }
    })
  }

  render() {
    const collaborators = this.state.collaborators
    return (
      <div className="panel panel-default">
        <div className='panel-heading'>
          <h3>Collaborators</h3>
        </div>
        <div className='panel-body'>
          <ul>
            {collaborators && collaborators.map((collab) => <li key={collab.name}>{collab.name}</li>)}
          </ul>
          <form onSubmit={this.handleSubmit}>
            <label>Collaborator Email</label>
            <input type='text' onChange={this.handleChange} />
            <button type='submit'>Add Collaborator</button>
          </form>
        </div>
        <Chat uid={this.props.uid} collaborators={this.props.collaborators} projectId={this.props.projectId} />
      </div>
    )
  }
}
