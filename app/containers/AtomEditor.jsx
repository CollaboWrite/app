import React from 'react'
import SplitPane from 'react-split-pane'

import Editor from '../components/Editor'
import Notes from '../components/Notes'
import Summary from '../components/Summary'
import Resources from '../components/Resources'

import firebase from 'APP/server/db'
const projectsRef = firebase.database().ref('projects')

export default class AtomEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      splitPane: false,
      selectedPane: '',
      firstPrevAtomId: '',
      secondPrevAtomId: '',
      atomVal: {},
      snapshotName: ''
    }
  }
  componentDidMount() {
    // When the component mounts, start listening to the fireRef
    // we were given.
    this.setState({ firstPrevAtomId: this.props.atomId, secondPrevAtomId: this.props.atomId })
  }
  componentWillReceiveProps(incoming) {
    if (this.state.selectedPane === 'firstPane') {
      this.setState({ firstPrevAtomId: incoming.atomId })
    }
    if (this.state.selectedPane === 'secondPane') {
      this.setState({ secondPrevAtomId: incoming.atomId })
    }
  }
  // toggle button between not split/split
  toggleSplit = (evt) => {
    evt.preventDefault()
    this.setState({ splitPane: !this.state.splitPane })
  }
  selectPane = (val) => {
    // if firstPane selected, set current selectedPane to this
    // same for secondPane
    if (val === 'firstPane') {
      this.setState({ selectedPane: val })
    } else if (val === 'secondPane') {
      this.setState({ selectedPane: val })
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
    const ref = projectsRef.child(this.props.projectId).child('current').child('atoms').child(this.props.atomId)
    const splitPane = this.state.splitPane
    const firstAtomId = this.state.firstPrevAtomId || this.props.atomId
    const secondAtomId = this.state.secondPrevAtomId || this.props.atomId
    // if prevAtomId exists for either panes, send the prevRef is null
    const firstPrevAtomRef = projectsRef.child(this.props.projectId).child('current').child('atoms').child(firstAtomId)
    const secondPrevAtomRef = projectsRef.child(this.props.projectId).child('current').child('atoms').child(secondAtomId)
    // if splitPane is true, pass down atomRef to just the selected pane & show render <SplitPane> with two <Editor> components as 'children'
    // else, just show the old Editor
    return (
      <div>
        <div className='col-xs-6 project-center'>
          <div className="block clearfix">
            <form className="inline-form" onSubmit={this.snapshot}>
              <label>Save current version as: </label>
              <input type='text' onChange={this.handleChange} value={this.state.snapshotName} />
              <button className='btn btn-xs' type="submit" >Save</button>
            </form>
            <button className='float-right' onClick={this.toggleSplit}>Vertical Split View</button>
          </div>
          {(splitPane) ? <SplitPane className='splitPane' defaultSize="50%" maxSize={50} >
            <Editor atomRef={firstPrevAtomRef} pane={'firstPane'} selectPane={this.selectPane} />
            <Editor atomRef={secondPrevAtomRef} pane={'secondPane'} selectPane={this.selectPane} />
          </SplitPane>
            : <Editor atomRef={ref} selectPane={this.selectPane} snapshot={this.snapshot} handleChange={this.handleChange} snapshotName={this.state.snapshotName} />
          }
        </div>
        <div className='col-xs-3 sidebar-right'>
          {(splitPane) ?
            ((this.state.selectedPane === 'firstPane') ? <Summary atomRef={firstPrevAtomRef} /> : <Summary atomRef={secondPrevAtomRef} />) :
            <Summary atomRef={ref} />
          }
          {(splitPane) ?
            ((this.state.selectedPane === 'firstPane') ? <Notes atomRef={firstPrevAtomRef} /> : <Notes atomRef={secondPrevAtomRef} />) :
            <Notes atomRef={ref} />
          }
        </div>
      </div>
    )
  }
}
