import React, {Component} from 'react';
import Loading from './Loading';
import i18next from "../../locale/i18n";
import ImageMini from './ImageMini';
import { withTranslation } from "react-i18next";
import '../../css/ui/Image.scss'
import { corsLink } from '../const/consts';

export default withTranslation()(class Image extends Component {
  constructor(props){
    super(props);
    this.state = { 
      imgURL : '',
      displayURL: false,
      displaylib: false,
    }
    this.url = '';
  }

  componentDidMount(){
    // console.log('Image UI Mount');
  }
  componentDidUpdate(){
    // console.log('Image UI Update');
  }
  componentWillUnmount(){
    this.props.cropStopObject();
    // console.log('Image UI Unmount');
  }
  handleCropImage = (event) => {
    let cropOption = event.target.getAttribute('crop');
    this.props.cropObject(cropOption)
  }

  handleChange = (event) => {
    this.setState({imgURL : event.target.value})
  }

  handleSubmit = (event) => {
    if(event){ event.preventDefault(); }
    this.url = this.state.imgURL;
    this.setState({imgURL : ""});
    console.log("loading");
    this.props.addImage(corsLink + this.url);
  }

  importImage = (event) => {
    if(!event.target.files[0]) { return; }
    new Promise((resolve) => {
      let file = event.target.files[0];
      this.url = URL.createObjectURL(file);
      event.target.value = null;
      resolve();
    })
    .then(() => {
      console.log("loading");
			this.props.addImage(this.url);
    })
  }

  urlOpen = () => {
    let url = this.state.displayURL;
    this.setState({displayURL: !url});
  }

  libOpen = () => {
    let lib = this.state.displaylib;
    this.setState({displaylib: !lib});
  }

  render(){
    return (
      <div className="sub">
        <div className="sub-title">
          {i18next.t('ui/image.Image')} ( { this.props.object.type })
        </div>
        <div className="sub-imagesmenu">
          <div className="option-title">{i18next.t('ui/image.Crop start')}</div>
          <div className="crop-ratio">
            <div className="crop-start-button">
              <button onClick={this.handleCropImage} className = "cropStart" crop="4:3">4:3</button>
              <button onClick={this.handleCropImage} className = "cropStart" crop="16:9">16:9</button>
              <button onClick={this.handleCropImage} className = "cropStart" crop="3:2">3:2</button>
              <button onClick={this.handleCropImage} className = "cropStart" crop="1:1">1:1</button>
            </div>
            <button id="end-button" onClick={this.props.cropEndObject} crop="left">{i18next.t('ui/image.Crop End')}</button>
            <button id="end-button" onClick={this.props.cropStopObject} crop="left">{i18next.t('ui/image.CropCancel')}</button>
          </div>
          <div className="option-title">{i18next.t('ui/image.Upload image')}</div>
          <div className="upload-file">
            <div className="image-local">
              <div className="file-input-group">
                <label className="input-file-button" htmlFor="_file">{i18next.t('ui/image.Upload local image')}</label>
                <input name="file" type='file' id='_file' onChange={this.importImage} accept="image/*" style={{ display: 'none' }}></input>
              </div>
            </div>
            <button className="open-url" onClick={this.urlOpen}>{i18next.t('ui/image.Upload URL image')}</button>
            {this.state.displayURL ?
            <div className="image-url">
              <form id="imgload" onSubmit={this.handleSubmit}>
                <div className="image-url-group">
                  <input name="url" id="_url" value={this.state.imgURL} onChange = {this.handleChange} autoComplete="off"/>
                  <label htmlFor="_url">URL: </label>
                </div>
                <input className="url-submit" type="submit" value="Submit" />
              </form>
            </div> : null}
            <button className="open-lib" onClick={this.libOpen}>{i18next.t('ui/image.Upload library image')}</button>
            {this.state.displaylib ? <ImageMini addImage={this.props.addImage} /> : null}
          </div>
        </div>
        {this.props.imgStatus ? <Loading open = {true} /> : null}
      </div>
    );
  }
})