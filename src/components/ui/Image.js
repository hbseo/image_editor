import React, {Component} from 'react';
import Loading from './Loading';
import '../../css/ui/Image.scss'

export default class Image extends Component {
  constructor(props){
    super(props);
    this.state = { 
      imgURL : '',
    }
    this.url = '';
  }

  componentDidMount(){
    console.log('Image UI Mount');
  }
  componentDidUpdate(){
    console.log('Image UI Update');
  }
  componentWillUnmount(){
    console.log('Image UI Unmount');
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
    this.props.addImage('https://cors-anywhere.herokuapp.com/' + this.url);
  }

  importImage = (event) => {
    if(!event.target.files[0]) { return; }
    new Promise((resolve) => {
      let file = event.target.files[0];
      this.url = URL.createObjectURL(file);
      resolve();
    })
    .then(() => {
      console.log("loading");
			this.props.addImage(this.url);
    })
  }

  render(){
    return (
      <div className="sub">
        <div className="sub-title">
            Image ( { this.props.object.type })
        </div>
        <div className="sub-imagesmenu">
          <div className="option-title">Crop start</div>
          <div className="crop-ratio">
            <div className="crop-start-button">
              <button onClick={this.handleCropImage} className = "cropStart" crop="4:3">4:3</button>
              <button onClick={this.handleCropImage} className = "cropStart" crop="16:9">16:9</button>
              <button onClick={this.handleCropImage} className = "cropStart" crop="3:2">3:2</button>
              <button onClick={this.handleCropImage} className = "cropStart" crop="1:1">1:1</button>
            </div>
            <button id="end-button" onClick={this.props.cropEndObject} crop="left">Crop End</button>
          </div>
          <div className="option-title">Upload image</div>
          <div className="upload-file">
              <div className="image-local">
                <div className="file-input-group">
                  <label className="input-file-button" htmlFor="_file">Upload local image</label>
                  <input name="file" type='file' id='_file' onChange={this.importImage} accept="image/*" style={{ display: 'none' }}></input>
                </div>
              </div>
            <div className="image-url">
              <form id="imgload" onSubmit={this.handleSubmit}>
                <div className="image-url-group">
                  <input name="url" id="_url" value={this.state.imgURL} onChange = {this.handleChange} autoComplete="off"/>
                  <label htmlFor="_url">URL: </label>
                </div>
                <input className="url-submit" type="submit" value="Submit" />
              </form>
            </div>
          </div>
        </div>
        {this.props.imgStatus ? <Loading open = {true} /> : null}
      </div>
    );
  }

}