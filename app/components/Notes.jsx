import React from 'react'

// this was from capstone 2, replaced with dummy text area below
/*{
  props.item
    ? <textarea
      rows={4}
      cols={40}
      value={props.item.notes}
    />
    : <textarea
      rows={4}
      cols={40}
    />
}*/

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
  componentWillUnmount() {
    // When we unmount, stop listening.
    this.unsubscribe()
  }
  // listen to the fireRef.child
  listenTo(atomRef) {
    // If we're already listening to a ref, stop listening there.
    if (this.unsubscribe) this.unsubscribe()
    // Whenever our ref's value changes, set {value} on our state.
    const listener = atomRef.on('value', snapshot =>
      this.setState({ value: snapshot.val() })
    )
    this.unsubscribe = () => {
      atomRef.off('value', listener)
    }
  }
  write = (evt) => {
    this.props.atomRef.child('notes').set(evt.target.value)
  }
  render() {
    return (
      <div className="panel panel-danger">
        <div className="panel-heading">
          <h3>Notes</h3>
        </div>
        <div className="panel-body">
          <textarea
            onChange={this.write}
            rows={4}
            cols={40}
            value={this.state.value}
          />
        </div>
      </div>
    )
  }
}

