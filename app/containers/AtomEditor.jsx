import React from 'react'
import SplitPane from 'react-split-pane'
import ReactQuill from 'react-quill'
import {Tabs, Tab} from 'material-ui/Tabs'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import Editor from '../components/Editor'
import Notes from '../components/Notes'
import Summary from '../components/Summary'
import Resources from '../components/Resources'
import ComparisonView from '../components/ComparisonView'
import SplitView from '../components/SplitView'

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
      diffPane: false,
      view: 'normal'
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
      this.setState({ firstPaneText: text })
    })
  }
  listenToSecond = (secondRef) => {
    secondRef.on('value', snapshot => {
      var text = snapshot.val()
      this.setState({ secondPaneText: text })
    })
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

  toggleEditorView = (value) => {
    if (value === 'normal') {
      this.setState({diffPane: false, splitPane: false})
    } else if (value === 'split') {
      this.setState({ splitPane: true, diffPane: false })
    } else if (value === 'compare') {
      this.setState({diffPane: true, splitPane: false})
    }
    this.setState({ view: value })
  }

  render() {
    const ref = projectsRef.child(this.props.projectId).child('current').child('atoms').child(this.props.atomId)
    const splitPane = this.state.splitPane
    const diffPane = this.state.diffPane
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
            <MuiThemeProvider>
              <Tabs value={this.state.view} onChange={this.toggleEditorView}>
                <Tab label='Single View' value='normal' onClick={() => this.toggleEditorView('normal')} className='toggle-views'></Tab>
                <Tab label='Split View' value='split' onClick={() => this.toggleEditorView('split')} className='toggle-views'></Tab>
                <Tab label='Compare View' value='compare' onClick={() => this.toggleEditorView('compare')} className='toggle-views'></Tab>
              </Tabs>
            </MuiThemeProvider>
          </div>
          {(!splitPane && !diffPane) ?
            <Editor atomRef={ref} selectPane={this.selectPane} snapshot={this.snapshot} handleChange={this.handleChange} snapshotName={this.state.snapshotName} />
            :
            (splitPane ?
              <SplitView firstPrevAtomRef={firstPrevAtomRef} secondPrevAtomRef={secondPrevAtomRef} selectPane={this.selectPane} /> :
              <ComparisonView firstPrevAtomRef={firstPrevAtomRef} selectPane={this.selectPane} projectId={this.props.projectId} atomId={this.props.atomId} />)
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
