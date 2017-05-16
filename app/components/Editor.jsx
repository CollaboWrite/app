import React from 'react'
import ReactQuill from 'react-quill'
import { MultiCursor } from 'quill'

export default class Editor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: '',
      pane: ''
    }
    this.write = this.write.bind(this)
  }

  componentDidMount() {
    // When the component mounts, start listening to the fireRef
    // we were given.
    this.listenTo(this.props.atomRef.child('text'))
    this.setState({ pane: this.props.pane })
  }
  componentWillReceiveProps(incoming) {
    // When the atomRef in the AtomEditor, we start listening to the new one
    this.listenTo(incoming.atomRef.child('text'))
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
      const newValue = snapshot.val() || ''
      this.setState({ value: newValue })
    })
    this.unsubscribe = () => {
      atomRef.off('value', listener)
    }
  }
  write(html) {
    MultiCursor.update()
    this.props.atomRef.child('text').set(html)
  }

  render() {
    return (
      <div className='col-xs-12 project-center'>
        <div className="split-pane" value={this.state.pane} onClick={() => {
          this.props.selectPane(this.state.pane)
        }
        }>
          <div className="editor-panel clearfix">
            <ReactQuill id='react-quill'
              value={this.state.value}
              onChange={this.write}
              theme={'snow'}
              modules={MultiCursor}/>
          </div>
        </div>
      </div>
    )
  }
}
