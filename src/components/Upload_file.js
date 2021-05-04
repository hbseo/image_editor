import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import i18next from "../locale/i18n";
import { withTranslation } from "react-i18next";
import '../css/UploadFile.scss';
import Loading from './ui/Loading';

class Upload_file extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isUrlEnable: false,
    };
  }

  openURL = () => {
    let urlState = this.state.isUrlEnable;
    this.setState({isUrlEnable: !urlState});
    console.log(this.state.isUrlEnable);
  }

  render() {
    return (
      <div className="main-load-image">
        <div className='local'>
          <label className='input-file-button' htmlFor='input-file'>{i18next.t('Upload_file.Load local image')}</label>
          <input type='file' id='input-file' onChange={this.props.fileChange} accept='image/*' style={{ display: 'none' }}></input>
        </div>
        <div className='url'>
        <button className="url-open-button" onClick={this.openURL}>{i18next.t('Upload_file.Load URL image')}</button>
        {this.state.isUrlEnable ?
          <form id='imgload' onSubmit={this.props.urlImageChange}>
            <input className="input-url" name='url' value={this.props.url} onChange={this.props.handleChange} placeholder='https://example.com' autoComplete="off"></input>
            <input className="url-submit-button" type='submit' value={i18next.t('Upload_file.Load')}></input>
          </form> :
          null
        }
        </div>
        <div style={{color : 'black'}}>
          {this.props.children}
        </div>
        <Loading open = {this.props.loading}/>
      </div>
      
    )
  }
}

export default withTranslation()(Upload_file);