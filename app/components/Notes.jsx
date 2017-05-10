import React from 'react'

// this was from capstone 2, replaced with dummy text area below
/*{
  props.item
    ? <textarea
      rows={4}
      cols={40}
      value={props.item.notes}
    />
    : <textarea
      rows={4}
      cols={40}
    />
}*/

export default (props) => {
  return (
  <div className="panel panel-danger">
    <div className="panel-heading">
      <h3>Notes</h3>
    </div>
    <div className="panel-body">
      <textarea
        rows={4}
        cols={40}
        value={props.atom.notes}
      />
    </div>
  </div>
  )
}

