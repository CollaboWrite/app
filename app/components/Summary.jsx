import React from 'react'

const statusOptions = ['To Do', 'First Draft', 'Revised Draft', 'Final Draft']

export default (props) =>
    <div className="panel panel-warning">
    <div className="panel-heading">
      <h3>Summary</h3>
    </div>
    <div className="panel-body">
      <textarea
        rows={4}
        cols={40}
        value={props.atom.summary}
      />
      <form>
        <div>
          <label>Status</label>
          <select>
            {
              statusOptions.map(status =>
                status === props.atom.status
                  ? (<option key={status} selected>{status}</option>)
                  : (<option key={status}>{status}</option>)
              )
            }
          </select>
        </div>
      </form>
    </div>
  </div>
