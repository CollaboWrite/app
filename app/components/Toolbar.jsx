import React from 'react'
import firebase from 'APP/server/db'
import { Link, browserHistory } from 'react-router'

const auth = firebase.auth()
const Toolbar = (props) => (
  <nav className="navbar navbar-default">
    <div className="container-fluid">

      <div className="navbar-header">
        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
          <span className="sr-only">Toggle navigation</span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
        </button>
        <a className="navbar-brand" id='navbar-title'>CollaboWrite</a>
      </div>

      <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
        <ul className="nav navbar-nav toolbar-list">
          <li>
            <a>
              <label id='toolbar-label'>Current Project:</label>
              <select value={props.projectId} className='toolbar-select' onChange={props.toggleProject}>
                {
                  props.projects.length && props.projects.map((project, indx) => (
                    <option value={project.key} key={project.key}>{project.title}</option>
                  ))
                }
              </select>
            </a>
          </li>

          <li><a>History</a></li>

        </ul>

        {/*<form className="navbar-form navbar-left" role="search">
        <div className="form-group">
          <input type="text" className="form-control" placeholder="Search" />
        </div>
        <button type="submit" className="btn btn-default">Submit</button>
      </form>*/}

        <ul className="nav navbar-nav navbar-right toolbar-list">
          <li>
            <a href='/login'>Account</a>
          </li>

          <li
            onClick={() => {
              auth.signOut()
            }
            }><a href='/login'>Log Out</a></li>
        </ul>
      </div>
    </div>
  </nav>
)

{/*<nav className='navbar navbar-default'>
    <ul className='nav navbar-nav'>
      <select onChange={(evt) => {
      }}>
        {
          props.projects.length && props.projects.map((project, indx) => (
            <option value={project.key} key={project.key}>{project.title}</option>
          ))
        }
      </select>
      <li>Tree View</li>
      <li>Timeline View</li>
      <li onClick={() => {
        browserHistory.push('/login') // first reroute
        browserHistory.go('/login') // this force-reloads after rerouting
      }
      }>Back to User Page</li>
      <li
        className='logout'
        onClick={() => {
          auth.signOut()
          browserHistory.push('/login')
        }
      }>Log Out</li>
    </ul>
  </nav>*/}


export default Toolbar
