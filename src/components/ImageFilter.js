import i18next from "../locale/i18n";
import React, { Component } from 'react';
import { withTranslation } from "react-i18next";
import { generate3dPhoto } from './helper/generate3dPhoto';

class ImageFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sourceImg : null,
      mapImg : null,
      source : false,
      map : false,
    }
  }

  componentDidMount(){
  }

  imgSubmit = (event) => {
    this.setState({source : false, sourceImg : null});
    let file = event.target.files[0];
    event.target.value = null;

    let imgObj = new Image();

    imgObj.crossOrigin = "anonymous";

    imgObj.onload  = () => {
      var tempCanvas = document.createElement('CANVAS');
      var tempCtx = tempCanvas.getContext('2d');
      tempCanvas.height = imgObj.naturalHeight;
      tempCanvas.width = imgObj.naturalWidth;
      tempCtx.drawImage(imgObj, 0, 0);
      var dataURL = tempCanvas.toDataURL();
      this.setState({sourceImg : dataURL, source : true})
    }

    imgObj.onerror = () => {
      alert(i18next.t("ImageFilter.Load Error"));
      console.log('fail');
    }

    imgObj.src = URL.createObjectURL(file);
  }

  mapSubmit = (event) => {
    this.setState({map : false, mapImg : null});
    let file = event.target.files[0];
    event.target.value = null;

    let imgObj = new Image();

    imgObj.crossOrigin = "anonymous";

    imgObj.onload  = () => {
      var tempCanvas = document.createElement('CANVAS');
      var tempCtx = tempCanvas.getContext('2d');
      tempCanvas.height = imgObj.naturalHeight;
      tempCanvas.width = imgObj.naturalWidth;
      tempCtx.drawImage(imgObj, 0, 0);
      var dataURL = tempCanvas.toDataURL();
      this.setState({mapImg : dataURL, map : true})
    }

    imgObj.onerror = () => {
      alert(i18next.t("ImageFilter.Load Error"));
      console.log('fail');
    }

    imgObj.src = URL.createObjectURL(file);
  }

  generate = () => {

    if(this.state.source && this.state.map){
      let ph = document.getElementById('photo');
      this.deleteChild(ph);
      generate3dPhoto({
        el: '#photo', // Required!
        src: this.state.sourceImg, // Required!
        map: this.state.mapImg, // Required!
        scale: 0.7 // Optional, default: 1 
      })
    }
  }

  deleteChild = (el) => {
    while( el.hasChildNodes() ){
      el.removeChild(el.firstChild)
    }
  }

  render() {
    return (
      <div>
        <div>
          <h1>{i18next.t("ImageFilter.Make")}</h1>
          <input type='file' onChange={this.imgSubmit} accept='image/*' />{i18next.t("ImageFilter.Image")}
          <input type='file' onChange={this.mapSubmit} accept='image/*' />{i18next.t("ImageFilter.MapFile")}
          <button onClick={this.generate}>{i18next.t("ImageFilter.Generate")}</button>
        
        </div>

        <div id = "photo"></div>
      </div>
    )
  }
}
export default withTranslation()(ImageFilter);

