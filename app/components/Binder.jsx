import React from 'react'
import Tree from './Tree'

const Binder = (props) =>
  <div className='panel'>
    <div className='panel-heading'>
      <h3 className='panel-head'>Binder</h3>
    </div>
    <div className='panel-body'>
      <ul id='binder' className='binder-list'><Tree uid={props.uid} projectId={props.projectId} atomId='0' /></ul>
    </div>
  </div>


export default Binder
