import React from 'react'

export default class Notes extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: ''
    }
  }

  componentDidMount() {
    // When the component mounts, start listening to the fireRef
    // we were given.
    this.listenTo(this.props.atomRef.child('notes'))
  }
  componentWillReceiveProps(incoming) {
    // When the atomRef in the AtomEditor, we start listening to the new one
    this.listenTo(incoming.atomRef.child('notes'))
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
  write = (evt) => {
    this.props.atomRef.child('notes').set(evt.target.value)
  }
  render() {
    return (
      <div className="panel">
        <div className="panel-heading">
          <h3 className='panel-head'>Notes</h3>
        </div>
        <div className="panel-body">
          <textarea
            onChange={this.write}
            rows={4}
            value={this.state.value}
          />
        </div>
      </div>
    )
  }
}

