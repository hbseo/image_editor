import Action from './Action';
import { fabric } from 'fabric';
import originImage from '../helper/originImage';
import $ from 'jquery';
class Image extends Action {
  constructor(App) {
    super('Image', App);
    this.testUrl = null;
  }

  addImageEvent = (event) => {
    const canvas = this.getCanvas();
    const pointer = canvas.getPointer(event, false)
    if(event.target.tagName === 'CANVAS'){
      this.loadingStart();
      this.loadImage(this.testUrl, pointer, {originX : "center", originY : "center", scaleX : 1, scaleY : 1})
      .then((data) => {
        canvas.add(data).setActiveObject(data);
        this.saveState('image add');
        this.loadingFinish();
      })
      .catch(() => {
        alert("image load error");
        this.loadingFinish();
      })
    }
    document.removeEventListener('mousedown', this.addImageEvent);
    canvas.defaultCursor = 'default';
    canvas.selection = true;
  }

  addImage = (url) => {
    const canvas = this.getCanvas();
    this.testUrl = url;

    this.loadingStart();

    let imgObj = originImage();
    imgObj.crossOrigin = "anonymous";

    imgObj.onload  = () => {
      console.log("onload", imgObj);
      canvas.defaultCursor = 'pointer';
      canvas.selection = false;
      var tempCanvas = document.createElement('CANVAS');
      var tempCtx = tempCanvas.getContext('2d');
      // tempCtx.drawImage(this, 0, 0);
      tempCanvas.height = imgObj.naturalHeight;
      tempCanvas.width = imgObj.naturalWidth;
      tempCtx.drawImage(imgObj, 0, 0);
      var dataURL = tempCanvas.toDataURL();
      this.testUrl = dataURL;
      this.loadingFinish();
      setTimeout(() => {
        document.addEventListener('mousedown',this.addImageEvent);
      }, 1);
    }

    imgObj.onerror = () => {
      alert('image load error');
      this.loadingFinish();
      console.log('fail');
    }
    imgObj.src = this.testUrl;
  }

  
  loadImage = (url, pointer, option) => {
    return new Promise((resolve, reject) => {
      fabric.Image.fromURL(url, img => {
        if(img._element != null){
          img.set({
            angle: 0,
            originX: option.originX,
            originY: option.originY,
  
            left: pointer.x,
            top: pointer.y,
  
            scaleX : option.scaleX,
            scaleY : option.scaleY,
  
            strokeWidth : 0,
            cornerStrokeColor : "grey",
            borderColor : "grey"
          });
          resolve(img);
        }
        else{
          reject();
        }
      }, { crossOrigin: 'anonymous' }
      );
    });
  }

  saveImage = (title) => {
    let quality = $('input[name=quality]:checked').val()
    let format= $('input[name=format]:checked').val()    
    let option;
    let name;
    if(format === 'jpeg'){
      option = {
        format : 'jpeg',
        quality : parseFloat(quality)
      }
      name = title + '.jpeg'
    }
    else{
      option = {
        format : 'png'
      }
      name = title + '.png'
    }
    const canvas = this.getCanvas();
    let dataURL = canvas.toDataURL(option);
    var a = document.createElement("a");
    a.href = dataURL;
    a.setAttribute("download", name);
    a.click();
  }


}

export default Image;