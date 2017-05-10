import React from 'react'
import Dropzone from 'react-dropzone'
import request from 'superagent'

const CLOUDINARY_UPLOAD_PRESET = 'fq1rxfrr'
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dpaa0igrr/upload'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      url: ''
    }
    this.onImageDrop = this.onImageDrop.bind(this)
    this.handleImageUpload = this.handleImageUpload.bind(this)
    this.handleUrl = this.handleUrl.bind(this)
    this.submitUrl = this.submitUrl.bind(this)
  }

  onImageDrop(files) {
    this.setState({
      uploadedFile: files[0]
    })
    this.handleImageUpload(files[0])
  }

  handleImageUpload(file) {
    const upload = request.post(CLOUDINARY_UPLOAD_URL)
      .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
      .field('file', file)

    upload.end((err, response) => {
      if (err) {
        console.error(err)
      }

      if (response.body.secure_url !== '') {
        this.setState({
          url: response.body.secure_url
        })
      }
    })
  }

  handleUrl(evt) {
    evt.preventDefault()
    this.setState({
      url: evt.target.value
    })
  }

  submitUrl(evt) {
    evt.preventDefault()
    // this.props.updateItem({
    //   resources: this.props.item.resources.push(this.state.url)
    // })
    console.log('url in submitUrl from Resources.jsx', this.state.url)
  }
  render() {
    return (
      <div className='panel panel-primary'>
        <div className='panel-heading'>
          <h3>Resources</h3>
        </div>
        <div className='panel-body'>
          <ul>
            <li>Dummy data</li>
            <li>To be resources</li>
            <li>Eventually</li>
          </ul>
          <h4>Add a new resource</h4>
          <form onSubmit={this.submitUrl}>
            <div>
              <label>Url:</label>
              <input type='text' onChange={this.handleUrl}/>
            </div>
            <button type='submit'>Add Resource</button>
          </form>
          <Dropzone
            multiple={false}
            accept='image/*'
            onDrop={this.onImageDrop.bind(this)}>
            <p>Drop an image or click to select a file to upload.</p>
          </Dropzone>
        </div>
      </div>
    )
  }
}

// {this.props.item && this.props.item.resources.map((resource, indx) => (
//   <li key={indx}>{resource}</li>)
// )}
