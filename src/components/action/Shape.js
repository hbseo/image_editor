import Action from './Action';
import ResizeHelper from '../helper/Resize';
import {convertRGB} from '../helper/ConverRGB'
import { fabric } from 'fabric';
class Shape extends Action {
  constructor(App) {
    super('Shape', App);
    this.shapeType = null;
    this.disableObj = null;
    this.color = null;
  }

  setEndAngle = (value) => {
    if(this.getActiveObject()){
      if(value > 360) { value = 360; }
      if(value < 0) { value = 0; }
      let shape = this.getActiveObject();
      shape.set({
        endAngle : value * Math.PI / 180,
      })
      this.updateObject();
      this.getCanvas().renderAll();
    }
  }

  setStroke = (option) => {
    if(this.getActiveObject()) {
      let shape = this.getActiveObject();
      shape.set({
        stroke: option.width === 0 ? null : option.color,
        strokeWidth: option.width,
        noScaleCache: true,
        strokeUniform: true,
      })
      this.updateObject();
      this.getCanvas().renderAll();
      if(shape.type === "path") {
        if(shape.fill === null) this.saveState('Stroke set draw');
        else this.saveState('Stroke set path')
      }
      else if(shape.type === "group") this.saveState('Stroke set draw');
      else this.saveState('Stroke set ' + shape.type);
    }
  }

  setStrokeColor = (color) => {
    const activeObject = this.getActiveObject();
    const canvas = this.getCanvas();
    if(activeObject) {
      activeObject.set({
        stroke: convertRGB(color)
      })
      let shape = activeObject;
      if(shape.type === "path") {
        if(shape.fill === null) this.saveState('Stroke color change draw');
        else this.saveState('Stroke color change path')
      }
      else if(shape.type === "group") this.saveState('Stroke color change draw');
      else this.saveState('Stroke color change ' + shape.type);
      canvas.renderAll();
    }
  }

  _bindShapeEvent = (shape) => {
      const canvas = this.getCanvas();
      shape.on({
        scaling(event){
          ResizeHelper.resize(canvas, event, this);
        },
      })
    }

  addShape = (shapeType, color) => {
    const canvas = this.getCanvas();
    canvas.defaultCursor = 'pointer';
    canvas.discardActiveObject();
    this.shapeType = shapeType;
    this.color = convertRGB(color);
    document.addEventListener('mousedown',this.addShapeEvent);    
    // document.addEventListener('keydown',this._onShiftKeydownEvent);
  }

  addShapeEvent = (event) => {
    const canvas = this.getCanvas();
    let myFigure;
    if(event.target.tagName === 'CANVAS'){
      this.removeKeyDownEvent();
      this.disableObj = this.getActiveObject();
      
      if(this.disableObj){
        this.disableObj.lockMovementY = true;
        this.disableObj.lockMovementX = true;
      }
      
      const pointer = canvas.getPointer(event, false)
      switch(this.shapeType) {
        case 'triangle':
          myFigure = new fabric.Triangle({ width: 0, height: 0, left: pointer.x, top: pointer.y, fill: this.color,  originX : "left", originY:"top", strokeWidth : 0, noScaleCache: false, isRegular : false, cornerStrokeColor : "grey",borderColor : "grey"});
          canvas.add(myFigure).setActiveObject(myFigure);
          // this._bindShapeEvent(myFigure);
          break;
        case 'rectangle':
          myFigure = new fabric.Rect({ width: 0, height: 0, left: pointer.x, top: pointer.y, fill: this.color, originX : "left", originY:"top", strokeWidth : 0, noScaleCache: false, isRegular : false, cornerStrokeColor : "grey",borderColor : "grey"});
          canvas.add(myFigure).setActiveObject(myFigure);
          // this._bindShapeEvent(myFigure);
          break;
        case 'ellipse':
          myFigure = new fabric.Ellipse({ rx:0, ry:0, left: pointer.x, top: pointer.y, fill: this.color, strokeWidth : 0, isRegular : false, cornerStrokeColor : "grey",borderColor : "grey"});
          canvas.add(myFigure).setActiveObject(myFigure);
          break;
        case 'circle':
          myFigure = new fabric.Circle({ radius : 0, left: pointer.x, top: pointer.y, fill: this.color, originX : "left", originY:"top", strokeWidth : 0, noScaleCache: false, isRegular : false, cornerStrokeColor : "grey",borderColor : "grey"});
          canvas.add(myFigure).setActiveObject(myFigure);
          break;        
        default:
      }

      canvas.selection = false;
      canvas.on('mouse:move', this.shapeCreateResizeEvent);
      canvas.on('mouse:up', this.shapeEndResizeEvent);
    }

    canvas.defaultCursor = 'default';
    document.removeEventListener('mousedown',this.addShapeEvent);
    // document.removeEventListener('keydown',this._onShiftKeydownEvent);
  }



  shapeEndResizeEvent = (event) => {
    const canvas = this.getCanvas();
    
    canvas.off('mouse:move', this.shapeCreateResizeEvent);
    let activeObject = this.getActiveObject();
    // this.adjustOriginToCenter(activeObject);
    ResizeHelper.adjustOriginToCenter(activeObject)

    if(activeObject.width === 0 || activeObject.height === 0){
      canvas.remove(activeObject);
    }
    else{
      this.saveState(activeObject.type + ' add');
    }

    canvas.selection = true;
    canvas.renderAll();
    
    if(this.disableObj){
      this.disableObj.lockMovementY = false;
      this.disableObj.lockMovementX = false;
      this.disableObj = null;
    }
    this.addKeyDownEvent();
    canvas.off('mouse:up', this.shapeEndResizeEvent);
  }

  shapeCreateResizeEvent = (event) => {
    const canvas = this.getCanvas();
    const pointer = canvas.getPointer(event, false)
    let activeObject = this.getActiveObject();
    let width = Math.abs(pointer.x - activeObject.left);
    let height = Math.abs(pointer.y - activeObject.top);

    if (activeObject.isRegular) {
      width = height =  Math.max(width, height);

      if (activeObject.type === 'triangle') {
          height = Math.sqrt(3) / 2 * width;
      }
    }

    if(activeObject.type === 'ellipse'){
      activeObject.set({
        rx : width /2 ,
        ry : height / 2,
        originX : pointer.x - activeObject.left < 0 ? 'right' : 'left',
        originY : pointer.y - activeObject.top < 0 ? 'bottom' : 'top',
      })
    }
    else if(activeObject.type === 'circle'){
      activeObject.set({
        radius : Math.max(width, height) / 2,
        originX : pointer.x - activeObject.left < 0 ? 'right' : 'left',
        originY : pointer.y - activeObject.top < 0 ? 'bottom' : 'top',
      })
    }
    else{
      activeObject.set({
        width : width,
        height :height,
        originX : pointer.x - activeObject.left < 0 ? 'right' : 'left',
        originY : pointer.y - activeObject.top < 0 ? 'bottom' : 'top',
      })
    }
    canvas.renderAll();
  }
}
  
export default Shape;