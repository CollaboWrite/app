import React from 'react'
import SplitPane from 'react-split-pane'
import Editor from '../components/Editor'
import firebase from 'APP/server/db'

import { atomRef, snapshotRef } from 'APP/server/db/model'

const Diff = require('text-diff')
const Infinite = require('react-infinite')

export default class ComparisonView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      snapshots: [],
      snapshotId: '',
      snapshotText: '',
      currentText: '',
      diffText: null,
    }
  }

  componentDidMount() {
    let selectedSnapshotRef
    if (this.state.snapshotId !== '') selectedSnapshotRef = snapshotRef(this.props.projectId, this.state.snapshotId, this.props.atomId)

    const snapshotsRef = firebase.database().ref('projects').child(this.props.projectId).child('snapshots')

    const currentAtomRef = atomRef(this.props.projectId, this.props.atomId).child('text')

    this.listenTo(snapshotsRef, currentAtomRef, selectedSnapshotRef)
  }

  componentWillReceiveProps(incoming) {
    if (incoming.projectId !== this.props.projectId || incoming.atomId !== this.props.atomId) {
      let selectedSnapshotRef
      if (this.state.snapshotId !== '') selectedSnapshotRef = snapshotRef(incoming.projectId, this.state.snapshotId, incoming.atomId)

      const snapshotsRef = firebase.database().ref('projects').child(incoming.projectId).child('snapshots')

      const currentAtomRef = atomRef(incoming.projectId, incoming.atomId).child('text')

      this.listenTo(snapshotsRef, currentAtomRef, selectedSnapshotRef)
    }
  }

  listenTo = (snapshotsRef, currentAtomRef, snapshotRef) => {
    snapshotsRef.once('value', snapshot => {
      const snapshotArr = []
      snapshot.forEach(childSnap => {
        const snapshotObj = {}
        snapshotObj.key = childSnap.key
        snapshotObj.title = childSnap.val().title
        snapshotArr.push(snapshotObj)
      })

      this.setState({ snapshots: snapshotArr })
    })

    if (snapshotRef) snapshotRef.on('value', snapshot => this.setState({ snapshotText: snapshot.val() }))

    currentAtomRef.on('value', snapshot => this.setState({ currentText: snapshot.val() }))
  }

  compareDiff = (text1, text2) => {
    // const slicedText1 = text1.slice(3, text1.length - 4)
    // const slicedText2 = text2.slice(3, text2.length - 4)
    var diff = new Diff() // options may be passed to constructor; see below var textDiff = diff.main('text1', 'text2'); // produces diff array
    var textDiff = diff.main(text1, text2) // produces diff array
    const diffHTML = diff.prettyHtml(textDiff)
    this.setState({ diffText: diffHTML }) // produces a formatted HTML string
  }

  clickCompare = (evt) => {
    evt.preventDefault()
    this.compareDiff(this.state.snapshotText, this.state.currentText)
  }

  handleSelect = (evt) => {
    evt.preventDefault()
    this.setState({ snapshotId: evt.target.value })
  }

  render() {
    console.log('comparison view state', this.state)
    return (
      <div>
        <h3>Comparison View</h3>
        <div id='snapshot-select' className='float-right'>
          <select onChange={this.handleSelect}>
            <option></option>
            {
              this.state.snapshots && this.state.snapshots.map(snapshot =>
                <option key={snapshot.key} value={snapshot.key}>{snapshot.title}</option>)
            }
          </select>
          <button className='btn btn-xs' onClick={this.clickCompare}>Compare</button>
        </div>
        <SplitPane className='splitPane' defaultSize="50%" >
          <Editor
            atomRef={this.props.firstPrevAtomRef}
            pane={'firstPane'}
            selectPane={this.props.selectPane}
            compareDiff={this.compareDiff}
            currentText={this.state.currentText}
            snapshotText={this.state.snapshotText}
             />
        <Infinite containerHeight={1000} elementHeight={50}>
          <div id='diff-text' dangerouslySetInnerHTML={{ __html: this.state.diffText }}></div>
        </Infinite>
        </SplitPane>
      </div>
    )
  }
}


