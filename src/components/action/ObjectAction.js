import Action from './Action';
import { fabric } from 'fabric';

class ObjectAction extends Action {
  constructor(App) {
    super('Object', App);
  }

  setShadow = (option) => {
    let obj = this.getActiveObject();
    const canvas = this.getCanvas();
    if(obj){
      // obj.set('shadow', new fabric.Shadow( {color:'black', blur:30, offsetX:10, offsetY:10, opacity:0}));
      obj.set('shadow', new fabric.Shadow( {color: option.color , blur : option.blur, offsetX : option.offsetX, offsetY : option.offsetY, opacity : option.opacity}));
    }
    canvas.renderAll();
  }

  removeShadow = () => {
    const canvas = this.getCanvas();
    let obj = this.getActiveObject();
    if(obj){
      obj.set('shadow', null);
      canvas.renderAll();
    }
  }

  setStroke = (obj, options) => {
    const canvas = this.getCanvas();
    obj.set({
        stroke : options.strokeColor|| null,
        strokeWidth : options.strokeWidth || null
    })
    if(options.strokeWidth === 0){
        obj.set({stroke : null});
    }
    canvas.renderAll();
  }
}

export default ObjectAction;