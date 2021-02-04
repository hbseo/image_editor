import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
// import '../css/UploadFile.scss';

class Upload_file extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='Upload_file'>
        <div className='main'>
          <div className='local'>
            <label className='input-file-button' htmlFor='input-file'>Load local image</label>
            <input type='file' id='input-file' onChange={this.props.fileChange} accept='image/*' style={{ display: 'none' }}></input>
          </div>
          <div className='url'>
            <label>Load image with URL</label>
            <form id='imgload' onSubmit={this.props.handleUrlSubmit}>
            url : <input name='url' value={this.props.url} onChange={this.props.handleChange} placeholder='https://example.com/example.jpg'></input>
              <input type='submit' value='Submit'></input>
            </form>
          </div>
          <div className='preview'>
            <img id="preview" src={this.props.imgUrl} alt="preview"></img>
              {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}

export default Upload_file;
