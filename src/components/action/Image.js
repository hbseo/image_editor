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
      .catch(() => {
        alert("image load error");
      })
    }
    document.removeEventListener('mousedown', this.addImageEvent);
    canvas.defaultCursor = 'default';
    canvas.selection = true;
  }

  addImage = (url) => {
    const canvas = this.getCanvas();
    canvas.defaultCursor = 'pointer';
    canvas.selection = false;
    this.testUrl = url;
    document.addEventListener('mousedown',this.addImageEvent);
  }

  
  loadImage = (url, pointer, option) => {
    return new Promise((resolve, reject) => {
      console.log(url);
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
  
            strokeWidth : 0
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

  saveImage = () => {
    let quality = $('input[name=quality]:checked').val()
    let format= $('input[name=format]:checked').val()
    let option;
    let name;
    if(format === 'jpeg'){
      option = {
        format : 'jpeg',
        quality : parseFloat(quality)
      }
      name = 'image.jpeg'
    }
    else{
      option = {
        format : 'jpeg'
      }
      name = 'image.png'
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