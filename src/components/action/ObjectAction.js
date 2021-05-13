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
      if(obj.type === "path") {
        if(obj.fill === null) this.saveState('set shadow drawing');
        else this.saveState('set shadow path')
      }
      else if(obj.type === "group") this.saveState('set shadow drawing');
      else this.saveState('set shadow ' + obj.type);
    }
    canvas.renderAll();
  }

  removeShadow = () => {
    const canvas = this.getCanvas();
    let obj = this.getActiveObject();
    if(obj){
      obj.set('shadow', null);
      if(obj.type === "path") {
        if(obj.fill === null) this.saveState('remove shadow draw');
        else this.saveState('remove shadow path')
      }
      else if(obj.type === "group") this.saveState('remove shadow draw');
      else this.saveState('remove shadow ' + obj.type);
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

  scaleXChange = (value) => {
    if(this.getActiveObject()){
      this.getActiveObject().scaleX = value / 100 ;
      if(this.getLockScale()){
        this.getActiveObject().scaleY = value / 100 ;
      }
      this.updateObject();
      this.getCanvas().renderAll();
    }
  }

  scaleYChange = (value) => {
    if(this.getActiveObject()){
      this.getActiveObject().scaleY = value / 100;
      if(this.getLockScale()){
        this.getActiveObject().scaleX = value / 100 ;
      }
      this.updateObject();
      this.getCanvas().renderAll();
    }
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

  // from https://jsfiddle.net/milanhlinak/4fofjzvm/
  moveSelected = (direction) => {
    const canvas = this.getCanvas();
    const STEP = 10;
    var activeObject = canvas.getActiveObject();

  
    if (activeObject) {
      switch (direction) {
        case 'left':
          activeObject.left = (activeObject.left - STEP);
          break;
        case 'up':
          activeObject.top = (activeObject.top - STEP);
          break;
        case 'right':
          activeObject.left = (activeObject.left+ STEP);
          break;
        case 'down':
          activeObject.top = (activeObject.top + STEP);
          break;
        default :
          break;
      }
      activeObject.setCoords();
      canvas.renderAll();

      if(activeObject.type === "path") {
        if(activeObject.fill === null) this.saveState('drawing moved using a keyboard');
        else this.saveState('icon moved using a keyboard');
      }
      else if(activeObject.type === "group") this.saveState('drawing moved using a keyboard');
      else this.saveState(activeObject.type + ' moved using a keyboard');
    }   
  }
}

export default ObjectAction;