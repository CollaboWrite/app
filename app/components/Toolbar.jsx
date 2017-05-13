import React from 'react'

const Toolbar = (props) => {
  return (<nav className='toolbar navbar'>
    <select onChange={(evt) => {
    }}>
      {
        props.projects.length && props.projects.map((project, indx) => (
          <option value={project.key} key={project.key}>{project.title}</option>
        ))
      }
    </select>
    <button>Tree View</button>
    <button>Timeline View</button>

  </nav>)
}
export default Toolbar
