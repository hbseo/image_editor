import Action from './Action';
import { fabric } from 'fabric';
class Crop extends Action {
  constructor(App) {
    super('Crop', App);
  }

  cropObj = (activeObject, option) => {
    let canvas = this.getCanvas();
    var image = activeObject;

    if (image) {
      var clipPath = new fabric.Rect({ width: 0, height: 0, top: 0, left: 0 })
      switch (option) {
        case 'right':
          clipPath = new fabric.Rect({ width: -image.width / 2, height: image.height * 2, top: -image.height / 2, left: 0 })
          break;
        case 'left':
          clipPath = new fabric.Rect({ width: image.width / 2, height: image.height * 2, top: -image.height / 2, left: 0 })
          break;
        default:
      }

      // clipPath.inverted = true
      image.set({
        clipPath: clipPath
      })

      // console.log(image);
    }
    else {
      image = canvas.backgroundImage;
      switch (option) {
        case 'right':
          canvas.setWidth(canvas.width / 2);

          break;
        case 'left':
          // clipPath = new fabric.Rect({width: 0 , height: 0, top: 0 ,  left: 0 })
          canvas.setWidth(canvas.width / 2);
          if (image) { canvas.backgroundImage.left = -canvas.width }
          break;
        default:
      }
      // image.set({
      //   clipPath : clipPath
      // })
      canvas.calcOffset();
    }


    canvas.renderAll();

  }

}

export default Crop;