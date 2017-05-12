import React from 'react'
import firebase from 'APP/server/db'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      collaboratorEmail: '',
    }
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
  }

  render() {
    return (
      <div className="panel panel-default">
        <div className='panel-heading'>
          <h3>Collaborators</h3>
        </div>
        <div className='panel-body'>
          <form onSubmit={this.handleSubmit}>
            <label>Collaborator Email</label>
            <input type='text' onChange={this.handleChange}/>
            <button type='submit'>Add Collaborator</button>
          </form>
        </div>
      </div>
    )
  }
}
