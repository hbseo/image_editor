import Action from './Action';
import { fabric } from 'fabric';

class Crop extends Action {
  constructor(App) {
    super('Crop', App);
    this._cropzone = null;
    this._cropImage = null;

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
              'hasControls' : true
          });
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

  cropObj = (activeObject, option) => {
    let canvas = this.getCanvas();

    let image = activeObject;
    // this._cropzone = image;
    this._cropzone = new fabric.Cropzone(
      {label: 'cropObj',
       top: image.top, 
       left: image.left, 
       height: image.height + image.strokeWidth, 
       width:image.width + image.strokeWidth,
       scaleX : image.scaleX,
       scaleY : image.scaleY,
       angle : image.angle,
    })
    canvas.add(this._cropzone);
    canvas.renderAll();
    this.addEvent();
    canvas.setActiveObject(this._cropzone);
    canvas.requestRenderAll();
  }

  cropObjend = (activeObject, cropOption) => {
    let canvas = this.getCanvas();
    let image = activeObject;
    let test_canvas = new fabric.Canvas('test', {
      preserveObjectStacking: true,
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
    // console.log(test_canvas._objects[1]);
    // var a = document.createElement("a");
    // a.href = test_canvas.toDataURL();
    // a.setAttribute("download", 'image.png');
    // a.click();
    let cropRect = {
      left : test_canvas._objects[1].oCoords.tl.x,
      top : test_canvas._objects[1].oCoords.tl.y,
      height : this._cropzone.height * this._cropzone.scaleY,
      width : this._cropzone.width * this._cropzone.scaleX,
    }
    const imageData = {
      imageName: "test",
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
    this.deleteEvent();
    canvas.renderAll();
  }

  cropCanvas = () => {
    let canvas = this.getCanvas();
    this._cropzone = new fabric.Cropzone({
      label: 'cropCanvas',
      top: canvas.height/2,
      left: canvas.width/2,
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
    canvas.add(this._cropzone);
    this.addEvent();
    canvas.setActiveObject(this._cropzone);
    canvas.requestRenderAll();
  }

  cropEndCanvas = () => {
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
    canvas.setHeight(cropRect.height);
    canvas.setWidth(cropRect.width);
    canvas.calcOffset();
    canvas.renderAll();
  }

  fillOuterBox = () => {
    let canvas = this.getCanvas();
    // const xy = {
    //   left : this._cropzone.left,
    //   top : this._cropzone.top,
    //   height : this._cropzone.height * this._cropzone.scaleY,
    //   width : this._cropzone.width * this._cropzone.scaleX,
    // }
    // console.log(xy)
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



      // //inner
      // ctx.moveTo(xy.left , xy.top);
      // ctx.lineTo(xy.left, xy.top + xy.height);
      // ctx.lineTo(xy.left + xy.width, xy.top + xy.height);
      // ctx.lineTo(xy.left + xy.width, xy.top);
      // ctx.lineTo(xy.left , xy.top);
      // ctx.closePath();

      //inner
      ctx.moveTo(this._cropzone.aCoords.tl.x , this._cropzone.aCoords.tl.y);
      ctx.lineTo(this._cropzone.aCoords.bl.x , this._cropzone.aCoords.bl.y);
      ctx.lineTo(this._cropzone.aCoords.br.x , this._cropzone.aCoords.br.y);
      ctx.lineTo(this._cropzone.aCoords.tr.x , this._cropzone.aCoords.tr.y);
      ctx.moveTo(this._cropzone.aCoords.tl.x , this._cropzone.aCoords.tl.y);
      ctx.closePath();



      ctx.fill();
      ctx.restore();


      // console.log(ctx);
    }
  }


  addEvent = () => {
    const canvas = this.getCanvas();
    this.fillOuterBox();
    // canvas.on('object:moving', (event) => {
      
    //   console.log("move");    
    //   this.fillOuterBox();

    // });

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