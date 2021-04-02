import React, { Component } from 'react';
import i18next from "../../locale/i18n";
import { withTranslation } from "react-i18next";
import { getSearchImage} from '../helper/GetImage';
import imgerror from '../../css/img/imgerror.svg';
import Modal from '../Modal';
import '../../css/ui/ImageMini.scss';

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
      openModal : false
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
    if(imagelist['errors']){ alert(i18next.t('ImageList.Showimage errors')); return null;}
    const listitem = imagelist.map((image) =>
      <div className="mini-image-list-box" key={image.id} >
        <img className="image-list-img" key={image.id} src={image.urls.thumb} alt="." onClick={ this.onClickThumb } full = {image.urls.full} raw = {image.urls.raw} regular = {image.urls.regular} small = {image.urls.small}/>
      </div>
    );
    return (
      <div id="mini-image-list">{listitem}</div>
    )
  }

  onClickThumb = (event) => {
    new Promise((resolve) => {
      this.setState({
        url : true,
        openModal : true,
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
    console.log(event.target.getAttribute('url'));
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

  imageSizeVersion = () => {
    let image = this.state.image;
    if(!image){
      return(
        <div id="image-list-size-none">
          <p>no img</p>
        </div>        
      )
    }
    else{
      return (
        <Modal open={this.state.openModal}>
          <div id="mini-image-list" >
            <div className="mini-image-list-box">
              <img className="image-list-img" src = {image.thumb} url={image.full} alt="." onClick={this.onClickImg}/>
              <div>full: {this.state.imageSize.full.x} X  {this.state.imageSize.full.y}</div>
            </div>
            <div className="mini-image-list-box">
              <img className="image-list-img" src = {image.thumb} url={image.regular} alt="." onClick={this.onClickImg} />
              <div>regular: {this.state.imageSize.regular.x} X  {this.state.imageSize.regular.y}</div>
            </div>
            <div className="mini-image-list-box">
              <img className="image-list-img" src = {image.thumb} url={image.small} alt="." onClick={this.onClickImg} />
              <div>small: {this.state.imageSize.small.x} X {this.state.imageSize.small.y}</div>
            </div>
            <div className="mini-image-list-box">
              <img className="image-list-img" src = {image.thumb} url={image.thumb} alt="." onClick={this.onClickImg} />
              <div>thumb: {this.state.imageSize.thumb.x} X {this.state.imageSize.thumb.y}</div>
            </div>
          </div>
        </Modal>
      )
    }
  }

  render() {
    return (
      <div className="mini-image-list">
        <div>
          <form className="asearch-form" onSubmit={this.handleSubmit}> 
            <div>
              <div className="asearch-group">
                <label className ="arandom-image-searchtext" htmlFor="search">{i18next.t('ImageList.Image name')}</label>
                <input className="asearch-input" name="search" value={this.state.search} onChange={this.searchChange} />
              </div>
              <div className="asearch-group">
                <label className ="arandom-image-searchtext" htmlFor="image_count">{i18next.t('ImageList.Image count')}</label>
                <input className="asearch-input" type="number" name="image_count" value={this.state.image_count} onChange={this.searchChange} />
              </div>
            </div>
            <input className="asearch-image-button" type="submit" value="Enter" />
          </form>
        </div>
        <div>
          {this.showImage(this.state.images)}
        </div>
        {this.state.url ? this.imageSizeVersion() : null}
      </div>
    )
  }
}
export default withTranslation()(ImageMini);