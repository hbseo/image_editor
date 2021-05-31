import Action from './Action';
import { fabric } from 'fabric';
import ResizeHelper from '../helper/Resize';

class Crop extends Action {
  constructor(App) {
    super('Crop', App);
    this.state={width: 0, height: 0};
    this._cropzone = null;
    this.off = null;

    fabric.Cropzone = fabric.util.createClass(fabric.Rect, {
      type: 'Cropzone',
      initialize: function(options) {
          // this.placedColor = 'rgba(211,211,211, 0)';
          this.virtualModeColor = 'rgba(211,211,211, 0)';
          this.setToVirtualMode();
          options || (options = { });
          this.callSuper('initialize', options);
          this.set({
              label : options.label || '',
              'top' : options.top || 0,
              'left':  options.left || 0,
              'height' : options.height || 50,
              'angle' : options.angle || 0,
              'fill' : options.fill || 'this.backgroundColor',
              'borderColor' : 'black',
              'hasControls' : true,
              'strokeWidth' : 0,
              'hasRotatingPoint' : false
          });
          this.setControlsVisibility({
            mtr : false,
          })
      },
  
      /**
       *@description set render mode to virtual
       */
      setToVirtualMode : function () {
          this.isInVirtualMode = true;
          this.backgroundColor = this.virtualModeColor;
      },
      _render: function(ctx) {
          this.callSuper('_render', ctx);
      }
    });

  }

  cropzoneOption = (image, option) => {
    let height = (image.height + image.strokeWidth);
    let width = (image.width + image.strokeWidth);
    switch(option){
      case "4:3":
        width = (image.width + image.strokeWidth) *  (3/4);
        break;
      case "3:2":
        width = (image.width + image.strokeWidth) *  (2/3);
        break;
      case "16:9":
        height = (image.height + image.strokeWidth) *  (9/16);
        break;
      default :
    }

    return {label: 'cropObj',
      top: image.top, 
      left: image.left, 
      height: height, 
      width: width,
      scaleX : image.scaleX,
      scaleY : image.scaleY,
      angle : image.angle,
   };
  }

  cropObj = (activeObject, option) => {
    let canvas = this.getCanvas();
    let image = activeObject;
    if(this._cropzone){
      canvas.remove(this._cropzone);
    }
    this._cropzone = new fabric.Cropzone(this.cropzoneOption(image, option));
    canvas.add(this._cropzone);
    this.addEvent();
    canvas.setActiveObject(this._cropzone);
    canvas.renderAll();
    canvas.requestRenderAll();
  }

  cropObjstop = () => {
    let canvas = this.getCanvas();
    canvas.remove(this._cropzone);
    this._cropzone = null;
    this.deleteEvent();
    canvas.renderAll();
  }

  cropObjend = (activeObject) => {
    let canvas = this.getCanvas();
    let image = activeObject;
    let test_canvas = new fabric.Canvas('test', {
      preserveObjectStacking: true,
      imageSmoothingEnabled : false,
    });
    const filters = image.filters;
    const angle = image.angle;
    const left = this._cropzone.left;
    const top = this._cropzone.top;
    image.filters = [];
    image.applyFilters();
    let group = new fabric.Group([image, this._cropzone], {
      angle : -angle,
    });
    group._restoreObjectsState();
    test_canvas.add(group.item(0));
    test_canvas.add(group.item(1));

    let cropRect = {
      left : test_canvas._objects[1].oCoords.tl.x,
      top : test_canvas._objects[1].oCoords.tl.y,
      height : this._cropzone.height * this._cropzone.scaleY,
      width : this._cropzone.width * this._cropzone.scaleX,
    }
    const imageData = {
      imageName: "crop",
      url: test_canvas.toDataURL(cropRect)
    };
    test_canvas.clear();
    test_canvas.dispose();
    new Promise(resolve => {
      fabric.Image.fromURL(imageData.url, img => {
        img.set({
          angle : angle,
          left : left,
          top : top,
          height : this._cropzone.height* this._cropzone.scaleY,
          width : this._cropzone.width* this._cropzone.scaleX,
          filters : filters,
        });
        resolve(img);
      }, { crossOrigin: 'Anonymous' }
      );
    })
    .then((data) => {
      canvas.remove(activeObject);
      canvas.remove(this._cropzone);
      this._cropzone = null;
      this.deleteEvent();
      this.saveState("image crop")
      data.applyFilters();
      canvas.add(data);
    })
    .then(() => {
      canvas.renderAll();
    })
  }

  resizeCropzone = (value) => {
    value.width = parseInt(value.width);
    value.height = parseInt(value.height);
    let canvas = this.getCanvas();
    this._cropzone.width = value.width;
    this._cropzone.height = value.height;
    canvas.renderAll();
  }

  removeCropzone = () => {
    let canvas = this.getCanvas();
    canvas.remove(this._cropzone);
    this._cropzone = null;
    this.offCanvasMove();
    this.offCanvasZoom();
    this.deleteEvent();
    canvas.renderAll();
  }

  cropCanvasEvent = (event) => {
    if(event.target === null || event.target.type !== 'Cropzone') {
      this.removeCropzone();
      this.off();
    }
  }

  movingCropzone = (event) => {
    // let obj = event.target;
    // 나중에
    // obj.setCoords();
    // // 만약 cropzone이 회전이 불가능 하다면, max, min 하지 않아도 괜찮
    // let obj_top = Math.min(obj.oCoords.tl.y, obj.oCoords.tr.y, obj.oCoords.br.y, obj.oCoords.bl.y) ;
    // let obj_bottom = Math.max(obj.oCoords.tl.y, obj.oCoords.tr.y, obj.oCoords.br.y, obj.oCoords.bl.y);
    // let obj_right = Math.max(obj.oCoords.tl.x, obj.oCoords.tr.x, obj.oCoords.br.x, obj.oCoords.bl.x);
    // let obj_left = Math.min(obj.oCoords.tl.x, obj.oCoords.tr.x, obj.oCoords.br.x, obj.oCoords.bl.x)
    // if(obj_top  < 0){ 
    //   obj.set({
    //     top : (-this.state.canvasView.y / this.state.zoom) + (Math.abs(obj.aCoords.tl.y - obj.aCoords.bl.y)/2)
    //   })}
    // if(obj_left < 0){
    //   obj.set({
    //     left :  (-this.state.canvasView.x / this.state.zoom) + (Math.abs(obj.aCoords.br.x - obj.aCoords.bl.x)/2)
    //   })}
    // if(obj_bottom > this._canvas.height ){
    //   obj.set({
    //     top : ( (-this.state.canvasView.y / this.state.zoom)  + (this._canvas.height / this.state.zoom) - (Math.abs(obj.aCoords.tl.y - obj.aCoords.bl.y)/2))
    //   })
    // }
    // if(obj_right > this._canvas.width ) {
    //   obj.set({
    //     left: ( (-this.state.canvasView.x / this.state.zoom)  + (this._canvas.width / this.state.zoom) - (Math.abs(obj.aCoords.br.x - obj.aCoords.bl.x)/2))
    //   })
    // }
    // obj.setCoords();
  }

  cropCanvas = (off) => {
    let obj = this.getActiveObject();
    if(obj && obj.type === 'Cropzone') {
      return;
    }
    let canvas = this.getCanvas();
    let vpt = canvas.viewportTransform;
    
    this._cropzone = new fabric.Cropzone({
      label: 'cropCanvas',
      top: (canvas.height / canvas.getZoom()) / 2 - (vpt[5] / canvas.getZoom()),
      left: (canvas.width / canvas.getZoom()) / 2 - (vpt[4] / canvas.getZoom()),
      height: canvas.height/2,
      width: canvas.width/2,
      borderColor: 'white',
      cornerColor: 'white',
      cornerSize: 12,
      transparentCorners: false
    });
    this._cropzone.setControlsVisibility({
      mtr:false
    });
    this.resetCanvas();
    this.offCanvasMove();
    this.offCanvasZoom();

    canvas.add(this._cropzone);
    this.addEvent();
    canvas.setActiveObject(this._cropzone);
    canvas.requestRenderAll();

    this.off = off;
    canvas.on('object:moving', this.movingCropzone);
    canvas.on('mouse:down', this.cropCanvasEvent);
  }

  cropEndCanvas = (img) => {
    if(this._cropzone === null || this.getCanvas() === null) {
      return;
    }
    let canvas = this.getCanvas();
    canvas.remove(this._cropzone);
    let cropRect = {
      left : this._cropzone.oCoords.tl.x,
      top : this._cropzone.oCoords.tl.y,
      height : this._cropzone.height * this._cropzone.scaleY,
      width : this._cropzone.width * this._cropzone.scaleX
    }
    let objects = canvas.getObjects();
    objects.forEach(element => {
      element.top = element.top - cropRect.top;
      element.left = element.left - cropRect.left;
      element.setCoords();
    });
    if(canvas.backgroundImage) {
      canvas.backgroundImage.top = canvas.backgroundImage.top - cropRect.top;
      canvas.backgroundImage.left = canvas.backgroundImage.left - cropRect.left;
    }
    this.deleteEvent();
    this.saveState('canvas crop');
    this._cropzone = null;
    canvas.setHeight(cropRect.height);
    canvas.setWidth(cropRect.width);
    canvas.calcOffset();

    if(img && canvas.backgroundImage) {
      canvas.backgroundImage.left = canvas.width / 2;
      canvas.backgroundImage.top = canvas.height / 2;;
      canvas.backgroundImage.scaleX = canvas.width / canvas.backgroundImage.width;
      canvas.backgroundImage.scaleY = canvas.height / canvas.backgroundImage.height;
      ResizeHelper.adjustBackgroundImage(canvas.backgroundImage)
    }

    canvas.renderAll();
  }

  cropStopCanvas = () => {
    console.log('stop')
    if(this._cropzone === null || this.getCanvas() === null) {
      return;
    }
    let canvas = this.getCanvas();
    canvas.remove(this._cropzone);
    this.deleteEvent();
    this._cropzone = null;
    canvas.renderAll();
  }


  fillOuterBox = () => {
    let canvas = this.getCanvas();

    if (canvas.getContext) {
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = 'rgb(0,0,0,0.8)';

      ctx.save();
      
      // outer
      ctx.beginPath();

      ctx.moveTo(0 , 0);
      ctx.lineTo(canvas.width, 0);
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.lineTo(0 , 0);
      ctx.closePath();

      //inner
      ctx.moveTo(this._cropzone.oCoords.tl.x , this._cropzone.oCoords.tl.y);
      ctx.lineTo(this._cropzone.oCoords.bl.x , this._cropzone.oCoords.bl.y);
      ctx.lineTo(this._cropzone.oCoords.br.x , this._cropzone.oCoords.br.y);
      ctx.lineTo(this._cropzone.oCoords.tr.x , this._cropzone.oCoords.tr.y);
      ctx.moveTo(this._cropzone.oCoords.tl.x , this._cropzone.oCoords.tl.y);
      ctx.closePath();

      ctx.fill();
      ctx.restore();

    }
  }


  addEvent = () => {
    const canvas = this.getCanvas();
    this.fillOuterBox();

    canvas.on('after:render', (event) => {
      this.fillOuterBox();

    });

  }
  deleteEvent = () => {
    const canvas = this.getCanvas();
    canvas.off('after:render');
    canvas.off('mouse:down', this.cropCanvasEvent);
    canvas.off('object:moving', this.movingCropzone);
  }


  setCropCanvasSize = (cropCanvasSize, option, value, object) => {
    let change_state = {
      width: cropCanvasSize.width,
      height: cropCanvasSize.height
    };
    const canvas = this.getCanvas();

    if (option === 'width') {
      if (object.left - value / 2 < 0 ||
        object.left + value / 2 > canvas.width) {
        if (object.left < value / 2) {
          object.left = value / 2;
        }
        else {
          object.left = canvas.width - value / 2;
        }
        if (value > canvas.width) {
          object.left = canvas.width / 2;
          change_state.width = canvas.width;
        }
        else {
          change_state.width = value;
        }
      }
      else {
        change_state[option] = value;
      }
    }
    else {
      if (object.top - value / 2 < 0 ||
        object.top + value / 2 > canvas.height) {
        if (object.top < value / 2) {
          object.top = value / 2;
        }
        else {
          object.top = canvas.height - value / 2;
        }
        if (value > canvas.height) {
          object.top = canvas.height / 2;
          change_state.height = canvas.height;
        }
        else {
          change_state.height = value;
        }
      }
      else {
        change_state[option] = value;
      }
    }
    return change_state
  }
}

export default Crop;