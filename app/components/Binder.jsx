import React from 'react'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showInput: false,
      newAtom: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
  }

  // this is class property so we don't have to bind it (as if we put this entire function in the constructor)
  handleChange = (evt) => {
    evt.preventDefault()
    this.setState({ newContainer: evt.target.value })
  }

  handleSubmit(evt) {
    evt.preventDefault()
    console.log('this.state.newAtom in handleSubmit in Binder.jsx', this.state.newAtom)
    // this.props.createContainer({ title: this.state.newContainer })
  }

  handleSelect(evt) {
    evt.preventDefault()
    console.log('evt.target.value in handleSelect in Binder.jsx', evt.target.value)
    // this.props.selectItem(evt.target.value)
  }

  render() {
    // const items = this.props.selectedProject.items
    const items = ['dummy', 'data', 'of', 'items', 'array']
    return (
      <div className='panel panel-info'>
        <div className='panel-heading'>
          <h3>Binder</h3>
        </div>
        <div className='panel-body'>
          <ul>
            {
              items && items.map(item => <li key={item} value={item} onClick={this.handleSelect}>{item}</li>)
            }
          </ul>
          <form onSubmit={this.handleSubmit}>
            <div>
              <label>New Folder</label>
              <input type='text' onChange={this.handleChange} />
            </div>
            <button type='submit'>Add Folder</button>
          </form>
        </div>
      </div>
    )
  }
}
