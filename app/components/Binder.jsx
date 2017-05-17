import React from 'react'
import Tree from './Tree'
import Infinite from 'react-infinite'

const Binder = (props) =>
  <div className='panel'>
    <div className='panel-heading'>
      <h3 className='panel-head'>Binder</h3>
    </div>
    <Infinite containerHeight={400} elementHeight={26}>
      <div className='panel-body'>
        <ul id='binder' className='binder-list'><Tree uid={props.uid} projectId={props.projectId} atomId='0' /></ul>
      </div>
    </Infinite>
  </div>

export default Binder
