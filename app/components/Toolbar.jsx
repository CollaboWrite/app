import React from 'react'

const Toolbar = (props) =>
  <nav className='toolbar navbar'>
    <select onChange={(evt) => {
      {/*props.fetchProject(evt.target.value)*/}
      console.log('selected project in onChange from Toolbar.jsx', evt.target.value)
    }}>
      {/*{
        props.projects && props.projects.map(project => (
          <option value={project.id} key={project.id}>{project.title}</option>
        ))
      }*/}
      <option value='Project1'>{props.project.title}</option>
    </select>
    <button>Something</button>
    <button>Else</button>
    <button>Here</button>

  </nav>

export default Toolbar
