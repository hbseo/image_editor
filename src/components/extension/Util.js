import Extension from './Extension';
import { fabric } from 'fabric';
import {convertRGB} from '../helper/ConverRGB'
class Util extends Extension {
  constructor(App) {
    super('Util', App);
  }

  newCanvas = () => {
    let url = "https://images.unsplash.com/photo-1547586696-ea22b4d4235d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=100"
    // console.log(url);
    // this._canvas.clear();
    // this._canvas.dispose();
    new Promise(resolve => {
      fabric.Image.fromURL(url, img => {
        img.set({
          originX : "left",
          originY : "top"
				});
				img.on('scaling', () => {

        })
        resolve(img);
      }, { crossOrigin: 'Anonymous' }
      );
    })
    .then((img) => {
      console.log(img);
      return new fabric.Canvas('canvas', {
        preserveObjectStacking: true,
        height: img.height,
        width: img.width,
        backgroundImage: img,
        backgroundColor: 'grey'
      });
    })
  }

  changeBackgroundColor = (color) => {
    const canvas = this.getCanvas();
    if(canvas){
      canvas.backgroundColor = convertRGB(color);
      this.saveState('change backgroundColor');
      canvas.renderAll();
    }
  }

  printObject = () => {
    const canvas = this.getCanvas();
    let first = canvas._objects.map(
        x => Object.entries(x)
    );
    let objstack = [];
    for (let i = 0; i < canvas._objects.length; i++) {
        if(first[i][0][0] === "filters"){
          objstack[i] = 'img';
        }
        else if(first[i][0][0] === "styles"){
            objstack[i] = 'text';
        }
        else if(first[i][0][0] === "width"){
            objstack[i] = 'shape';
        }
    }
    console.log(objstack);
  }

  
  convertSvg = () => {
    let img = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Font_Awesome_5_solid_cloud.svg/512px-Font_Awesome_5_solid_cloud.svg.png";
    fabric.loadSVGFromURL(img, (objects, options) => {
      var shape = fabric.util.groupSVGElements(objects, options);
      console.log(shape.toSVG());
    })
  }

  convertObjSvg = () => {
    if(this.getActiveObject()){
      console.log(this.getActiveObject().toSVG());
    }
  }

  
  convertObjScale = () => {
    if(this.getActiveObject()){
      let obj = this.getActiveObject();
      obj.set({
        width : obj.width * obj.scaleX,
        height : obj.height * obj.scaleY,
        scaleY : 1,
        scaleX : 1,
      })
    }
  }
}
  
export default Util;