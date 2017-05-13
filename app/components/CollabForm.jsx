import React from 'react'
import firebase from 'APP/server/db'
import Chat from './Chat'

export default class extends React.Component {
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
  listenTo = (ref) => {
    if (this.unsubscribe) this.unsubscribe()
    // listen to each child on 'collaborators' branch for this project
    const listener = ref.on('child_added', snapshot => {
      // if the id matches current user, don't display him/herself as collaborators
      if (snapshot.key !== this.props.uid) {
        this.setState({collaborators: [...this.state.collaborators, snapshot.val()]}) // gets the NAME value
      }
      if (snapshot.key !== this.props.uid) {
        this.setState({collabKeys: [...this.state.collabKeys, snapshot.key]}) // gets the uid value
      }
    })
    const removedCollabListener = ref.on('child_removed', snapshot => {
      // snapshot is  the removed user node
      // snapshot.key === uid, snapshot.val() === user name
      // deletes collaborator reference to this project under the removed user collaborator
      firebase.database().ref('users').child(snapshot.key).child('collaborations').child(this.props.projectId).remove()
      const deletedUserIndex = this.state.collabKeys.indexOf(snapshot.key)
      this.setState({collaborators: this.state.collaborators.splice(deletedUserIndex-1, 1), collabKeys: this.state.collabKeys.splice(deletedUserIndex-1, 1)})
  })
    this.unsubscribe = () => ref.off('value', listener)
    this.unsubscribe = () => ref.off('value', removedCollabListener)
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
        const name = userObj[id].name
        updates['/projects/' + projectId + '/collaborators/' + id] = name // saves {id: name} of new collaborator
        updates['/users/' + id + '/collaborations/' + projectId] = atomId // saves {projectId: root} for in collab field for new collaborator
        return firebase.database().ref().update(updates)
      }
    })
  }
  deleteCollab = (name, uid) => {
    // deletes user from the collaborator list under the project, which triggers the removedCollabListener listener above
    firebase.database().ref('projects').child(this.props.projectId).child('collaborators').child(uid).remove()
  }
  render() {
    // console.log('state', this.state)
    // console.log('props', this.props)  
    const collaborators = this.state.collaborators
    return (
      <div className="panel panel-default">
        <div className='panel-heading'>
          <h3>Collaborators</h3>
        </div>
        <div className='panel-body'>
          <ul>
            {collaborators && collaborators.map((collab, idx) => {
              return (
                <div>
                  <li className='collab-list' key={collab}>
                    {collab}
                    <span className='fa fa-times delete-collab' 
                          onClick={() => this.deleteCollab(collab, this.state.collabKeys[idx])}>
                    </span>
                  </li>
                </div>)
              }) }
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
