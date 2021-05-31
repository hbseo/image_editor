import React, { Component } from 'react';
import i18next from "../locale/i18n";
import { withTranslation } from "react-i18next";
import {randomWord} from './const/consts';
import Loading from './ui/Loading';
import imgerror from '../css/img/imgerror.svg';
import { getSearchImage } from './helper/GetImage';
import '../css/ImageList.scss';

class ImageList extends Component {
  constructor(props) {
    super(props);
    this.scrollBot = React.createRef();

    this.state = {
      random_count : 10,
      images: [],
      search: randomWord[ Math.floor(Math.random() * (randomWord.length))],
      image_count: 10,
      url: false, // 썸네일 클릭 여부 유무, 즉, imageSizeVersion 함수 실행 여부
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
      
      user : '',
      user_link : '',
      download_location : '',
    }
    this.submitSearch = ""
  }

  getImage() {
    getSearchImage(this.state.search, this.state.image_count) 
    .then(res => this.setState({ images: res }))
    .catch((error) => {
      console.log("error : ", error);
      alert(i18next.t('ImageList.Fail'));
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.submitSearch = this.state.search;
    this.getImage();
  }

  searchChange = (event) => {
    let change_state = {};
    change_state[event.target.name] = event.target.value;
    this.setState(change_state);
  }

  showImage = (imagelist) => {
    if(imagelist['errors']){ 
      // alert(i18next.t('ImageList.Showimage errors')); 
      return(
        <div id="image-list">
          <p className="not-found">Not Found</p>
        </div>
      )
    }
    const listitem = imagelist.map((image) =>
      <div className="image-list-box" key={image.id} >
        <img className="image-list-img" key={image.id} user={image.user.name} links = {image.user.links.html} dl = {image.links.download_location} src={image.urls.thumb} alt="." onClick={ this.onClickThumb } full = {image.urls.full} raw = {image.urls.raw} regular = {image.urls.regular} small = {image.urls.small} full-width = {image.width} />
        <p className="image-list-img-p" >{image.user.name}</p>
        {/* <a href = {image.urls.regular} target="_blank">{image.description}</a> */}
      </div>
      // ursl뒤에 raw, small, regular, full 등의 따라 사이즈 조절
    );
    return (
      <div id="image-list">
        {listitem}
      </div>
    )
  }

  onClickThumb = (event) => {
    new Promise((resolve) => {
      this.setState({
        url : true,
        user : event.target.getAttribute('user'),
        user_link : event.target.getAttribute('links'),
        download_location : event.target.getAttribute('dl'),
        image : {
          full : event.target.getAttribute('full'),
          raw : event.target.getAttribute('raw'),
          regular : event.target.getAttribute('regular'),
          small : event.target.getAttribute('small'),   
          thumb : event.target.src,
          full_width : event.target.getAttribute("full-width")     
      }})
      resolve();
    })
    .then(() => {
      this.getImageSize();
    })

  }

  onClickImg = (event) => {
    console.log('loading start')
    this.props.onImgUrlChange(event.target.getAttribute('url'), {user : this.state.user, user_link : this.state.user_link, dl : this.state.download_location });
    // this.props.onImgUrlChange(event.target.getAttribute('url'), {user : this.state.user, user_link : this.state.user_link, links : {download_location : this.state.download_location} });

  }

	imageNotFound = () => {

  }
  
	imageFound = (img) => {
    console.log()
  }
  
  getImageSize = () => {
    let thumb_img = new Image();
    thumb_img.onload = () => {
      this.setState({
        imageSize : {
          full : { x: this.state.image.full_width, y: Math.round(thumb_img.height * (this.state.image.full_width / thumb_img.width))},
          small : { x : 400, y : Math.round(thumb_img.height * (400 / thumb_img.width)) },
          thumb : { x: thumb_img.width, y: thumb_img.height},
          regular : { x : 1080, y: Math.round(thumb_img.height * (1080 / thumb_img.width)) },
        }
      })
    };
    thumb_img.onerror = this.imageNotFound;
    thumb_img.src = this.state.image.thumb;
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
      this.scrollBot.current.scrollTop = this.scrollBot.current.scrollHeight

      return (
        <div id="image-list-size" >
          <ul>
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
          </ul>
        </div>
      )
    }
  }

  randomCountChange = (event) => {
    let change_state = {};
    change_state[event.target.name] = event.target.value;
    this.setState(change_state);
  }

  scrollTop = () => {
    this.scrollBot.current.scrollTop = 0
  }

  render() {
    return (
      <div className="more-image-main" ref={this.scrollBot}>
        <button className="topscroll-button" onClick = {this.scrollTop}>↑</button>
        <div className="more-image-search">
          <div className="search-image">
            <div className="option-title">{i18next.t('ImageList.Search random image')}</div>
            <form className="search-form" onSubmit={this.handleSubmit}> 
              <div>
                <div className="search-group">
                  <label className ="random-image-searchtext" htmlFor="search">{i18next.t('ImageList.Image name')}</label>
                  <input className="search-input" name="search" value={this.state.search} onChange={this.searchChange} />
                </div>
                <div className="search-group">
                  <label className ="random-image-searchtext" htmlFor="image_count">{i18next.t('ImageList.Image count')}</label>
                  <input className="search-input" type="number" name="image_count" value={this.state.image_count} onChange={this.searchChange} />
                </div>
              </div>
              <input className="search-image-button" type="submit" value="Enter" />
            </form>
          </div>
        </div>
        {this.submitSearch === "" ? null :
          <div className="submit-search-div">
          {this.submitSearch.toUpperCase()}
          </div>
        }
        {this.showImage(this.state.images)}
        {this.state.url ? this.imageSizeVersion() : null}
        {this.props.children}
        <Loading open = {this.props.loading}/>
      </div>
    )
  }
}
export default withTranslation()(ImageList);