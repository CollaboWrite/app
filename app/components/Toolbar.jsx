import React from 'react'

const Toolbar = (props) => {
  return (<nav className='toolbar navbar'>
    <select onChange={(evt) => {
      {/*props.fetchProject(evt.target.value)*/}
      console.log('selected project in onChange from Toolbar.jsx', evt.target.value)
    }}>
      {
        props.projects && props.projects.map((project, indx) => (
          <option value={project} key={indx}>{project}</option>
        ))
      }
    </select>
    <button>Tree View</button>
    <button>Timeline View</button>
    <button>ETC</button>

  </nav>)
}
export default Toolbar
