import React from 'react'
import {browserHistory} from 'react-router'

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
    // this.props.createContainer({ title: this.state.newContainer })
  }

  handleSelect = (evt) => {
    evt.preventDefault()
    browserHistory.push(`/${this.props.uid}/project/${this.props.projectId}/${evt.target.value}`)
    firebase.database().ref('projects').child(this.props.projectId).child('current').child('atoms').child(evt.target.value).on('value', snapshot => {
      firebase.database().ref('users').child(this.props.uid).child('projects').child(this.props.projectId).set(evt.target.value)
    })
  }

  render() {
    const items = (this.props.atoms) ? Object.keys(this.props.atoms) : []
    return (
      <div className='panel panel-info'>
        <div className='panel-heading'>
          <h3>Binder</h3>
        </div>
        <div className='panel-body'>
          <ul>
            {
              items && items.map((item, idx) => {
                return (<li key={item} ><button value={this.props.keys[idx]} onClick={this.handleSelect} >{this.props.atoms[item].title}</button></li>)
              })
            }
          </ul>
          <form onSubmit={this.handleSubmit}>
            <div>
              <label>New Folder</label>
              <input type='text' onChange={this.handleChange} />
            </div>
            <button type='submit'>Add Folder</button>
          </form>
        </div>
      </div>
    )
  }
}
