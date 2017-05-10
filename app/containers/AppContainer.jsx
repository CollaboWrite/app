import React from 'react'
import {connect} from 'react-redux'

import Toolbar from '../components/Toolbar'
import Binder from '../components/Binder'
import Trashcan from '../components/Trashcan'
import Editor from '../components/Editor'
import Notes from '../components/Notes'
import Summary from '../components/Summary'
import Resources from '../components/Resources'

export default class AppContainer extends React.Component {
  render() {
    return (
      <div>
        <div className='col-lg-12'>
          <Toolbar />
        </div>
        <div className='col-lg-3 sidebar-right'>
          <Binder />
          <Trashcan />
        </div>
        <div className='col-lg-6 project-center'>
          <Editor />
        </div>
        <div className='col-lg-3 sidebar-left'>
          <Notes />
          <Summary />
          <Resources />
        </div>
      </div>
    )
  }
}

// const mapStateToProps = (state) => ({projects: state.projects.list})

// const mapDispatchToProps = null

// export default connect(mapStateToProps, mapDispatchToProps)(AppContainer)
