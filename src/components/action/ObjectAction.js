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
      this.saveState('set shadow')
    }
    canvas.renderAll();
  }

  removeShadow = () => {
    const canvas = this.getCanvas();
    let obj = this.getActiveObject();
    if(obj){
      obj.set('shadow', null);
      this.saveState('remove shadow')
      canvas.renderAll();
    }
  }

  setStroke = (obj, options) => {
    const canvas = this.getCanvas();
    if(obj){
      obj.set({
        stroke : options.strokeColor|| null,
        strokeWidth : options.strokeWidth || null
      })
      if(options.strokeWidth === 0){
          obj.set({stroke : null});
      }
      else{
        this.saveState('set stroke');
      }
      canvas.renderAll();
    }

  }

  lockScaleRatio = () => {
    let obj = this.getActiveObject();
    if(obj){
      obj.set({
        scaleY : Math.max(obj.scaleX, obj.scaleY),
        scaleX : Math.max(obj.scaleX, obj.scaleY)
      })
    }
    this.updateLockScale();
    this.updateObject();
    this.getCanvas().renderAll();
  }
}

export default ObjectAction;