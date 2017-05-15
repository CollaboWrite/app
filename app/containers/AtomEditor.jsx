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
      atomVal: {},
      splitPane: false,
      selectedPane: '',
      firstPrevAtomId: '',
      secondPrevAtomId: ''
    }
  }

  componentDidMount() {
    // When the component mounts, start listening to the fireRef
    // we were given.
    this.listenTo(firebase.database().ref('users').child(this.props.uid).child('projects').child(this.props.projectId))
  }
  componentWillUnmount() {
    // When we unmount, stop listening.
    this.unsubscribe()
  }
  // listen to the fireRef.child
  listenTo(atomRef) {
    // If we're already listening to a ref, stop listening there.
    if (this.unsubscribe) this.unsubscribe()
    // Whenever our ref's value changes, set {value} on our state.
    const listener = atomRef.on('value', snapshot => {
      console.log('atomval', snapshot.val())
      this.setState({ atomVal: snapshot.val() })
    })
    this.unsubscribe = () => {
      atomRef.off('value', listener)
    }
  }
  // toggle button between not split/split
  toggleSplit = (evt) => {
    evt.preventDefault()
    this.setState({ splitPane: !this.state.splitPane })
  }
  selectPane = (val) => {
    // if reselecting already selected pane, don't reset the prevAtom/selectedPane
    if (this.state.selectedPane !== val) {
      // if firstPane selected, set current atomVal to it's prevAtomId and set current selectedPane to this
      // same for secondPane
      if (val === 'firstPane') {
        this.setState({ firstPrevAtomId: this.props.atomId, selectedPane: val })
      } else if (val === 'secondPane') {
        this.setState({ secondPrevAtomId: this.props.atomId, selectedPane: val })
      } else {
        // this triggers when single pane view and the editor is clicked
        this.setState({ firstPrevAtomId: this.props.atomId })
      }
    }
  }
  render() {
    // 'this.state.atomRef' NEVER being set in this file...is this happening???
    const ref = this.state.atomRef || projectsRef.child(this.props.projectId).child('current').child('atoms').child(this.props.atomId)
    const splitPane = this.state.splitPane
    const firstAtomId = this.state.firstPrevAtomId || this.props.atomId
    const secondAtomId = this.state.secondPrevAtomId || this.props.atomId
    // if prevAtomId exists for either panes, send the prevRef is null
    const firstPrevAtomRef = projectsRef.child(this.props.projectId).child('current').child('atoms').child(firstAtomId)
    const secondPrevAtomRef = projectsRef.child(this.props.projectId).child('current').child('atoms').child(secondAtomId)
    // if splitPane is true, pass down atomRef to just the selected pane & show render <SplitPane> with two <Editor> components as 'children'
    // else, just show the old Editor
    console.log('this state in atomeditor', this.state)
    return (
      <div>
        <div className='col-xs-6 project-center'>
          <button onClick={this.toggleSplit}>Vertical Split View</button>
            {(splitPane) ? <SplitPane className='splitPane' defaultSize="50%" >
                {<Editor atomRef={firstPrevAtomRef} pane={'firstPane'} selectPane={this.selectPane}/>}
                {<Editor atomRef={secondPrevAtomRef} pane={'secondPane'} selectPane={this.selectPane}/>}
            </SplitPane>
            : <Editor atomRef={ref} selectPane={this.selectPane}/>
            }
        </div>
        <div className='col-xs-3 sidebar-right'>
          <Summary atomRef={ref} />
          <Notes atomRef={ref} />
        </div>
      </div>
    )
  }
}

// add resources function later for now
// <Resources atom={this.state.selected} />
