import React, { Component } from 'react';
import ImageList from './ImageList';
import Uploadfile from './Upload_file';
import ImageModal from './ImageModal';
import { Link } from 'react-router-dom';
import unsplash from './helper/UnspalshAPI';
import { unSplashAppName } from './const/consts';
import i18next from "../locale/i18n";
import { withTranslation } from "react-i18next";
import { corsLink } from './const/consts';

class LoadImage extends Component {
  constructor(props) {
    super(props);
    this.state = { width: 5, height: 5, url: "", submit: false, imgRatio: 100, imgWidth: 0, imgHeight: 0, imageModal : false, loading : false, unsplash : false, data : null };
    this.url = "";
    this.image = null;
    this.filter = true;

  }

  onImgUrlChange = (url, data) => {
		new Promise(resolve => {
			this.setState({url : url, loading : true, unsplash : true, data : data});
      resolve();
		})
		.then( () => {
			this.handleSubmit();
		});
  }

  handleSubmit = (event) => {
    if (event) { event.preventDefault(); }
    if ( this.state.unsplash ){
      unsplash.photos.trackDownload({ downloadLocation: this.state.data.dl });
    }
    this.url = this.state.url;
    this.setState({ url: "", submit: false, width: 0, height: 0, imgRatio: 100 });
    this.image = new Image();
    this.image.onload = this.imageFound;
    this.image.onerror = this.imageNotFound;
    this.image.src = this.url;
  }

  handleChange = (event) => {
    // document.getElementById("imgRatio").disabled = true;
    let change_state = {};
    change_state[event.target.name] = event.target.value;
    this.url = ""
    this.setState({ submit: false, imgRatio: 100 })
    this.setState(change_state);
  }

  imageNotFound = () => {
    this.image = null;
    this.setState({loading : false});
    alert(i18next.t("LoadImage.Invalid Url"));
  }

  imageFound = () => {
    // document.getElementById("imgRatio").disabled = false;
    var ratio = 100;
    var originWidth = this.image.width;
    var originHeight = this.image.height; 
    if (this.image.width > 2048 || this.image.height > 2048) {
      this.filter = false;
      if (this.image.width > this.image.height) {
        ratio = 2048 / this.image.width
        this.image.width = 2048;
        this.image.height *= ratio
        ratio *= 100;
      }
      else {
        ratio = 2048 / this.image.height
        this.image.height = 2048
        this.image.width *= ratio
        ratio *= 100;
      }
    }
    else{
      this.filter = true;
    }
    this.setState({
      submit: true,
      width: this.image.width,
      height: this.image.height,
      // imgRatio: ratio * 100,
      imgRatio: ratio,
      imgWidth: originWidth,
      imgHeight: originHeight,
      imageModal : true,
      loading : false,
    })
    console.log("loading finish")

  }

  urlImageChange = (event) => {
    if (event) { event.preventDefault(); }
    console.log('url img loading start')
		this.setState({loading : true, unsplash : false });

    let imgObj = new Image();

    imgObj.crossOrigin = "anonymous";
    imgObj.onload  = () => {
      var tempCanvas = document.createElement('CANVAS');
      var tempCtx = tempCanvas.getContext('2d');
      // tempCtx.drawImage(this, 0, 0);
      tempCanvas.height = imgObj.naturalHeight;
      tempCanvas.width = imgObj.naturalWidth;
      tempCtx.drawImage(imgObj, 0, 0);
      var dataURL = tempCanvas.toDataURL();
      this.setState({url : dataURL, unsplash : false, data : null})
      this.handleSubmit();
    }

    imgObj.onerror = () => {
      alert(i18next.t("LoadImage.Load Error"));
      this.setState({loading : false});
      console.log('fail');
    }

    imgObj.src = corsLink + this.state.url;
  }

  fileChange = (event) => {
    // new Promise((resolve) => {
    //   let file = event.target.files[0];
    //   this.setState({ url: URL.createObjectURL(file) });
    //   event.target.value = null;
    //   resolve();
    // })
    // .then(() => {
    //   this.handleSubmit();
    // })
    console.log('file loading start')
		this.setState({loading : true, unsplash : false });

    let file = event.target.files[0];
    event.target.value = null;
    let imgObj = new Image();

    imgObj.crossOrigin = "anonymous";
    imgObj.onload  = () => {
      var tempCanvas = document.createElement('CANVAS');
      var tempCtx = tempCanvas.getContext('2d');
      // tempCtx.drawImage(this, 0, 0);
      tempCanvas.height = imgObj.naturalHeight;
      tempCanvas.width = imgObj.naturalWidth;
      tempCtx.drawImage(imgObj, 0, 0);
      var dataURL = tempCanvas.toDataURL();
      this.setState({url : dataURL})
      this.handleSubmit();
    }

    imgObj.onerror = () => {
      alert(i18next.t("LoadImage.Load Error"));
      this.setState({loading : false});
      console.log('fail');
    }

    imgObj.src = URL.createObjectURL(file);
  }

  handleImageSizeChange = (event) => {
    new Promise((resolve) => {
      // if (this.state.imgWidth === 2048 || this.state.imgHeight === 2048) {
      //   return;
      // }
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

  closeImageModal = () => {
    this.setState({ imageModal : false});
  }

  showPreviewImg = () => {
    return(
      <div className='preview'>
        <ImageModal 
          open = {this.state.imageModal}
          close = {this.closeImageModal} >
            <div className='preview'>
              <div className="preview-box">
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
                    <img id="preview" src={this.url} alt="preview" ></img>
                </Link>
              </div>
              <div className="preview-middle">
                <a href={this.url} target="_blank" rel="noreferrer">{i18next.t("LoadImage.Enlarge")}</a>
                <p>{this.state.width}X{this.state.height}</p>
                { this.state.unsplash ? 
                <div>
                  {/* <p>{this.state.data.dl}</p> */}
                  <p>Photo by <a className="user_name" href={this.state.data.user_link + "?utm_source=" + unSplashAppName + "&utm_medium=referral"} target = "_blank" rel="noreferrer">{this.state.data.user}</a> on <a className="unsplash_link" href={"https://unsplash.com/?utm_source=" + unSplashAppName + "&utm_medium=referral"} target = "_blank" rel="noreferrer">Unsplash</a></p>
                  
                </div> : null}
                { !this.filter ?
                <div>
                  필터 적용 불가
                </div> : null}
              </div>
              <div className="preview-bottom">
                <input type="range" name="imgRatio" id="imgRatio" value={this.state.imgRatio} onChange={this.handleImageSizeChange} min="5" max="200" step="1" />
                <p>{this.state.imgRatio} %</p>
              </div>
            </div>
        </ImageModal>
      </div>
    )
  }

  render() {
    const tab = {
      1: <Uploadfile
          fileChange = {this.fileChange}
          handleChange = {this.handleChange}
          handleSubmit = {this.handleSubmit}
          urlImageChange = {this.urlImageChange}
          url = {this.state.url}
          imgUrl = {this.url}
          loading = {this.state.loading}>
          {this.showPreviewImg()}
         </Uploadfile>,
      2: <ImageList onImgUrlChange = {this.onImgUrlChange} loading = {this.state.loading}>
          {this.showPreviewImg()}
         </ImageList>
    }
    return (
        tab[ parseInt(this.props.tab, 10) ]
    );
  }
}

export default withTranslation()(LoadImage);

/*
backup
 <div className='preview'>
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
*/