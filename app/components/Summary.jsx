import React from 'react'

const statusOptions = ['To Do', 'First Draft', 'Revised Draft', 'Final Draft']

export default class Summary extends React.Component {
  constructor() {
    super()
    this.state = {
      value: '',
      status: 'To Do'
    }
  }

  componentDidMount() {
    // When the component mounts, start listening to the fireRef
    // we were given.
    this.listenTo(this.props.atomRef.child('summary'))
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
    this.props.atomRef.child('summary').set(evt.target.value)
  }
  writeStatus = (evt) => {
    this.props.atomRef.child('status').set(evt.target.value)
  }
  render() {
    return (
      <div className="panel panel-warning">
        <div className="panel-heading">
          <h3>Summary</h3>
        </div>
        <div className="panel-body">
          <textarea
            onChange={this.write}
            rows={4}
            cols={40}
            value={this.state.value}
          />
          <form>
            <div>
              <label>Status</label>
              <select onChange={this.writeStatus}>
                {
                  statusOptions.map(status =>
                    status === this.state.status
                      ? (<option value={status} key={status} selected>{status}</option>)
                      : (<option value={status} key={status}>{status}</option>)
                  )
                }
              </select>
            </div>
          </form>
        </div>
      </div>
    )
  }
}
