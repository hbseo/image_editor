import React, { Component } from 'react';
import i18next from "../../locale/i18n";
import { withTranslation } from "react-i18next";
import { getSearchImage} from '../helper/GetImage';
import imgerror from '../../css/img/imgerror.svg';
import ImageModal from '../ImageModal';
import '../../css/ui/ImageMini.scss';
import unsplash from '../helper/UnspalshAPI';
import { unSplashAppName } from '../const/consts' 

class ImageMini extends Component {
  constructor(props) {
    super(props);

    this.state = {
      images: [],
      search: '',
      image_count: 10,
      url: false,
      image : {
        full : '',
        raw : '',
        regular : '',
        small : '',
        thumb : imgerror
      },
      imageSize : {
        full : { x:0, y:0},
        raw : { x:0, y:0},
        regular : { x:0, y:0},
        small : { x:0, y:0},
        thumb : { x:0, y:0},
      },
      openModal : false,
      user : '',
      user_link : '',
      download_location : '',

    }
  }

  getImage() {
    getSearchImage(this.state.search, this.state.image_count)
    .then(res =>  this.setState({ images : res }))
    .catch((error) => {
      console.log(error);
      alert(i18next.t('ImageList.Fail'));
    });    
  }

  showImage = (imagelist) => {
    if(imagelist['errors']){ 
      // alert(i18next.t('ImageList.Showimage errors')); 
      return(
        <div style={{color : 'white'}}>
          Not Found
        </div>
      )
    }
    const listitem = imagelist.map((image) =>
      <div className="mini-image-list-box" key={image.id} >
        <img className="image-list-img" key={image.id} user={image.user.name} links = {image.user.links.html} dl = {image.links.download_location} src={image.urls.thumb} alt="." onClick={ this.onClickThumb } full = {image.urls.full} raw = {image.urls.raw} regular = {image.urls.regular} small = {image.urls.small} full-width = {image.width} />
        <p className="image-list-img-p" >{image.user.name}</p>
      </div>
    );
    return (
      <div className="mini-image-list">
        <div>
          {listitem}
        </div>
      </div>
    )
  }

  onClickThumb = (event) => {
    new Promise((resolve) => {
      this.setState({
        url : true,
        openModal : true,
        user : event.target.getAttribute('user'),
        user_link : event.target.getAttribute('links'),
        download_location : event.target.getAttribute('dl'),
        image : {
          full : event.target.getAttribute('full'),
          raw : event.target.getAttribute('raw'),
          regular : event.target.getAttribute('regular'),
          small : event.target.getAttribute('small'),   
          thumb : event.target.src     
      }})
      resolve();
    })
    .then(() => {
      this.getImageSize();
    })
  }

  onClickImg = (event) => {
    unsplash.photos.trackDownload({ downloadLocation: this.state.download_location });
    this.props.addImage(event.target.getAttribute('url'));
    this.setState({openModal : false});
    // this.props.onImgUrlChange(event.target.getAttribute('url'));
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.getImage();
  }

  searchChange = (event) => {
    let change_state = {};
    change_state[event.target.name] = event.target.value;
    this.setState(change_state);
  }

	imageNotFound = () => {
    alert('not found');
  }
  
  getImageSize = () => {
    let full_img = new Image();
    full_img.onload = () => {
      this.setState({
        imageSize : {
          full : { x: full_img.width, y: full_img.height},
          small : { x : 400, y: Math.round(full_img.height * (400 / full_img.width)) },
          thumb : { x : 200, y: Math.round(full_img.height * (200 / full_img.width)) },
          regular : { x : 1080, y: Math.round(full_img.height * (1080 / full_img.width)) },
        }
      })
    };
    full_img.onerror = this.imageNotFound;
    full_img.src = this.state.image.full;
  }

  closeModal = () => {
    this.setState({openModal : false});
  }

  imageSizeVersion = () => {
    let image = this.state.image;
    console.log("test")
    if(!image){
      return(
        <div id="image-list-size-none">
          <p>no img</p>
        </div>        
      )
    }
    else{
      return (
        <ImageModal open={this.state.openModal} close = {this.closeModal}>
          <div className="mini-image-modal-div">
            <div className="mini-image-preview">
              <img className="preview-img" src = {image.small} url={image.full} alt="." />
            </div>

            <div id="modal-miniimage-list" >
              <div className="modal-miniimage-list-img">
                <i className="far fa-images fa-4x" url={image.regular} onClick={this.onClickImg}></i>
                <div>{this.state.imageSize.regular.x} X  {this.state.imageSize.regular.y}</div>
              </div>
              <div className="modal-miniimage-list-img">
                <i className="far fa-images fa-4x" url={image.small} onClick={this.onClickImg}></i>
                <div>{this.state.imageSize.small.x} X {this.state.imageSize.small.y}</div>
              </div>
              <div className="modal-miniimage-list-img">
                <i className="far fa-images fa-4x" url={image.thumb} onClick={this.onClickImg}></i>
                <div>{this.state.imageSize.thumb.x} X {this.state.imageSize.thumb.y}</div>
              </div>
            </div>
            {/* <ul>
              <li>
                <img className="image-list-img" src = {image.thumb} url={image.full} alt="." onClick={this.onClickImg}/>
                <div>full: {this.state.imageSize.full.x} X  {this.state.imageSize.full.y}</div>
              </li>
              <li>
                <img className="image-list-img" src = {image.thumb} url={image.regular} alt="." onClick={this.onClickImg} />
                <div>regular: {this.state.imageSize.regular.x} X  {this.state.imageSize.regular.y}</div>
              </li>
              <li>
                <img className="image-list-img" src = {image.thumb} url={image.small} alt="." onClick={this.onClickImg} />
                <div>small: {this.state.imageSize.small.x} X {this.state.imageSize.small.y}</div>
              </li>
              <li>
                <img className="image-list-img" src = {image.thumb} url={image.thumb} alt="." onClick={this.onClickImg} />
                <div>thumb: {this.state.imageSize.thumb.x} X {this.state.imageSize.thumb.y}</div>
              </li>
            </ul> */}
            {/* <div className="modal-miniimage-list-box">
              <img className="modal-miniimage-list-img" src = {image.thumb} url={image.full} alt="." onClick={this.onClickImg}/>
              <div className="modal-miniimage-list-text">full: {this.state.imageSize.full.x} X  {this.state.imageSize.full.y}</div>
            </div>
            <div className="modal-miniimage-list-box">
              <img className="modal-miniimage-list-img" src = {image.thumb} url={image.regular} alt="." onClick={this.onClickImg} />
              <div className="modal-miniimage-list-text">regular: {this.state.imageSize.regular.x} X  {this.state.imageSize.regular.y}</div>
            </div>
            <div className="modal-miniimage-list-box">
              <img className="modal-miniimage-list-img" src = {image.thumb} url={image.small} alt="." onClick={this.onClickImg} />
              <div className="modal-miniimage-list-text">small: {this.state.imageSize.small.x} X {this.state.imageSize.small.y}</div>
            </div>
            <div className="modal-miniimage-list-box">
              <img className="modal-miniimage-list-img" src = {image.thumb} url={image.thumb} alt="." onClick={this.onClickImg} />
              <div className="modal-miniimage-list-text">thumb: {this.state.imageSize.thumb.x} X {this.state.imageSize.thumb.y}</div>
            </div> */}
          </div>
          <p className="photo-tag">Photo by <a href={this.state.user_link + "?utm_source=" + unSplashAppName + "&utm_medium=referral"} target = "_blank" rel="noreferrer">{this.state.user}</a> on <a href={"https://unsplash.com/?utm_source=" + unSplashAppName + "&utm_medium=referral"} target = "_blank" rel="noreferrer">Unsplash</a></p>
        </ImageModal>
      )
    }
  }

  render() {
    return (
      <div className="mini-image">
        <form className="asearch-form" onSubmit={this.handleSubmit}> 
          <div className="form-box">
            <label className ="arandom-image-searchtext" htmlFor="search">{i18next.t('ImageList.Image name')}</label>
            <input id="lib-name" autoComplete="off" placeholder="Search Library" name="search" value={this.state.search} onChange={this.searchChange} />
            
            <label className ="arandom-image-searchtext" htmlFor="image_count">{i18next.t('ImageList.Image count')}</label>
            <div className="asearch-group">
              <input className="asearch-input" type="number" name="image_count" value={this.state.image_count} onChange={this.searchChange} />
            </div>
            <input className="asearch-image-button" type="submit" value="Enter" />
          </div>
        </form>
        {this.showImage(this.state.images)}
        {this.state.url ? this.imageSizeVersion() : null}
      </div>
    )
  }
}
export default withTranslation()(ImageMini);