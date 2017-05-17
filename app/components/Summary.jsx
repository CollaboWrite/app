import React from 'react'
import firebase from 'APP/server/db'
const statusOptions = ['', 'To Do', 'First Draft', 'Revised Draft', 'Final Draft']

export default class Summary extends React.Component {
  constructor() {
    super()
    this.state = {
      summary: '',
      status: ''
    }
  }

  componentDidMount() {
    // When the component mounts, start listening to the fireRef
    // we were given.
    this.listenTo(this.props.atomRef.child('summary'), this.props.atomRef.child('status'))
  }
  componentWillReceiveProps(incoming) {
    // When the atomRef in the AtomEditor, we start listening to the new one
    this.listenTo(incoming.atomRef.child('summary'), incoming.atomRef.child('status'))
  }
  componentWillUnmount() {
    // When we unmount, stop listening.
    this.unsubscribe()
  }
  // listen to the fireRef.child
  listenTo(summaryAtomRef, statusAtomRef) {
    // If we're already listening to a ref, stop listening there.
    if (this.unsubscribe) this.unsubscribe()
    // Whenever our ref's value changes, set {value} on our state.
    const summaryListener = summaryAtomRef.on('value', snapshot => {
      const newSummary = snapshot.val() || ''
      this.setState({ summary: newSummary })
    })
    const statusListener = statusAtomRef.on('value', snapshot => {
      const newStatus = snapshot.val() || ''
      this.setState({ status: newStatus }, () => console.log('whats the status', this.state.status))
    })
    this.unsubscribe = () => {
      summaryAtomRef.off('value', summaryListener)
      statusAtomRef.off('value', statusListener)
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
      <div className="panel">
        <div className="panel-heading">
          <h3 className='panel-head'>Summary</h3>
        </div>
        <div className="panel-body">
          <textarea
            onChange={this.write}
            rows={4}
            cols={40}
            value={this.state.summary}
          />
          <form>
            <div>
              <label>Status</label>
              <select value={this.state.status} onChange={this.writeStatus}>
                {
                  statusOptions.map(status => {
                    if (status === this.state.status) {
                      return (<option selected value={status} key={status}>{status}</option>)
                    } else {
                      return (<option value={status} key={status}>{status}</option>)
                    }
                  })
                }
              </select>
            </div>
          </form>
        </div>
      </div>
    )
  }
}
