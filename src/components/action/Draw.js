import Action from './Action';
import { throttle } from 'lodash';
import { fabric } from 'fabric';
import brushList from '../helper/Brush';

class Draw extends Action {
  constructor(App) {
    super('Draw', App);
    //for Polygon
    this.pointer_list = [];
    this.circle_group = [];
    this.lines = [];
    this.pos = { x : 0, y : 0 };
    this.start = false;
    this.brush = [];
  }

  setBrush = () => {
    this.brush = brushList(this.getCanvas());
  }

  getBrush = (type) => {
    return this.brush[type];
  }

  checkBrush = () => {
    for(let i = 0 ; i < this.brush.length ; i++ ) {
      if(this.brush[i].canvas === null || this.brush[i].canvas === undefined){
        return false;
      }
    }
    return true;
  }

  openDrawing = (linewidth) => {
    const canvas = this.getCanvas();
    if(canvas || this.checkBrush()){
      canvas.isDrawingMode = true;
      canvas.freeDrawingCursor = 'crosshair';
      canvas.freeDrawingBrush.width = parseInt(linewidth);
    }
    else{
      alert('Brush Error')
    }
  }

  closeDrawing = () => {
    const canvas = this.getCanvas();
    if(canvas){
      canvas.isDrawingMode = false;
    }
  }

  changeDrawingWidth = (width) => {
    const canvas = this.getCanvas();
    canvas.freeDrawingBrush.width =  width;
  }

  changeDrawingColor = (rgb) => {
    const canvas = this.getCanvas();
    canvas.freeDrawingBrush.color = String(rgb);
    if(canvas.freeDrawingBrush.getPatternSrc){
      canvas.freeDrawingBrush.source = canvas.freeDrawingBrush.getPatternSrc.call(canvas.freeDrawingBrush)
    }
  }

  changeDrawingBrush = (type, color, width) => {
    const canvas = this.getCanvas();
    canvas.freeDrawingBrush = this.getBrush(type);
    canvas.freeDrawingBrush.color = String(color);
    canvas.freeDrawingBrush.width = parseInt(width);
    if(canvas.freeDrawingBrush.getPatternSrc){
      canvas.freeDrawingBrush.source = canvas.freeDrawingBrush.getPatternSrc.call(canvas.freeDrawingBrush)
    }
    // this._canvas.freeDrawingBrush.source = this._canvas.freeDrawingBrush.getPatternSrc.call(this._canvas.freeDrawingBrush)
  }

  _stopEvent = (event) => {
    event.preventDefault();    
    document.removeEventListener("contextmenu",this._stopEvent);
  }
  
  drawPolygonWithClick = () => {
    let canvas = this.getCanvas();
    this.pointer_list.length = 0;
    this.circle_group.length = 0;
    this.lines.length = 0;
    this.start = true;
    canvas.selection = false;
    document.addEventListener("contextmenu",this._stopEvent);
    canvas.on('mouse:down',this.drawPolygonMouseDownEvent);
    canvas.on('mouse:move', this.drawPolygonMouseMoveEvent);

    document.onmousedown = (event) => {
      if(event.target.tagName !== 'CANVAS'){
        this.makePolygon();
      }
      document.onmousedown = null;
    }
  }

  drawPolygonMouseDownEvent = (event) => {
    if(event.e.button === 2) {
      this.makePolygon();
      return ;
    }
    let canvas = this.getCanvas();
    canvas.selection = false;

    const pointer = canvas.getPointer(event, false);
    let p = {
        x : pointer.x,
        y : pointer.y
    }
    this.pointer_list.push(p);

    let cir = new fabric.Circle({
      radius : 3,
      fill : 'black',
      originX : 'center',
      originY : 'center',
      left : p.x,
      top : p.y,
      selectable : false,
      evented : false,
    })
    this.circle_group.push(cir);

    let line = new fabric.Line([ pointer.x, pointer.y, pointer.x, pointer.y], {
      left : pointer.x,
      right :pointer.y,
      strokeWidth : 5,
      stroke : 'black',
      selectable : false,
      evented : false,
    })
    this.lines.push(line);

    canvas.add(cir, line);
  }

  drawPolygonMouseMoveEvent = (event) => {
    if(this.pointer_list.length > 0) {
      let canvas = this.getCanvas();
      const pointer = canvas.getPointer(event.e, false);
      this.lines[this.lines.length - 1].set({
        x2 : pointer.x,
        y2 : pointer.y,
      });
      canvas.renderAll();
    }
  }


  drawPolygonWithDrag = () => {
    let canvas = this.getCanvas();
    this.pointer_list.length = 0;
    this.circle_group.length = 0;
    canvas.on('mouse:down', this.dragPolygonStart);
    
    document.onmousedown = (event) => {
      if(event.target.tagName !== 'CANVAS'){
        this.makePolygon();
      }
      document.onmousedown = null;
    }
  }

  dragPolygonStart = () => {
    let canvas = this.getCanvas();
    this.start = true;
    canvas.selection = false;
    canvas.on("mouse:move", this.draggingPolygon);
    canvas.on('mouse:up', this.dragPolygonEnd);
  }


  //If we uses a function throttle, this.draggingPolygon event is alive after make a Polygon.
  //So, 

  draggingPolygon = throttle((event) => {
    if(!this.start) { return; }
    let canvas = this.getCanvas();
    const pointer = canvas.getPointer(event.e, false);
    let p = {
      x : pointer.x,
      y : pointer.y
    }
    this.pointer_list.push(p);
      
    let cir = new fabric.Circle({
      radius : 3,
      fill : 'black',
      originX : 'center',
      originY : 'center',
      left : p.x,
      top : p.y,
      selectable : false,
      evented : false,
    })
    this.circle_group.push(cir);
    canvas.add(cir);    
  }, 70);


  dragPolygonEnd = () => {
    let canvas = this.getCanvas();

    canvas.selection = true;
    canvas.off('mouse:move', this.draggingPolygon);
    canvas.off('mouse:up', this.dragPolygonEnd);
    canvas.off('mouse:down', this.dragPolygonStart);
    this.makePolygon();

  }

  deleteCircle = () => {
    const canvas = this.getCanvas();
    for(let i = 0; i < this.circle_group.length; i++){
      if(this.circle_group[i].left < this.pos.x) { this.pos.x = this.circle_group[i].left }
      if(this.circle_group[i].top < this.pos.y) { this.pos.y = this.circle_group[i].top }
      
      canvas.remove(this.circle_group[i]);
      
      if(this.lines.length !== 0) {
        canvas.remove(this.lines[i]);
      }
    }
  }

  makePolygon = () => {
    let canvas = this.getCanvas();
    canvas.selection = true;
    canvas.off('mouse:down',this.drawPolygonMouseDownEvent);
    canvas.off('mouse:move', this.drawPolygonMouseMoveEvent);
    document.onmousedown = null;
    // console.log(this.circle_group.length , this.pointer_list.length)
    new Promise((resolve) => { 
      if(this.circle_group.length < 3) {
        alert('small nuber of dots'); 
        this.start = false;
        this.deleteCircle();
        return; 
      }

  
      this.pos.x = this.circle_group[0].left;
      this.pos.y = this.circle_group[0].top;
  
      this.deleteCircle();

      let polygon = new fabric.Polygon(this.pointer_list.slice(), {   // because of pointer address,
        left: this.pos.x,
        top: this.pos.y,
        originX : 'left',
        originY : 'top',
        stroke : 'black',
        storkeWidth : 0,
        objectCaching : false,
        noScaleCache: false
      })
      polygon.set({
        left : this.pos.x + polygon.width/2 ,
        top : this.pos.y + polygon.height/2,
        originX : 'center',
        originY : 'center',
      })
      canvas.add(polygon);
      resolve();
    })
    .then(() => {
      this.getImageEditor().saveState('polygon add');
      canvas.renderAll();
      this.start = false;
      this.lines.length = 0;
      this.circle_group.length = 0;
      this.pointer_list.length = 0;
    })
  }
}
export default Draw;
  