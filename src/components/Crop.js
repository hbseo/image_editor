import Action from './Action';
import { fabric } from 'fabric';
class Crop extends Action {
    constructor(App){
      super('Crop', App);
    }

    cropObj = (activeObject, option) => {
        let canvas = this.getCanvas();
        var image = activeObject;
        // var rectangle = new fabric.Rect({
        //   fill: 'transparent',
        //   stroke: '#ccc',
        //   strokeDashArray: [2, 2],
        //   visible: false,
        //   width : 10,
        //   height : 10
        // });
        // console.log(rectangle.width,rectangle.height);
        
        // image.clipTo = function (ctx) {
        //   var x = rectangle.left - image.getWidth() / 2;
        //   var y = rectangle.top - image.getHeight() / 2;
        //   ctx.rect(x, y, rectangle.width, rectangle.height);
        // }
        console.log(activeObject);
        // // console.log("crop", activeObject);
        // activeObject.scaleX = 1;
        // activeObject.scaleY = 1;
        // activeObject.clipPath.set('radius', 50);
        // activeObject.set('dirty', true);
        // activeObject.selectable = false;
        // var clipPath = new fabric.Circle({ radius: 100, top: -200, left: -200 });
        var clipPath = new fabric.Rect({ width: image.width/2 , height: image.height * 2, top: -image.height/2,  left: 0 })
        switch(option){
          case 'left':
            var clipPath = new fabric.Rect({ width: -image.width/2 - 1, height: image.height * 2 + 1, top: -image.height/2 - 1,  left: 0 })
            break;

          case 'right':
            clipPath = new fabric.Rect({ width: image.width/2 + 1 , height: image.height * 2 + 1, top: -image.height/2 - 1,  left: 0 })
            break;
          default :
        }

        clipPath.inverted = true
        image.set({
          clipPath : clipPath
        })



        canvas.renderAll();

    }

}

export default Crop;

