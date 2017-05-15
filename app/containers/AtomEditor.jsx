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
      prevAtomId: ''
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
      this.setState({ atomVal: snapshot.val() })
    })
    this.unsubscribe = () => {
      atomRef.off('value', listener)
    }
  }

  updateAtom = (updateObj) =>
    projectsRef.child(this.props.params.id).child('current').child('atoms').child(this.props.params.atomId).update(updateObj)
  toggleSplit = (evt) => {
    evt.preventDefault()
    this.setState({ splitPane: !this.state.splitPane })
  }
  selectPane = (val) => {
    this.setState({ prevAtomId: this.state.atomVal, selectedPane: val })
  }
  render() {
    // when is this.state.atomRef ever being set???
    const ref = this.state.atomRef || projectsRef.child(this.props.projectId).child('current').child('atoms').child(this.props.atomId)
    let prevAtomRef = ref
    const splitPane = this.state.splitPane
    if (this.state.prevAtomId) {
      prevAtomRef = projectsRef.child(this.props.projectId).child('current').child('atoms').child(this.state.prevAtomId)
    }
    // if splitPane is true, pass down atomRef to just the selected pane
    // may need to save previous atomRef to pass down to pane NOT selected
    console.log('this state in atomeditor', this.state)
    return (
      <div>
        <div className='col-xs-6 project-center'>
          <button onClick={this.toggleSplit}>Vertical Split View</button>
          {(splitPane) ? <SplitPane className='splitPane' defaultSize="50%" >
              {(this.state.selectedPane === 'firstPane') ? <Editor atomRef={ref} pane={'firstPane'} selectPane={this.selectPane}/> : <Editor atomRef={prevAtomRef} pane={'firstPane'} selectPane={this.selectPane}/>}
              {(this.state.selectedPane === 'secondPane') ? <Editor atomRef={ref} pane={'secondPane'} selectPane={this.selectPane}/> : <Editor pane={'secondPane'} selectPane={this.selectPane}/>}
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
