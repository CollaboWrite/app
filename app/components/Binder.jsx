import React from 'react'
import { browserHistory } from 'react-router'

import firebase from 'APP/server/db'

export default class extends React.Component {
  constructor(props) {
    super(props)
  }

  // listening to the selected atom based on the passed down atom id from the params
  componentDidMount() {
    this.listenTo(firebase.database().ref('projects').child(this.props.projectId).child('current').child('atoms').child(this.props.atomId))
  }

  componentWillReceiveProps(incoming) {
    this.listenTo(firebase.database().ref('projects').child(this.props.projectId).child('current').child('atoms').child(incoming.atomId))
  }

  componentWillUnmount() {
    this.unsubsribe()
  }

  listenTo(selectedAtomChildrenRef) {
    if (this.unsubscribe) this.unsubscribe()
    const listener = selectedAtomChildrenRef.child('children').on('child_added', snapshot => {
      this.setState({ selectedChildren: snapshot.val() })
    })

    this.unsubscribe = () => {
      selectedAtomChildrenRef.off('value', listener)
    }
  }

  handleSubmit = (evt) => {
    evt.preventDefault()
    const parentArr = this.state.selectedAtomArr
    // if (parentArr[3]) {
    //   this.props.toggleChildren(parentArr[0], parentArr[1], parentArr[2], parentArr[3])
    // }    
    
    

    const newTitle = evt.target.value
    const parent = this.state.selectedAtom || this.props.root
    const newAtomKey = firebase.database().ref('projects').child(this.props.projectId).child('current').child('atoms').push().key
    const newAtom = {title: newTitle}
    firebase.database().ref('projects').child(this.props.projectId).child('current').child('atoms').child(parent).child('children').child(newAtomKey).set(true, (err) => {
      if (err) {
        console.error(err)
      } else {
        firebase.database().ref('projects').child(this.props.projectId).child('current').child('atoms').child(newAtomKey).set(newAtom, (userErr) => {
          if (userErr) {
            console.error(userErr)
          } else {
            // if (!parentArr[3]) {
              this.props.toggleChildren(parentArr[0], parentArr[1], parentArr[2], parentArr[3])
            // }
          }
        })
      }
    })
    evt.target.remove()
    // if (!parentArr[3]) {
    //   this.props.toggleChildren(parentArr[0], parentArr[1], parentArr[2], parentArr[3])
    // } 
    // else {
    //   this.props.toggleChildren(parentArr[0], parentArr[1], parentArr[2], true)
    //   this.props.toggleChildren(parentArr[0], parentArr[1], parentArr[2], false)      
    // }
  }

  handleClickSelect = (evt, atomArr) => {
    evt.preventDefault()
    console.log('got the second argument', atomArr)
    this.setState({ selectedAtomArr: atomArr })
    document.getElementsByClassName('current-atom')[0]
      ? document.getElementsByClassName('current-atom')[0].classList.remove('current-atom')
      : console.log()
    evt.target.classList.add('current-atom')
    browserHistory.push(`/${this.props.uid}/project/${this.props.projectId}/${evt.target.value}`)
    this.setState({selectedAtom: atomArr[0]})
    const selectedAtom = atomArr[0]    
    console.log('selected atom', selectedAtom)
    firebase.database().ref('projects').child(this.props.projectId).child('current').child('atoms').child(selectedAtom).on('value', snapshot => {
      firebase.database().ref('users').child(this.props.uid).child('projects').child(this.props.projectId).set(selectedAtom)
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
    console.log('selected atom', this.props.atomId)
    if (this.props.atomId) {
      document.getElementById(this.props.atomId).after(newAtom)
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
                const iconClass = atomObj && atomObj.children ? (expanded ? 'chevron-down' : 'chevron-right') : 'file-text-o'
                return (
                  <li key={key} id={key}
                  style={{paddingLeft: level * 25}}>
                    <span className={`fa fa-${iconClass}`}
                      value='value'
                      onClick={() => this.props.toggleChildren(key, ind, level, expanded)} />
                    <button className='binder-item'
                      value={key}
                      onClick={(evt) => this.handleClickSelect(evt, [key, ind, level, expanded])} >
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
