import React from 'react'
import {Link} from 'react-router'
import {atomRef, projectRef} from 'APP/server/db/model'

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

  handleChange = (evt) => {
    this.setState({newAtom: evt.target.value})
  }
  add = () => {
    const newAtom = {
      title: this.state.newAtom
    }
    const atoms = projectRef(this.props.projectId).child('atoms')
    const newAtomKey = atoms.push().key
    atomRef(this.props.projectId, this.props.atomId).child('children').child(newAtomKey).set(true)
    atomRef(this.props.projectId, newAtomKey).set(newAtom)
    // atoms.child(newAtomKey).set(newAtom)
  }

  delete = () => {
    atomRef(this.props.projectId, this.props.atomId).remove()
  }

  render() {
    if (!this.state || !this.state.value) return null
    const {value: {children, title}, expanded} = this.state || {value: {}}
    const iconClass = children ? (expanded ? 'chevron-down' : 'chevron-right') : 'file-text-o'
    return (
      <li>
        <span className={`fa fa-${iconClass}`}onClick={this.toggle} />
        <Link to={`/${this.props.uid}/project/${this.props.projectId}/${this.props.atomId}`} className='binder-item'>{title}</Link><span className='fa fa-times' onClick={this.delete} />
        <ul className='binder-list'>{
          expanded && Object.keys(children || {}).map(childId => <Tree uid={this.props.uid} projectId={this.props.projectId} atomId={childId} />).concat([<span><input onChange={this.handleChange} /><span onClick={this.add}className='fa fa-plus'/></span>])
        }</ul>
      </li>
    )
  }
}
