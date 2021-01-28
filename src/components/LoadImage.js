import React, { Component } from 'react';
import ImageList from './ImageList';
import Uploadfile from './Upload_file';
import { Link } from 'react-router-dom';

class LoadImage extends Component {
  constructor(props) {
    super(props);
    this.state = { width: 5, height: 5, url: "", submit: false, imgRatio: 100, imgWidth: 0, imgHeight: 0 };
    this.url = "";
    this.image = null;
  }

  onImgUrlChange = (url) => {
		new Promise(resolve => {
			this.setState({url : url});
      resolve();
		})
		.then( () => {
			this.handleSubmit();
		});
  }

  handleSubmit = (event) => {
    if (event) { event.preventDefault(); }
    this.url = this.state.url;
    console.log(this.url); 
    this.setState({ url: "", submit: false, width: 0, height: 0, imgRatio: 100 });
    this.image = new Image();
    this.image.onload = this.imageFound;
    this.image.onerror = this.imageNotFound;
    this.image.src = this.url;
  }

  handleUrlSubmit = (event) => {
    if (event) { event.preventDefault(); }
    this.url = 'https://cors-anywhere.herokuapp.com/' + this.state.url;
    console.log(this.url); 
    this.setState({ url: "", submit: false, width: 0, height: 0, imgRatio: 100 });
    this.image = new Image();
    this.image.onload = this.imageFound;
    this.image.onerror = this.imageNotFound;
    this.image.src = this.url;
  }

  handleChange = (event) => {
    document.getElementById("imgRatio").disabled = true;
    let change_state = {};
    change_state[event.target.name] = event.target.value;
    this.url = ""
    this.setState({ submit: false, imgRatio: 100 })
    this.setState(change_state);
  }

  imageNotFound = () => {
    this.image = null;
    alert("not valid url");
  }

  imageFound = () => {
    document.getElementById("imgRatio").disabled = false;
    var ratio = 1;
    if (this.image.width > 2048 || this.image.height > 2048) {
      if (this.image.width > this.image.height) {
        ratio = 2048 / this.image.width
        this.image.width = 2048;
        this.image.height *= ratio
      }
      else {
        ratio = 2048 / this.image.height
        this.image.height = 2048
        this.image.width *= ratio
      }
    }
    this.setState({
      submit: true,
      width: this.image.width,
      height: this.image.height,
      imgRatio: ratio * 100,
      imgWidth: this.image.width,
      imgHeight: this.image.height
    })
  }

  fileChange = (event) => {
    new Promise((resolve) => {
      let file = event.target.files[0];
      this.setState({ url: URL.createObjectURL(file) });
      resolve();
    })
    .then(() => {
      this.handleSubmit();
    })
  }

  handleImageSizeChange = (event) => {
    new Promise((resolve) => {
      if (this.state.imgWidth === 2048 || this.state.imgHeight === 2048) {
        return;
      }
      let ratio = event.target.value;
      let width = Math.round(this.state.imgWidth * (event.target.value / 100));
      let height = Math.round(this.state.imgHeight * (event.target.value / 100));

      if (width > 2048 || height > 2048) {
        return;
      }
      resolve({ ratio, width, height })
    })
      .then((data) => {
        this.setState({ imgRatio: data.ratio, width: data.width, height: data.height });
      })
  }

  showPreviewImg = () => {
    return(
      <div className='preview'>
        {/* <img id="preview" src={this.url} alt="preview"></img> */}
          { !this.state.submit ? null : 
            <div>
              <Link 
                to={{
                  pathname: '/edit',
                  state: {
                    width: this.state.width,
                    height: this.state.height,
                    url: this.url,
                    ratio: this.state.imgRatio,
                  }
                }}>
              <i className="far fa-square fa-5x canvas-icon"></i></Link>
              <p>{this.state.width}X{this.state.height}</p>
            </div>
          }
          <input disabled type="range" name="imgRatio" id="imgRatio" value={this.state.imgRatio} onChange={this.handleImageSizeChange} min="5" max="200" step="1" />
        <p>{this.state.imgRatio}</p>
      </div>
    )
  }

  render() {
    const tab = {
      1: <Uploadfile
          fileChange = {this.fileChange}
          handleChange = {this.handleChange}
          handleSubmit = {this.handleSubmit}
          handleUrlSubmit = {this.handleUrlSubmit}
          url = {this.state.url}
          imgUrl = {this.url}>
          {this.showPreviewImg()}
         </Uploadfile>,
      2: <ImageList onImgUrlChange = {this.onImgUrlChange}>
          {this.showPreviewImg()}
         </ImageList>
    }
    return (
      <div>
        {tab[ parseInt(this.props.tab, 10) ]}
      </div>
    );
  }
}

export default LoadImage;