import React from 'react'

const statusOptions = ['To Do', 'First Draft', 'Revised Draft', 'Final Draft']

export default (props) => {
  // let stateStatus = props.item ? props.item.status : null
  let stateStatus = 'To Do'
  return (
    <div className="panel panel-warning">
    <div className="panel-heading">
      <h3>Summary</h3>
    </div>
    <div className="panel-body">
      <textarea
        rows={4}
        cols={40}
      />
      <form>
        <div>
          <label>Status</label>
          <select>
            {
              statusOptions.map(status =>
                status === stateStatus
                  ? (<option key={status} selected>{status}</option>)
                  : (<option key={status}>{status}</option>)
              )
            }
          </select>
        </div>
      </form>
    </div>
  </div>
  )
}

/*{
  props.item
    ? <textarea
      className='scratchpad'
      rows={4}
      cols={40}
      value={props.item.summary}
    />
    : <textarea
      rows={4}
      cols={40}
    />
}*/
