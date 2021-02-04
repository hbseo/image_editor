import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import '../css/UploadFile.scss';

class Upload_file extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='Upload-file'>
        <div className='upload-file-input'>
          <div className='local'>
            <label className='input-file-button' htmlFor='input-file'>Load local image</label>
            <input type='file' id='input-file' onChange={this.props.fileChange} accept='image/*' style={{ display: 'none' }}></input>
          </div>
          <div className='url'>
            <form id='imgload' onSubmit={this.props.handleUrlSubmit}>
              <div className="input-group">
                <input className="input-url" name='url' value={this.props.url} onChange={this.props.handleChange} placeholder='https://example.com/example.jpg'></input>
                <label htmlFor="url">URL:</label>
              </div>
              <input className="url-submit-button" type='submit' value='Submit'></input>
            </form>
          </div>
        </div>
        <div className='preview'>
          <div className="preview-title">preview</div>
          <div className="preview-inner">
            <img id="preview" src={this.props.imgUrl}></img>
          </div>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default Upload_file;
