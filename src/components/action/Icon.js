import Action from './Action';
import ResizeHelper from '../helper/Resize';
import {convertRGB} from '../helper/ConverRGB'
import { fabric } from 'fabric';
import {iconList} from '../const/consts';
class Icon extends Action {
  constructor(App) {
    super('Icon', App);

    this.disableObj = null;
  }

  addIcon = (options) => {
    let canvas = this.getCanvas();
    let icon = this._createIcon(iconList[options.type]);
    // console.log(options);
    let canvas_area = document;
    
    canvas.defaultCursor = 'pointer';

    canvas_area.onmousedown = (event) => {
      if(event.target.tagName === 'CANVAS'){
        this._addIcon(canvas, icon, options, event);
      }
      canvas.defaultCursor = 'default';
      canvas_area.onmousedown = null;
    }

    // canvas.on('mouse:down', (event) => { 
    //     this._addIcon(canvas, icon, options, event);

    //     let lastPos = canvas.__eventListeners["mouse:down"].length - 1;
    //     canvas.off('mouse:down',canvas.__eventListeners["mouse:down"][lastPos]);
    // });
    // this.loadIcon();
  }

  _addIcon = (canvas, icon, options, event) => {
    const pointer = canvas.getPointer(event, false);
    this.removeKeyDownEvent();
    this.disableObj = this.getActiveObject();
    if(this.disableObj){
      // disableObj.evented = false;
      this.disableObj.lockMovementY = true;
      this.disableObj.lockMovementX = true;
    }

    icon.set(({
        fill : convertRGB(options.color),
        // type : 'icon', // if type is modified, Cannot read property 'fromObject' of undefined
        // left : event.pointer.x, // canvas 이벤트용
        // top : event.pointer.y, // canvas 이벤트용
        left : pointer.x,
        top : pointer.y,
        originX : 'left',
        originY : 'top',
        scaleX : 0,
        scaleY : 0,
        isRegular : false,
        cornerStrokeColor : "grey",
        borderColor : "grey"
    }))
    canvas.add(icon).setActiveObject(icon);
    canvas.selection = false;
    canvas.on('mouse:move', this._iconCreateResizeEvent);

    canvas.on('mouse:up', this._iconCreateEndEvent);
  }


  loadSvgIcon = () => {
    // fabric.loadSVGFromURL(img, (objects, options) => {
    //   var shape = fabric.util.groupSVGElements(objects, options);
      
    // })
  }

  _iconCreateEndEvent = (event) => {
    let canvas = this.getCanvas();
    canvas.off('mouse:move', this._iconCreateResizeEvent);
    canvas.selection = true;

    ResizeHelper.adjustOriginToCenter(this.getActiveObject())

    if(this.disableObj){
      this.disableObj.lockMovementY = false;
      this.disableObj.lockMovementX = false;
      this.disableObj = null;
    }

    let activeObject = this.getActiveObject();
    if(activeObject.scaleX === 0 || activeObject.scaleY === 0){
      canvas.remove(activeObject);
    }
    else{
      this.saveState('icon add');
    }
    this.addKeyDownEvent();
    canvas.off('mouse:up', this._iconCreateEndEvent);
  }


  _createIcon = (path) => {
      return new fabric.Path(path);
  }

  _iconCreateResizeEvent = (event) => {
    const canvas = this.getCanvas();
    const pointer = canvas.getPointer(event, false);
    let activeObject = this.getActiveObject();
    let width = Math.abs(pointer.x - activeObject.left);
    let height = Math.abs(pointer.y - activeObject.top);

    if (activeObject.isRegular) {
      width = height =  Math.max(width, height);
    }

    activeObject.set({
      scaleX : width / activeObject.width,
      scaleY : height / activeObject.height,
      originX : pointer.x - activeObject.left < 0 ? 'right' : 'left',
      originY : pointer.y - activeObject.top < 0 ? 'bottom' : 'top',
    })
    canvas.renderAll();
  } 
}

export default Icon;

