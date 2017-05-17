import React from 'react'
import firebase from 'APP/server/db'
import Chat from './Chat'

export default class CollabForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      collaboratorEmail: '',
      collaborators: [],
      collabKeys: []
    }
  }
  componentDidMount() {
    const collaboratorsRef = firebase.database().ref('projects').child(this.props.projectId).child('collaborators')
    this.listenTo(collaboratorsRef)
  }
  componentWillReceiveProps(incoming) {
    if (incoming.projectId !== this.props.projectId) {
      const collaboratorsRef = firebase.database().ref('projects').child(incoming.projectId).child('collaborators')
      this.setState({ collaborators: [], collabKeys: [] }, () => this.listenTo(collaboratorsRef))
    }
  }

  listenTo = (ref) => {
    if (this.unsubscribe) this.unsubscribe()
    // listen to each child on 'collaborators' branch for this project
    const listener = ref.on('child_added', snapshot => {
      // if the id matches current user, don't display him/herself as collaborators
      if (snapshot.key !== this.props.uid) {
        this.setState({ collaborators: [...this.state.collaborators, snapshot.val()], collabKeys: [...this.state.collabKeys, snapshot.key] })
      }
    })
    const removedCollabListener = ref.on('child_removed', snapshot => {
      // snapshot is  the removed user node
      // snapshot.key === uid, snapshot.val() === user name
      // deletes collaborator reference to this project under the removed user collaborator
      firebase.database().ref('users').child(snapshot.key).child('collaborations').child(this.props.projectId).remove()
      const collabCopy = this.state.collaborators.slice()
      const collabKeysCopy = this.state.collabKeys.slice()
      const deletedUserIndex = this.state.collabKeys.indexOf(snapshot.key)
      collabCopy.splice(deletedUserIndex, 1)
      collabKeysCopy.splice(deletedUserIndex, 1)
      this.setState({ collaborators: collabCopy, collabKeys: collabKeysCopy })
    })
    
    this.unsubscribe = () => ref.off('child_added', listener)
    this.unsubscribe = () => ref.off('child_removed', removedCollabListener)
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
    findUserByEmail.once('value', snapshot => {
      if (!snapshot.val()) {
        window.alert('Please enter a contributor email for a user who has an account with us!')
        this.setState({ collaboratorEmail: '' })
      }
      const userObj = snapshot.val() // { uniqueKey: {}}
      const id = Object.keys(snapshot.val())[0] // grabs uniqueKey of user
      // if newCollaborator doesn't have any projects OR isn't the owner of THIS project
      // then they can be a collaborator
      if ((!userObj[id].projects || !userObj[id].projects[this.props.projectId]) && (!userObj[id].collaborations || !userObj[id].collaborations[this.props.projectId])) {
        const updates = {}
        const projectId = this.props.projectId
        const atomId = this.props.atomId
        const name = userObj[id].name
        updates['/projects/' + projectId + '/collaborators/' + id] = name // saves {id: name} of new collaborator
        updates['/users/' + id + '/collaborations/' + projectId] = atomId // saves {projectId: root} for in collab field for new collaborator
        this.setState({ collaboratorEmail: '' })
        return firebase.database().ref().update(updates)
      } else {
        window.alert('This user is already a collaborator!')
      }
      this.setState({ collaboratorEmail: '' })
    })
  }
  deleteCollab = (name, uid) => {
    // deletes user from the collaborator list under the project, which triggers the removedCollabListener listener above
    firebase.database().ref('projects').child(this.props.projectId).child('collaborators').child(uid).remove()
  }
  render() {
    const collaborators = this.state.collaborators
    return (
      <div className="panel">
        <div className='panel-heading'>
          <h3 className='panel-head'>Collaborators</h3>
        </div>
        <div className='panel-body'>
          <ul>
            {collaborators && collaborators.map((collab, idx) => {
              return (
                <div key={collab}>
                  <li className='collab-list'>
                    {collab}
                    <span className='fa fa-times delete-collab'
                      onClick={() => this.deleteCollab(collab, this.state.collabKeys[idx])}>
                    </span>
                  </li>
                </div>)
            })}
          </ul>
        </div>
        <form className='form-bar' onSubmit={this.handleSubmit}>
            <label>Email:</label>
            <input value={this.state.collaboratorEmail} type='text' onChange={this.handleChange} value={this.state.collaboratorEmail} />
            <button className='form-button' type='submit'><span className='form-icon' className='fa fa-arrow-circle-up' /></button>
          </form>
      </div>
    )
  }
}
