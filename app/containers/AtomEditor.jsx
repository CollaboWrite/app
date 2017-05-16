import React from 'react'
import SplitPane from 'react-split-pane'
import ReactQuill from 'react-quill'

var Diff = require('text-diff')

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
      snapshotName: '',
      firstPaneText: '',
      secondPaneText: '',
      diffText: null,
      diffPane: false
    }
  }
  componentDidMount() {
    // When the component mounts, start listening to the fireRef
    // we were given.
    this.setState({ firstPrevAtomId: this.props.atomId, secondPrevAtomId: this.props.atomId })
  }
  componentWillReceiveProps(incoming) {
    const updatedAtomRef = projectsRef.child(this.props.projectId).child('current').child('atoms').child(incoming.atomId).child('text')

    if (this.state.selectedPane === 'firstPane') {
      this.setState({ firstPrevAtomId: incoming.atomId })
      this.listenToFirst(updatedAtomRef)
    }
    if (this.state.selectedPane === 'secondPane') {
      this.setState({ secondPrevAtomId: incoming.atomId })
      this.listenToSecond(updatedAtomRef)
    }
  }
  listenToFirst = (firstRef) => {
    firstRef.on('value', snapshot => {
      var text = snapshot.val()
      this.setState({firstPaneText: text})
    })
  }
  listenToSecond = (secondRef) => {
    secondRef.on('value', snapshot => {
      var text = snapshot.val()
      this.setState({secondPaneText: text})
    })
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
  compareDiff = (text1, text2) => {
    console.log('text 1', text1, ' text2', text2)
    this.setState({diffPane: !this.state.diffPane})
    var diff = new Diff() // options may be passed to constructor; see below var textDiff = diff.main('text1', 'text2'); // produces diff array
    var textDiff = diff.main(text1, text2) // produces diff array
    console.log('difftext', diff.prettyHtml(textDiff))
    this.setState({diffText: diff.prettyHtml(textDiff)}) // produces a formatted HTML string
  }
  // GAME PLAN:
  // 1. write a function that compares two inputs of text
  // 2. write a function that takes a pane (left/right) and the text & sets it to the state (function setPaneText)
  // 3. button that triggers comparison of two inputs (#1 inputs will be outputs of #2)
  clickDiff = (evt) => {
    evt.preventDefault()
    this.compareDiff(this.state.firstPaneText, this.state.secondPaneText)
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
            <button className='float-right' onClick={this.clickDiff}>Compare</button>
          </div>
          {(splitPane) ? ((this.state.diffPane) ? (<div><SplitPane className='splitPane' defaultSize="50%" >
              <Editor atomRef={firstPrevAtomRef} pane={'firstPane'} selectPane={this.selectPane} />
              <Editor atomRef={secondPrevAtomRef} pane={'secondPane'} selectPane={this.selectPane} />
            </SplitPane>
            <div>{this.state.diffText}</div></div>) : (<div><SplitPane className='splitPane' defaultSize="50%" >
              <Editor atomRef={firstPrevAtomRef} pane={'firstPane'} selectPane={this.selectPane} />
              <Editor atomRef={secondPrevAtomRef} pane={'secondPane'} selectPane={this.selectPane} />
            </SplitPane></div>)) : <Editor atomRef={ref} selectPane={this.selectPane} snapshot={this.snapshot} handleChange={this.handleChange} snapshotName={this.state.snapshotName} />
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



