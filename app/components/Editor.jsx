import React from 'react'
import ReactQuill from 'react-quill'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: ''
    }
    this.write = this.write.bind(this)
    this.saveBlurb = this.saveBlurb.bind(this)
  }

  write(html) {
    this.setState({
      value: html
    })
  }

  saveBlurb(evt) {
    evt.preventDefault()
    // this.props.updateItem({
    //   id: this.props.item.id,
    //   text: this.state.value
    // })
    console.log('text in saveBlurb in Editor.jsx', this.state.value)
  }

  render() {
    return (
      <div className="container">
        <div>
        <ReactQuill id='react-quill'
                  value={this.state.value}
                  onChange={this.write}
                  theme={'snow'}/>
        </div>
        <div>
        <button onClick={this.saveBlurb}>Save Blurb</button>
        </div>
      </div>
    )
  }
}
