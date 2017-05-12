import React from 'react'
import { browserHistory } from 'react-router'

import firebase from 'APP/server/db'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showInput: false,
      newAtom: ''
    }
  }

  // this is class property so we don't have to bind it (as if we put this entire function in the constructor)
  handleChange = (evt) => {
    evt.preventDefault()
    // this.setState({ newContainer: evt.target.value })
  }

  handleSubmit = (evt) => {
    evt.preventDefault()
    const newTitle = evt.target.value
    const parent = this.state.selectedAtom || this.props.root
    const newAtomKey = firebase.database().ref('projects').child(this.props.projectId).child('current').child('atoms').push().key
    const newAtom = {title: newTitle}
    firebase.database().ref('projects').child(this.props.projectId).child('current').child('atoms').child(parent).child('children').child(newAtomKey).set(true)
    firebase.database().ref('projects').child(this.props.projectId).child('current').child('atoms').child(newAtomKey).set(newAtom)
    evt.target.remove()
  }

  handleSelect = (evt) => {
    evt.preventDefault()
    document.getElementsByClassName('current-atom')[0]
      ? document.getElementsByClassName('current-atom')[0].classList.remove('current-atom')
      : console.log()
    evt.target.classList.add('current-atom')
    this.setState({selectedAtom: evt.target.value})
    browserHistory.push(`/${this.props.uid}/project/${this.props.projectId}/${evt.target.value}`)
    firebase.database().ref('projects').child(this.props.projectId).child('current').child('atoms').child(evt.target.value).on('value', snapshot => {
      firebase.database().ref('users').child(this.props.uid).child('projects').child(this.props.projectId).set(evt.target.value)
    })
  }

  addAtom = (evt) => {
    evt.preventDefault()
    var newAtom = document.createElement('li')
    var inputTitle = document.createElement('input')

    inputTitle.setAttribute('id', 'atom-name')
    inputTitle.addEventListener('keypress', evt => {
      if (evt.keyCode === 13) this.handleSubmit(evt)
    })
    inputTitle.type = 'text'

    newAtom.append(inputTitle)

    if (this.state.selectedAtom) {
      document.getElementById(this.state.selectedAtom).after(newAtom)
    } else {
      document.getElementById('binder-list').append(newAtom)
    }
  }

  render() {
    return (
      <div className='panel panel-info'>
        <div className='panel-heading'>
          <h3 id='binder-head'>Binder</h3>
          <span className='fa fa-plus-circle add-atom'
                onClick={this.addAtom} />
        </div>
        <div className='panel-body'>
          <ul id='binder-list'>
            {
              this.props.atoms && this.props.atoms.map((atomArr, ind) => {
                const key = atomArr[0]
                const atomObj = atomArr[1]
                const level = atomArr[2]
                const expanded = atomArr[3]
                const iconClass = atomObj.children ? (expanded ? 'chevron-down' : 'chevron-right') : 'file-text-o'
                return (
                  <li key={key} id={key}
                  style={{paddingLeft: level * 25}}>
                    <span className={`fa fa-${iconClass}`}
                      value='value'
                      onClick={() => this.props.toggleChildren(key, ind, level, expanded)} />
                    <button className='binder-item'
                      value={key}
                      onClick={this.handleSelect} >
                      {atomObj.title}
                    </button>
                  </li>)
              })
            }
          </ul>
        </div>
      </div>
    )
  }
}
