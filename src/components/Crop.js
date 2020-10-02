import Action from './Action';
import { fabric } from 'fabric';
class Crop extends Action {
    constructor(App){
      super('Crop', App);
    }

    cropObj = (activeObject, option) => {
        let canvas = this.getCanvas();
        var image = activeObject;
        
        if(image){
          var clipPath = new fabric.Rect({ width: 0, height: 0, top: 0,  left: 0 })
          switch(option){
            case 'right':
              var clipPath = new fabric.Rect({ width: -image.width/2, height: image.height * 2, top: -image.height/2,  left: 0 })
              break;
            case 'left':
              clipPath = new fabric.Rect({width: image.width/2 , height: image.height * 2, top: -image.height/2 ,  left: 0 })
              break;
            default :
          }
  
          // clipPath.inverted = true
          image.set({
            clipPath : clipPath
          })
  
          // canvas.setWidth(1000);
          // canvas.setHeight(500);
  
          console.log(image);
        } else {
          
        }
        

        canvas.renderAll();
        
    }

}

export default Crop;

