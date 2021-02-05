import Action from './Action';
import { fabric } from 'fabric';

class Crop extends Action {
  constructor(App) {
    super('Crop', App);
    this._cropzone = null;

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
    this.offCanvasMove();
    this.offCanvasZoom();
    this.deleteEvent();
    canvas.renderAll();
  }

  cropCanvasEvent = (event) => {
    if(event.target === null || event.target.type !== 'Cropzone') {
      this.removeCropzone();
    }
  }

  cropCanvas = () => {
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
    canvas.on('mouse:down', this.cropCanvasEvent);
  }

  cropEndCanvas = () => {
    if(this._cropzone === null) {
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
    canvas.setHeight(cropRect.height);
    canvas.setWidth(cropRect.width);
    canvas.calcOffset();
    canvas.renderAll();
    canvas.on('mouse:down', this.cropCanvasEvent);
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
  }
}

export default Crop;