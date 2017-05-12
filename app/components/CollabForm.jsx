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
    const listener = ref.on('value', snapshot => {
      snapshot.forEach(childSnap => {
        const collaborations = childSnap.val().collaborations || {}
        if (collaborations[this.props.projectId] === 0 || collaborations[this.props.projectId]) {
          this.setState({collaborators: [...this.state.collaborators, {name: childSnap.val().name}]})
        }
      })
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
    this.setState({collaboratorEmail: evt.target.value})
  }
  handleSubmit = (evt) => {
    evt.preventDefault()
    firebase.database().ref('users').orderByChild('email').equalTo(this.state.collaboratorEmail).on('value', snapshot => {
      const id = Object.keys(snapshot.val())[0]
      const updates = {}
      const projectId = this.props.projectId
      const atomId = this.props.atomId
      updates['/users/' + id + '/collaborations/' + projectId] = atomId

      return firebase.database().ref().update(updates)
    })
    const usersRef = firebase.database().ref('users')
    this.listenTo(usersRef)
    this.setState({collaboratorEmail: ''}) // doesn't clear it out after adding a new collaborator...look into later?
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
            {collaborators && collaborators.map((collab) => <li key={collab.name}>{collab.name}</li>) }
          </ul>
          <form onSubmit={this.handleSubmit}>
            <label>Collaborator Email</label>
            <input type='text' onChange={this.handleChange}/>
            <button type='submit'>Add Collaborator</button>
          </form>
        </div>
        <Chat uid={this.props.uid} collaborators={this.props.collaborators} projectId={this.props.projectId}/>
      </div>
    )
  }
}
