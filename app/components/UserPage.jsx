import React from 'react'
import {browserHistory} from 'react-router'

// we will need to add some firebase functionality to query all the users project ids and titles
// right now this is the data being used, very dumb data
const dummy = [{id: 1, title: 'Project 1'}, {id: 2, title: 'Project 2'}, {id: 3, title: 'Project 3'}]

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      projectId: null,
      projectList: []
    }
  }

  goToPage = (evt) => {
    browserHistory.push(`/project/${this.state.projectId}`)
  }

  changeProject = (evt) => {
    evt.preventDefault()
    this.setState({projectId: evt.target.value})
  }

  render() {
    return (
      <div>
        <h3>Welcome, {this.props.user.displayName}</h3>
        <p>Pick a project to view:</p>
        <select onChange={this.changeProject}>
        <option></option>
        {
          dummy.map(project =>
            <option key={project.id} value={project.id}>{project.title}</option>   
          )
        }
        </select>
        <button type='button' onClick={this.goToPage}>Go to project</button>
      </div>
    )
  }
}
