import React from 'react'
import Tree from './Tree'
import Infinite from 'react-infinite'
import firebase from 'APP/server/db'
const projectsRef = firebase.database().ref('projects')

export default class Binder extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      snapshotName: ''
    }
  }
  handleChange = (evt) => {
    this.setState({ snapshotName: evt.target.value })
  }

  snapshot = (evt) => {
    evt.preventDefault()
    projectsRef.child(this.props.projectId).once('value', snapshot => {
      const snapshotObj = snapshot.val()
      snapshotObj.title = this.state.snapshotName
      snapshotObj.timeStamp = Date.now() // can format as needed
      snapshotObj.snapshots = null // removing snapshots of new snapshot to preserve space
      snapshotObj.messages = null // removing messages of new snapshot to preserve space
      snapshotObj.collaborators = null // removing collaborators from snapshot
      projectsRef.child(this.props.projectId + '/snapshots').push(snapshotObj)
    })
    this.setState({ snapshotName: '' })
  }
  render() {
    return (
      <div className='panel'>
        <div className='panel-heading'>
          <h3 className='panel-head'>Binder</h3>
        </div>
        <Infinite containerHeight={400} elementHeight={26}>
          <div className='panel-body'>
            <ul id='binder' className='binder-list'><Tree expanded={true} uid={this.props.uid} projectId={this.props.projectId} atomId='0' /></ul>
          </div>
        </Infinite>
        <form className='form-bar' onSubmit={this.snapshot}>
          <label>Save as:</label>
          <input type='text' onChange={this.handleChange} value={this.state.snapshotName} />
          <button className='form-button' type="submit" ><span className='form-icon' className='fa fa-bookmark' /></button>
        </form>
      </div>
    )
  }
}
