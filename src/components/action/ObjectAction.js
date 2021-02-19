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

  makeGroup = () => {
    const canvas = this.getCanvas();
    if(this.getActiveObject() && this.getActiveObject().type === 'activeSelection' && canvas){
      canvas.getActiveObject().toGroup();
      this.updateObject();
      canvas.renderAll();
      this.saveState('makeGroup')
    }
  }

  unGroup = () => {
    const canvas = this.getCanvas();
    if(this.getActiveObject() && this.getActiveObject().type === 'group' && canvas){
      canvas.getActiveObject().toActiveSelection();
      this.updateObject();
      canvas.renderAll();
      this.saveState('unGroup')
    }
  }

  sendBackwards = () => {
    const canvas = this.getCanvas();
    if(this.getActiveObject() && canvas){
      canvas.sendBackwards(this.getActiveObject())
      if(this.getGridOn()){ canvas.sendToBack(this.getGrid()) }
      canvas.renderAll();
      this.saveState('sendBackwards');
    }
  }

  sendToBack = () => {
    const canvas = this.getCanvas();
    if(this.getActiveObject() && canvas){
      canvas.sendToBack(this.getActiveObject() )
      if(this.getGridOn()){ canvas.sendToBack(this.getGrid()) }
      canvas.renderAll();
      this.saveState('sendToBack');
    }
  }

  bringForward = () => {
    const canvas = this.getCanvas();
    if(this.getActiveObject() && canvas){
      canvas.bringForward(this.getActiveObject())
      canvas.renderAll();
      this.saveState('bringForward');
    }
  }

  bringToFront = () => {
    const canvas = this.getCanvas();
    if(this.getActiveObject() && canvas){
      canvas.bringToFront(this.getActiveObject())
      canvas.renderAll();
      this.saveState('bringToFront');
    }
  }

}

export default ObjectAction;