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
    return (
      <div className='panel panel-info'>
        <div className='panel-heading'>
          <h3>Binder</h3>
        </div>
        <div className='panel-body'>
          <ul id='binder-list'>
            {
              this.props.atoms && this.props.atoms.map((atomArr, ind) => {
                const key = atomArr[0]
                const atomObj = atomArr[1]
                const level = atomArr[2]
                const expanded = atomArr[3]
                const iconClass = atomObj.children ? (expanded ? 'minus' : 'plus') : 'file-text-o'
                return (
                  <li key={key}
                  style={{paddingLeft: level * 25}}>
                    <span className={`fa fa-${iconClass}`}
                      value='value'
                      onClick={() => this.props.toggleChildren(key, ind, level, expanded)}>
                    </span>
                    <button className='binder-item'
                      value={key}
                      onClick={this.handleSelect} >
                      {atomObj.title}
                    </button>
                  </li>)
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
