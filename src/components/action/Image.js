import Action from './Action';
import { fabric } from 'fabric';

class Image extends Action {
  constructor(App) {
    super('Image', App);
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
    const canvas = this.getCanvas();
    let dataURL = canvas.toDataURL({
      format: 'png'
    });
    var a = document.createElement("a");
    a.href = dataURL;
    a.setAttribute("download", 'image.png');
    a.click();
  }


}

export default Image;