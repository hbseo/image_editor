import Action from './Action';
import { fabric } from 'fabric';
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
      this.loadImage(this.testUrl, pointer, {originX : "center", originY : "center", scaleX : 1, scaleY : 1})
      .then((data) => {
        canvas.add(data).setActiveObject(data);
        this.getImageEditor().saveState('image add');
      })
    }
    document.removeEventListener('mousedown', this.addImageEvent);
    canvas.defaultCursor = 'default';
  }

  addImage = (url) => {
    this.getCanvas().defaultCursor = 'pointer';
    this.testUrl = url;
    document.addEventListener('mousedown',this.addImageEvent);
  }

  
  loadImage = (url, pointer, option) => {
    return new Promise(resolve => {
      fabric.Image.fromURL(url, img => {
        img.set({
          angle: 0,
          originX: option.originX,
          originY: option.originY,

          left: pointer.x,
          top: pointer.y,

          scaleX : option.scaleX,
          scaleY : option.scaleY,

          strokeWidth : 0
        });
        resolve(img);
      }, { crossOrigin: 'anonymous' }
      );
    });
  }

  saveImage = () => {
    let quality = $('input[name=quality]:checked').val()
    let option = {
      format : 'jpeg',
      quality : parseFloat(quality)
    }

    const canvas = this.getCanvas();
    let dataURL = canvas.toDataURL(option);
    var a = document.createElement("a");
    a.href = dataURL;
    a.setAttribute("download", 'image.png');
    a.click();
  }


}

export default Image;