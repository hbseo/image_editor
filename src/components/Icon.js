import Action from './Action';
import { fabric } from 'fabric';

//from tui.image.editor
const iconList = {
    arrow: 'M 0 90 H 105 V 120 L 160 60 L 105 0 V 30 H 0 Z',
    cancel: 'M 0 30 L 30 60 L 0 90 L 30 120 L 60 90 L 90 120 L 120 90 ' +
            'L 90 60 L 120 30 L 90 0 L 60 30 L 30 0 Z',
    thunder :'M795 2528 c-3 -18 -46 -301 -95 -628 -49 -327 -92 -610 -95 -627 l-6 -33 180 -2 179 -3 -214 -604 c-118 -332 -212 -606 -210 -608 2 -2 341 360 753 804 l749 808 -277 5 -277 5 157 400 c86 220 166 426 178 458 l22 57 -519 0 -519 0 -6 -32z',
    icon_arrow : 'M40 12V0l24 24-24 24V36H0V12h40z',
    icon_arrow_2: 'M49,32 H3 V22 h46 l-18,-18 h12 l23,23 L43,50 h-12 l18,-18  z ',
    icon_arrow_3: 'M43.349998,27 L17.354,53 H1.949999 l25.996,-26 L1.949999,1 h15.404 L43.349998,27  z ',
    icon_star: 'M35,54.557999 l-19.912001,10.468 l3.804,-22.172001 l-16.108,-15.7 l22.26,-3.236 L35,3.746 l9.956,20.172001 l22.26,3.236 l-16.108,15.7 l3.804,22.172001  z ',
    icon_star_2: 'M17,31.212 l-7.194,4.08 l-4.728,-6.83 l-8.234,0.524 l-1.328,-8.226 l-7.644,-3.14 l2.338,-7.992 l-5.54,-6.18 l5.54,-6.176 l-2.338,-7.994 l7.644,-3.138 l1.328,-8.226 l8.234,0.522 l4.728,-6.83 L17,-24.312 l7.194,-4.08 l4.728,6.83 l8.234,-0.522 l1.328,8.226 l7.644,3.14 l-2.338,7.992 l5.54,6.178 l-5.54,6.178 l2.338,7.992 l-7.644,3.14 l-1.328,8.226 l-8.234,-0.524 l-4.728,6.83  z ',
    icon_polygon: 'M3,31 L19,3 h32 l16,28 l-16,28 H19  z ',
    icon_location: 'M24 62C8 45.503 0 32.837 0 24 0 10.745 10.745 0 24 0s24 10.745 24 24c0 8.837-8 21.503-24 38zm0-28c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10z',
    icon_heart: 'M49.994999,91.349998 l-6.96,-6.333 C18.324001,62.606995 2.01,47.829002 2.01,29.690998 C2.01,14.912998 13.619999,3.299999 28.401001,3.299999 c8.349,0 16.362,5.859 21.594,12 c5.229,-6.141 13.242001,-12 21.591,-12 c14.778,0 26.390999,11.61 26.390999,26.390999 c0,18.138 -16.314001,32.916 -41.025002,55.374001 l-6.96,6.285  z ',
    icon_bubble: 'M44 48L34 58V48H12C5.373 48 0 42.627 0 36V12C0 5.373 5.373 0 12 0h40c6.627 0 12 5.373 12 12v24c0 6.627-5.373 12-12 12h-8z',
    icon_cloud : 'M25,60 a 20,20 1 0,0 0,40 h 50 a 20,20 1 0,0 0,-40 a 10,10 1 0,0 -15,-10 a 15,15 1 0,0 -35,10  z',
  
  }
class Icon extends Action {
  constructor(App) {
    super('Icon', App);
  }

  addIcon = (options) => {
    let canvas = this.getCanvas();
    let icon = this._createIcon(iconList[options.type]);
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

    const disableObj = this.getActiveObject();
    if(disableObj){
      // disableObj.evented = false;
      disableObj.lockMovementY = true;
      disableObj.lockMovementX = true;
    }

    icon.set(({
        fill : `rgba(${ options.color.r }, ${ options.color.g }, ${ options.color.b }, ${ options.color.a })`,
        // type : 'icon', // if type is modified, Cannot read property 'fromObject' of undefined
        // left : event.pointer.x, // canvas 이벤트용
        // top : event.pointer.y, // canvas 이벤트용
        left : pointer.x,
        top : pointer.y,
        originX : 'left',
        originY : 'top'
    }))
    canvas.add(icon).setActiveObject(icon);
    canvas.selection = false;
    canvas.on('mouse:move', this._iconCreateResizeEvent);

    canvas.on('mouse:up', (event) => {
      canvas.off('mouse:move', this._iconCreateResizeEvent);
      canvas.selection = true;

      this.adjustOriginToCenter(this.getActiveObject());

      if(disableObj){
        disableObj.lockMovementY = false;
        disableObj.lockMovementX = false;
      }

      canvas.off('mouse:up');

      
    })
  }


  loadSvgIcon = () => {
    // fabric.loadSVGFromURL(img, (objects, options) => {
    //   var shape = fabric.util.groupSVGElements(objects, options);
      
    // })
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

    activeObject.set({
      scaleX : width / activeObject.width,
      scaleY : height / activeObject.height,
      originX : pointer.x - activeObject.left < 0 ? 'right' : 'left',
      originY : pointer.y - activeObject.top < 0 ? 'bottom' : 'top',
    })
    canvas.renderAll();
  } 

  // clone from tui.image.editor
  adjustOriginToCenter = (shape) => {
    const centerPoint = shape.getPointByOrigin('center', 'center');
    const {originX, originY} = shape;
    const origin = shape.getPointByOrigin(originX, originY);
    const left = shape.left + (centerPoint.x - origin.x);
    const top = shape.top + (centerPoint.y - origin.y);

    shape.set({
        hasControls: true,
        hasBorders: true,
        originX: 'center',
        originY: 'center',
        left,
        top
    });
    shape.setCoords(); // For left, top properties
  }



}

export default Icon;

