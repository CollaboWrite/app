import React from 'react'
import {Link} from 'react-router'
import {atomRef} from 'APP/server/db/model'

export default class Tree extends React.Component {
  componentDidMount() {
    this.listenTo(this.props)
  }

  componentWillReceiveProps(incoming) {
    this.listenTo(incoming)
  }

  listenTo({projectId, atomId}) {
    this.unsubscribe && this.unsubscribe()
    const fireRef = atomRef(projectId, atomId)
    const listener = fireRef.on('value', snapshot => this.setState({value: snapshot.val()}))

    this.unsubscribe = () => fireRef.off('value', listener)
  }

  toggle = () => {
    this.setState({expanded: !this.state.expanded})
  }

  delete = () => {
    atomRef(this.props.projectId, this.props.atomId).remove()
  }

  render() {
    if (!this.state || !this.state.value) return null
    const {value: {children, title}, expanded} = this.state || {value: {}}
    return (
      <li>
        <span onClick={this.toggle}>{expanded ? '-' : '+'}</span>
        <Link to={`/${this.props.uid}/project/${this.props.projectId}/${this.props.atomId}`}>{title}</Link><span onClick={this.delete}>x</span>
        <ul>{
          expanded && Object.keys(children || {}).map(childId => <Tree projectId={this.props.projectId} atomId={childId} /> ).concat([<button>Add</button>])
        }</ul>
      </li>
    )
    
  }
}
