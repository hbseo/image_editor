import React, { Component } from 'react';
import ImageList from './ImageList';
import Project from './Project';
import Login from './Login';
import Newproject from './New_project';
import Uploadfile from './Upload_file';
import { Link } from 'react-router-dom';
import './Main.css';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = { tab : 0, width: 5, height: 5, url: "", submit: false, imgRatio: 100, imgWidth: 0, imgHeight: 0 };
    this.url = "";
    this.image = null;
  }

  changeTab = (event) => {
    this.setState({tab : parseInt(event.target.getAttribute('tab'), 10)});
  }

  renderLink = (width, height) => {
    if (width === 0 || height === 0) {
      return <p>no link</p>
    }
    return <div><Link to={{
      pathname: '/edit',
      state: {
        width: width,
        height: height,
      }
    }}><img className="canvas-icon" src='./image/photo.svg'></img></Link>
      <p className='description'>{width}X{height}</p></div>
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

  render() {
    const tab = {
      0: <Newproject></Newproject>,
      1: <Uploadfile></Uploadfile>,
      2: <ImageList onClick={this.onImgUrlChange}>
          <div className='preview'>
            <img id="preview" src={this.url} alt="preview"></img>
              {
                !this.state.submit ? null
                  : <div><Link to={{
                    pathname: '/edit',
                    state: {
                      width: this.state.width,
                      height: this.state.height,
                      url: this.url,
                      ratio: this.state.imgRatio,
                    }
                  }}><i className="far fa-square fa-5x canvas-icon"></i></Link>
                    <p>{this.state.width}X{this.state.height}</p></div>
              }
              <input disabled type="range" name="imgRatio" id="imgRatio" value={this.state.imgRatio} onChange={this.handleImageSizeChange} min="5" max="200" step="1" />
              <p>{this.state.imgRatio}</p>
          </div>
        </ImageList>
    }
    return (
      <div className='Main'>
        <div className='sidenav'>
          <button onClick={this.changeTab} tab='0'>New Project</button>
          <button className='dropdown-btn'>Load Image</button>
          <div className='dropdown-container'>
            <button onClick={this.changeTab} tab='1'>Upload File</button>
            <button onClick={this.changeTab} tab='2'>More Image</button>
          </div>
        </div>
        <div className='right' style={{float:'right'}}>
          <button className='rightbtn'>More</button>
          <div className='right-content'>
            <button>Log In</button>
            <button>Settings</button>
          </div>
        </div>
        <div className='inner'>
          {tab[this.state.tab]}
        </div>
      </div>
    )
  }
}
export default Main;
