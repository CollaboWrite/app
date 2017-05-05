import React, {Component} from 'react'
import {Link} from 'react-router'

export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: ''
    }
    this.handleTitle = this.handleTitle.bind(this)
  }

  handleTitle(evt) {
    evt.preventDefault()
    this.setState({
      title: evt.target.value
    })
  }

  render() {
    return (
      <div className='container'>
        <form>
          <div className="form-group">
            <label className="control-label">Story title:</label>
            <input className="form-control input-lg" onChange={this.handleTitle}/>
          </div>
          <Link to={`/write/${this.state.title}`}><button className='btn btn-info' type='submit'>Create new story</button></Link>
        </form>
      </div>
    )
  }
}