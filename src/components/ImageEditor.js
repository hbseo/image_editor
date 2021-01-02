import React, { Component } from 'react';
import { fabric } from 'fabric';
import { SketchPicker, CompactPicker } from 'react-color';
import Switch from 'react-switch';
import './ImageEditor.css'
import Rotation from './action/Rotation';
import Filter from './action/Filter';
import Delete from './action/Delete';
import Shape from './action/Shape';
import Crop from './action/Crop';
import Flip from './action/Flip';
import Text from './action/Text';
import Fill from './action/Fill';
import Icon from './action/Icon';
import Line from './action/Line';
import Draw from './action/Draw';
import Grid from './extension/Grid';
import Snap from './extension/Snap';
import Layers from './extension/Layers';
import ResizeHelper from './helper/Resize';

class ImageEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showRoot : false,
      fontsize: 50, //active object's fontSize
      canvasView : { x: 0, y: 0},
      layers: [],
      displayColorPicker: false,
      displayCropCanvasSize: false,
      displayTextbgColorPicker: false,
      displayshadow: false,
      drawingMode: false,
      lineWidth: 10,
      lineColorRgb:{
          r: '255',
          g: '255',
          b: '255',
          a: '1',
        },
      activeObject : { type : 'not active', width : 0, height : 0, scaleX : 0, scaleY : 0},
      zoom : 1,
      color: {
        r: '255',
        g: '255',
        b: '255',
        a: '1',
      },
      text : {
        color : '#FFFFFF'
      },
      colorHex : '#000000',
      filters : {
        brightness: 0,
        contrast : 0,
        pixelate : 1,
        blur : 0,
        noise : 0,
        saturation : 0,
        hue : 0,
        ink : 0,
        vignette : 0,
        zoomblur : 0,
      },
      cropCanvasSize : {
        width : 0,
        height : 0
      },
      shadow : {
        blur : 30,
        offsetX : 10,
        offsetY: 10,
        color : '#000000'
      },
      pipetteRGB:{
          r: '0',
          g: '0',
          b: '0',
          a: '1',
      },
    }
    

    this._canvas = null;
    if(!props.location.state) { props.history.push('/'); }
    this._canvasImageUrl = props.location.state ? props.location.state.url : '';
    this._canvasSize = {width : props.location.state? props.location.state.width : 500, height : props.location.state? props.location.state.height : 500}
    this._backgroundImageRatio = props.location.state ? props.location.state.ratio/100 : 1;
    this._clipboard = null;
    this._backgroundImage = null;
    // this.testUrl = 'http://fabricjs.com/assets/pug_small.jpg';
    this.testUrl = 'https://source.unsplash.com/random/500x400';
    this.action = {};

    this.isDragging = false;
    this.selection = true;
    
    this.cropImg = null;
    this.cropCanvasState = {
      left : 0,
      top : 0,
      scaleX : 0,
      scaleY : 0,
      width : 0,
      height : 0
    };

    // redo undo
    this.lock = false;
    this.currentState = { width: null, height: null, action : 'constructor' };
    this.stateStack = [];
    this.redoStack = [];
    this.firstState = null;
    this.maxSize = 100;
    this.state_id = 1;
    this.dotoggle = true;

    // filterList
    this.filterList = ['Grayscale', 'Invert', 'Brownie', 'Technicolor', 'Polaroid', 'BlackWhite', 'Vintage', 'Sepia', 'Kodachrome',
    'Convolute', '', '', '', '', '', 'Brightness', 'Contrast', 'Pixelate', 'Blur', 'Noise', 'Saturation', 'HueRotation','Ink', 'Vignette', 'ZoomBlur' ];

    //add function
    this.startPoint = { x : 0, y : 0 };
    this.shapeType = '';
    this.disableObj = null;

    //grid
    this.grid = null;
    this.gridOn = false;

    //keyEvent
    this.shift = false;

    this.lastPosX = 0;
    this.lastPosY = 0;

    this.lockScale = false;
    // font
    this.fontList = ['Arial', 'Times New Roman', 'Helvetica', 'Courier New', 
    'Vendana', 'Courier', 'Arial Narrow', 'Candara', 'Geneva', 'Calibri', 'Optima', 
    'Cambria', 'Garamond', 'Perpetua', 'brush Script MT', 'Lucida Bright',
    'Copperplate'];

    fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';

    this._createAction();

  }

  componentDidMount() {
    if(this._canvasImageUrl){
      this.loadImage(
        this._canvasImageUrl,
        {x : 0, y : 0}, 
        {originX : "left", originY : "top", scaleX : this._backgroundImageRatio, scaleY : this._backgroundImageRatio}
      )
      .then((img) => this._backgroundImage = img)
      .then(() => {
        this._canvas = new fabric.Canvas('canvas', {
          preserveObjectStacking: true,
          height: this._canvasSize.height,
          width: this._canvasSize.width,
          backgroundColor: '#d8d8d8',
          backgroundImage : this._backgroundImage,
          uniformScaling: false, // When true, objects can be transformed by one side
          imageSmoothingEnabled : false,
          fireRightClick: true,
        });
      })
      .then(() => {
        this.switchTools('text', true);
        this._createDomEvent();
        this._createCanvasEvent();
        this.currentState = this._canvas.toDatalessJSON();
        this.currentState.width = this._canvas.width;
        this.currentState.height = this._canvas.height;
        this.currentState.action = "initilize";
        this.currentState.id = 0;
        this.firstState = this.currentState;
        this.action['Grid'].makeGrid();
      })
    }
    else{
      this._canvas = new fabric.Canvas('canvas', {
        preserveObjectStacking: true,
        height: this._canvasSize.height,
        width: this._canvasSize.width,
        backgroundColor: '#d8d8d8',
        backgroundImage : this._backgroundImage,
        uniformScaling: false,
        imageSmoothingEnabled : false,
        fireRightClick: true,
      });
      this.switchTools('filter', 'text', true);
      this._createDomEvent();
      this._createCanvasEvent();
      this.currentState = this._canvas.toDatalessJSON();
      this.currentState.width = this._canvas.width;
      this.currentState.height = this._canvas.height;
      this.currentState.action = "initilize";
      this.currentState.id = 0;
      this.firstState = this.currentState;
      this.action['Grid'].makeGrid();
    }
    this.forceUpdate(); // for showUndo/Redo Stack
  }
  
  componentWillUnmount() {
    this._deleteCanvasEvent();
    this._deleteDomevent();  
    this.lock = false;
    this.lockScale = false;
    this.currentState = null;
    this.stateStack.length = 0;
    this.redoStack.length = 0;
    this.cropImg = null;
    this.fontList.length = 0;
    this._clipboard = null;
    this._backgroundImage = null;
    this._canvas = null;
    this.grid = null;
    this.firstState = null;
  }
	
	_onKeydownEvent = (event) => {
    // metakey is a Command key or Windows key
    const {ctrlKey, keyCode, metaKey} = event;
    if(keyCode === 8 || keyCode === 46){
      this.deleteObject();
    }
    // ctrl + c
    if((metaKey || ctrlKey) && keyCode === 67) {
      this.copyObject();
    }
    // ctrl + v
    if((metaKey || ctrlKey) && keyCode === 86) {
      if(this._clipboard){
        this.pasteObject();
      }
    }
  }

  _onShiftKeydownEvent = (event) => {
    const {keyCode} = event;
    if(keyCode === 16){ this.shift = true; }
  }

  _onShiftKeyUpEvent = (event) => {
    const {keyCode} = event;
    if(keyCode === 16) { this.shift = false;}
  }
  
  _onMouseDownEvent = (event) => {
    if(event.target.tagName === 'CANVAS'){
      document.addEventListener('keydown',this._onKeydownEvent);
    }
    else{
      if(event.target.type === 'range') {
        this.dotoggle = false;
      }
      document.removeEventListener('keydown',this._onKeydownEvent);
    }
  }

  _onMouseUpEvent = (event) => {
    if(event.target.type === 'range') {
      this.dotoggle = true;
      this.saveState(event.target.name + 'change');
    }
  }

	_createDomEvent = () => {
    // document.getElementById('canvas').addEventListener('keydown',this._onKeydownEvent)
    document.addEventListener('mouseup',this._onMouseUpEvent);
    document.addEventListener('mousedown',this._onMouseDownEvent)
    document.addEventListener('keyup',this._onShiftKeyUpEvent)
  }


  /**
  * 'canvasMoveStartEvent' event handler
  * @onMousedown
  * @private
  */
  _canvasMoveStartEvent = (event) => {
    if (event.e.altKey === true) {
      this.isDragging = true;
      this.selection = false;
      this.lastPosX = event.e.clientX;
      this.lastPosY = event.e.clientY;
      this._canvas.selection = false;
    }
  }

  /**
  * 'canvasMovingEvent' event handler
  * @onMousemove
  * @private
  */
  _canvasMovingEvent = (event) => {
    if (this.isDragging) {
      let e = event.e;
      let vpt = this._canvas.viewportTransform;
      vpt[4] += e.clientX - this.lastPosX;
      vpt[5] += e.clientY - this.lastPosY;
      // var zoom = this._canvas.getZoom (); 
      // if (zoom < 400 / 1000) {
      //   vpt[4] = 200 - 1000 * zoom / 2;
      //   vpt[5] = 200 - 1000 * zoom / 2;
      // } else {
      //   if (vpt[4] >= 0) {
      //     vpt[4] = 0;
      //   } else if (vpt[4] < this._canvas.getWidth() - 1000 * zoom) {
      //     vpt[4] = this._canvas.getWidth() - 1000 * zoom;
      //   }
      //   if (vpt[5] >= 0) {
      //     vpt[5] = 0;
      //   } else if (vpt[5] < this._canvas.getHeight() - 1000 * zoom) {
      //     vpt[5] = this._canvas.getHeight() - 1000 * zoom;
      //   }
      // }

      this.setState({ canvasView : { x : vpt[4], y : vpt[5] }})
      this._canvas.renderAll();
      this.lastPosX = e.clientX;
      this.lastPosY = e.clientY;
    }
  } 

  /**
  * 'canvasMovieEndEvent' event handler
  * @onMouseup
  * @private
  */
  _canvasMoveEndEvent = (event) => {
    this._canvas.setViewportTransform(this._canvas.viewportTransform);
    this.isDragging = false;
    this.selection = true;
    this._canvas.selection = true;
  }

  /**
  * 'canvasZoomEvent' event handler
  * @onMousewheel
  * @private
  */
  _canvasZoomEvent = (event) => {
    if(event.e.altKey){
      var delta = event.e.deltaY; 
      var zoom = this._canvas.getZoom (); 
      zoom *= 0.999 ** delta; 
      if (zoom> 20) zoom = 20 ; 
      if (zoom < 0.5) zoom = 0.5; 
      this._canvas.zoomToPoint({ x: event.e.offsetX, y: event.e.offsetY }, zoom);
      let vpt = this._canvas.viewportTransform;
      event.e.preventDefault (); 
      event.e.stopPropagation (); 
      // if (zoom < 400 / 1000) {
      //   vpt[4] = 200 - 1000 * zoom / 2;
      //   vpt[5] = 200 - 1000 * zoom / 2;
      // } else {
      //   if (vpt[4] >= 0) {
      //     vpt[4] = 0;
      //   } else if (vpt[4] < this._canvas.getWidth() - 1000  * zoom) {
      //     vpt[4] = this._canvas.getWidth() - 1000 * zoom;
      //   }
      //   if (vpt[5] >= 0) {
      //     vpt[5] = 0;
      //   } else if (vpt[5] < this._canvas.getHeight() - 1000 * zoom) {
      //     vpt[5] = this._canvas.getHeight()  * zoom;
      //   }
      // }
      this.setState({zoom : zoom , canvasView : { x : vpt[4], y : vpt[5] }});
    }
  }

  /**
   * Attach canvas events
   * @private
   */
  _createCanvasEvent = () => {
    this._canvas.on('mouse:down', (event) => {
      // this.setState({absoluteX : event.absolutePointer.x, absoluteY : event.absolutePointer.y })
      if(this.state.displayCropCanvasSize) {
        if(event.target === null || event.target.type !== 'Cropzone') {
          this.action['Crop'].removeCropzone();
          this.setState({displayCropCanvasSize: false});
        }
      }
    });

    this._canvas.on('mouse:down', this._canvasMoveStartEvent);
    this._canvas.on('mouse:move', this._canvasMovingEvent);
    this._canvas.on('mouse:up', this._canvasMoveEndEvent);
    this._canvas.on('mouse:wheel', this._canvasZoomEvent);    

		
		this._canvas.on('selection:created', (event) => {
			// 객체 선택됐을시
      let type = this._canvas.getActiveObject().type;
      this.setState({activeObject : this.getActiveObject() });
			switch(type) {
				case 'image':
					this._imageSelection(this._canvas.getActiveObject());
					break;
				case 'textbox':
					this._textboxSelection(this._canvas.getActiveObject());
					break;
				case 'activeSelection': //group using drag
					this.switchTools('filter', 'text', true);
          break;
        case 'group': //group using drag
				  this.switchTools('filter', 'text', true);
				  break;
				default:
          this.switchTools('filter', 'text', true);
			}
		});

		this._canvas.on('selection:updated', (event) => {
      let type = this._canvas.getActiveObject().type;
      this.setState({ activeObject : this.getActiveObject() });
			switch(type) {
				case 'image':
					this._imageSelection(this._canvas.getActiveObject());
					break;
				case 'textbox':
					this._textboxSelection(this._canvas.getActiveObject());
					break;
				case 'activeSelection': //group using drag
					this.switchTools('filter', 'text', true);
          break;
        case 'group': //group using drag
				  this.switchTools('filter', 'text', true);
				  break;
				default:
          this.switchTools('filter', 'text', true);
			}
		});

		this._canvas.on('selection:cleared', (event) => {
      this.setState({activeObject : { type : 'not active', width : 0, height : 0, scaleX : 0, scaleY : 0} });
			if(!this._canvas.backgroundImage){
        this.switchTools('filter', 'text', true);
			}
			else{
        this.switchTools('text', true);
				this._imageSelection(this._canvas.backgroundImage);
      };
		});
    
    this._canvas.on('object:added', (event) => {
      // console.log('object:added', event.target);
      // let type = event.target.type;
      // if(type !== 'Cropzone'){
      //   this.saveState(event.target.type +' :added event');
      // }
    })
    this._canvas.on('object:modified', (event) => {
      // console.log('object:modified');
      let type = event.target.type;
      if(type !== 'Cropzone') {
        this.saveState(event.target.type + ':modified');
      }
    })

    this._canvas.on('object:rotated', (event) => {
      this.setState({ activeObject : this.getActiveObject() })
    });
    // this._canvas.on('object:removed', (event) => {
    //   console.log('object:removed');
    // })
    // this._canvas.on('object:skewing', (event) => {
    //   console.log('object:skewing');
    // })
    this._canvas.on('object:scaling', (event) => {
      // console.log('object:scaling');
      if(this.state.displayCropCanvasSize) {
        let obj = event.target;
      //   obj.setCoords();
      //   if(event.pointer.y < 0 || event.pointer.x < 0 ||
      //      event.pointer.y > event.target.canvas.height ||
      //      event.pointer.x > event.target.canvas.width) {
      //     obj.top = this.cropCanvasState.top;
      //     obj.left = this.cropCanvasState.left;
      //     obj.scaleX = this.cropCanvasState.scaleX;
      //     obj.scaleY = this.cropCanvasState.scaleY;
      //   }
      //   else {
      //     this.cropCanvasState = {
      //       top: obj.top,
      //       left: obj.left,
      //       scaleX: obj.scaleX,
      //       scaleY: obj.scaleY,
      //     }
      //   }
        let change_state = {width: obj.width*obj.scaleX, height: obj.height*obj.scaleY};
        this.setState({cropCanvasSize: change_state});
      }
    })
    this._canvas.on('object:moving', (event) => {
      if(this.state.displayCropCanvasSize) {
        let obj = event.target;
        obj.setCoords();
        // 만약 cropzone이 회전이 불가능 하다면, max, min 하지 않아도 괜찮
        let obj_top = Math.min(obj.oCoords.tl.y, obj.oCoords.tr.y, obj.oCoords.br.y, obj.oCoords.bl.y) ;
        let obj_bottom = Math.max(obj.oCoords.tl.y, obj.oCoords.tr.y, obj.oCoords.br.y, obj.oCoords.bl.y);
        let obj_right = Math.max(obj.oCoords.tl.x, obj.oCoords.tr.x, obj.oCoords.br.x, obj.oCoords.bl.x);
        let obj_left = Math.min(obj.oCoords.tl.x, obj.oCoords.tr.x, obj.oCoords.br.x, obj.oCoords.bl.x);

        if(obj_top  < 0){ 
          obj.set({
            top : (-this.state.canvasView.y / this.state.zoom) + (Math.abs(obj.aCoords.tl.y - obj.aCoords.bl.y)/2)
          })}
        if(obj_left < 0){
          obj.set({
            left :  (-this.state.canvasView.x / this.state.zoom) + (Math.abs(obj.aCoords.br.x - obj.aCoords.bl.x)/2)
          })}
        if(obj_bottom > this._canvas.height ){
          obj.set({
            top : ( (-this.state.canvasView.y / this.state.zoom)  + (this._canvas.height / this.state.zoom) - (Math.abs(obj.aCoords.tl.y - obj.aCoords.bl.y)/2))
          })
        }
        if(obj_right > this._canvas.width ) {
          obj.set({
            left: ( (-this.state.canvasView.x / this.state.zoom)  + (this._canvas.width / this.state.zoom) - (Math.abs(obj.aCoords.br.x - obj.aCoords.bl.x)/2))
          })
        }
        obj.setCoords();
      }
    })
  }

  /**
   * Detach canvas events
   * @private
   */
  _deleteCanvasEvent = () =>{
    this._canvas.off('object:added');
    this._canvas.off('object:modified');
    this._canvas.off('object:rotated');
    this._canvas.off('object:scaling');
    this._canvas.off('object:moving');
    this._canvas.off('selection:cleared');
    this._canvas.off('selection:updated');
    this._canvas.off('selection:created');
    this._canvas.off('mouse:move');
    this._canvas.off('mouse:wheel');
    this._canvas.off('mouse:up');
    this._canvas.off('mouse:down');
  }

  _deleteDomevent = () =>{
    document.removeEventListener('keydown',this._onKeydownEvent)
    document.removeEventListener('mousedown',this._onMouseDownEvent)
    document.removeEventListener('keyup',this._onShiftKeyUpEvent)
    document.removeEventListener('mouseup',this._onMouseUpEvent)
  }

  resetCanvas = () => {
    this._canvas.setZoom (1); 
    this.setState({zoom : 1, canvasView : { x: 0, y: 0} });
    let vpt = this._canvas.viewportTransform;
    vpt[4] = 0;
    vpt[5] = 0;
    this.lastPosX = 0;
    this.lastPosY = 0;
    this._canvas.renderAll();
  }

  onClickGrid = (event) => {
    if(event.target.checked){
      this.gridOn = true;
      this.action['Grid'].showGrid();
    }
    else{
      this.gridOn = false;
      this.action['Grid'].hideGrid();
    }
  }

  saveState = (action) => {
    if(this.dotoggle && !this.lock) {
      if(this.stateStack.length === this.maxSize) {
        this.stateStack.shift();
      }
      this.stateStack.push(this.currentState);
      this.currentState = this._canvas.toDatalessJSON();
      // this.currentState.objects.forEach(object => {
      //   if(object.type === 'image') {
      //     let change_filters = Array.from({length: this.filterList.length}, () => false);
      //     object.filters.forEach(filter => {
      //       change_filters[this.filterList.indexOf(filter.type)] = filter;
      //     });
      //     console.log(change_filters);
      //     object.filters = change_filters;
      //   }
      // });
      this.currentState.width = this._canvas.width;
      this.currentState.height = this._canvas.height;
      this.currentState.action = action;
      this.currentState.id = this.stateStack.length > 0 ? this.stateStack[this.stateStack.length -1].id + 1 : 1;
      this.redoStack.length = 0;
      this.forceUpdate(); // for showUndo/Redo Stack
    }
  }

  undo = () => {
    if(this.stateStack.length > 0) {
      this.applyState(this.redoStack, this.stateStack.pop());
    }
  }

  redo = () => {
    if(this.redoStack.length > 0) {
      this.applyState(this.stateStack, this.redoStack.pop());
    }
  }

  applyState = (stack, newState) => {
    stack.push(this.currentState);
    this.currentState = newState;
    this.lock = true;
    this._canvas.loadFromJSON(this.currentState, () => {
      this._canvas.setWidth(newState.width);
      this._canvas.setHeight(newState.height);
      this._canvas.calcOffset();
      this.lock = false;
    });
    // this._canvas._objects.forEach(object => {
    //   if(object.type === 'image') {
    //     let change_filters = [];
    //     // let change_filters = Array.from({length: this.filterList.length}, () => false);
    //     for (let index = 0; index < this.filterList.length; index++) {
    //       change_filters.push();
    //     }
    //     object.filters.forEach(filter => {
    //       change_filters[this.filterList.indexOf(filter.type)] = filter;
    //     });
    //     object.filters = change_filters;
    //   }
    // });
    this.forceUpdate(); // for showUndo/Redo Stack
  }

  resetState = () => {
    this.stateStack.length = 0;
    this.redoStack.length = 0;
    this.state_id = 1;
    this.currentState = this.firstState;
    this._canvas.loadFromJSON(this.firstState, () => {
      this._canvas.setWidth(this.firstState.width);
      this._canvas.setHeight(this.firstState.height);
      this._canvas.calcOffset();
      this.lock = false;
    });
    this.forceUpdate(); // for showUndo/Redo Stack
  }

	/**
   * action on selected image
	 * @param {Object} image : selectedImage or backgroundImage
   * @private
   */
	_imageSelection = (image) => {
		this.switchTools('filter', false);
		this.switchTools('text', true);
    let list = document.getElementsByClassName('filter');
    let toggle = image.shadow ? true : false;
    let change_filters = Array.from({length: this.filterList.length}, () => false);
    image.filters.forEach(filter => {
      change_filters[this.filterList.indexOf(filter.type)] = filter;
    });
    image.filters = change_filters;
		for(let i=0; i<list.length; i++){
			list[i].checked = image.filters[i];
    }
		this.setState({
			activeObject : this.getActiveObject() ? this.getActiveObject() : {type : 'not active', width : 0, height : 0, scaleX : 0, scaleY : 0},
      filters : {
        brightness: image.filters[15] ? image.filters[15].brightness : 0,
        contrast : image.filters[16] ? image.filters[16].contrast : 0,
        pixelate : image.filters[17] ? image.filters[17].blocksize : 1,
        blur : image.filters[18] ? image.filters[18].blur : 0,
        noise : image.filters[19] ? image.filters[19].noise : 0,
        saturation : image.filters[20] ? image.filters[20].noise : 0,
        hue : image.filters[21] ? image.filters[21].noise : 0,
        ink : image.filters[22] ? image.filters[22].ink_matrix.ink : 0,
        vignette : image.filters[23] ? image.filters[23].vignette_matrix.amount : 0,
        zoomblur : image.filters[24] ? image.filters[24].zoomblur_matrix.strength : 0,
      },
      shadow : {
        blur : toggle ? image.shadow.blur : 30,
        offsetX : toggle ? image.shadow.offsetX : 10,
        offsetY : toggle ? image.shadow.offsetY : 10,
        color : toggle ? image.shadow.color : '#000000'
      },
      displayshadow : toggle
		});
	}


	/**
   * action on textbox
	 * @param {Object} text : selectedTextbox
   * @private
   */
	_textboxSelection = (text) => {
    this.switchTools('text', false);
    this.switchTools('filter', true);
    // toggle shadow, backgroundColor
    let toggle = [false, false];
    if(text.shadow) {
      toggle[0] = true;
    }
    if(text.textBackgroundColor) {
      toggle[1] = true;
    }
    if(text.fontStyle === "italic"){
      document.getElementById('italic_checkbox').checked = true;
    }
    else{
      document.getElementById('italic_checkbox').checked = false;
    }
		this.setState({
      activeObject : this.getActiveObject(),
			fontsize : text.fontSize,
      displayshadow : toggle[0],
      displayTextbgColorPicker : toggle[1],
      shadow : {
        blur : toggle[0] ? text.shadow.blur : 30,
        offsetX : toggle[0] ? text.shadow.offsetX : 10,
        offsetY : toggle[0] ? text.shadow.offsetY : 10,
        color : toggle[0] ? text.shadow.color : '#000000'
      },
      text : { color : toggle[1] ? text.textBackgroundColor : '#FFFFFF'}
		});
  }
  
  switchTools = (...args) => {
    for(let i = 0; i< args.length-1; i++) {
      fabric.util.toArray(document.getElementsByClassName(args[i])).forEach(el => 
        el.disabled = args[args.length-1]);
    }
  }


  /**
   * create Action List
   * @private
   */
  _createAction = () => {
    this._register(this.action, new Rotation(this));
    this._register(this.action, new Draw(this));
    this._register(this.action, new Filter(this));
    this._register(this.action, new Delete(this));
    this._register(this.action, new Crop(this));
    this._register(this.action, new Text(this));
    this._register(this.action, new Flip(this));
    this._register(this.action, new Fill(this));
    this._register(this.action, new Icon(this));
    this._register(this.action, new Shape(this));
    this._register(this.action, new Grid(this));
    this._register(this.action, new Line(this));
    this._register(this.action, new Snap(this));
    this._register(this.action, new Layers(this));
  }

  /**
   * register Action
   * @param {Object} map : map 
   * @param {Object} module : action module
   * @private
   */
  _register = (map, action) => {
    map[action.getName()] = action;
  }

  /**
   * Get ActiveObject instance
   * @returns {fabric.Canvas._activeObject}
   */
  getActiveObject = () => {
    return this._canvas._activeObject;
  }

  /**
   * Get canvas instance
   * @returns {fabric.Canvas}
   */
  getCanvas = () => {
    return this._canvas;
  }

  /**
   * Get ImageEditor instance
   * @returns {ImageEditor}
   */
  getImageEditor = () => {
    return this;
  }

  /**
   * Get grid instance
   * @returns {ImageEditor}
   */
  getGrid = () => {
    return this.grid;
  }

  setGrid = (grid) => {
    this.grid = grid;
  }

  onClickSnap = (event) => {
    this.action['Snap'].onClickSnap(event);
  }

  onClickObjectSnap = (event) => {
    this.action['Snap'].onClickObjectSnap(event);
  }
  
  copyObject = () => {
    if(this.getActiveObject()){
      this.getActiveObject().clone((cloned) => {
        this._clipboard = cloned;
      });
    }
  }

  pasteObject = () => {
    const canvas = this._canvas;
    this._clipboard.clone((clonedObj) => {
      canvas.discardActiveObject();
      clonedObj.set({
        left: clonedObj.left + 10,
        top: clonedObj.top + 10,
        evented: true,
      });
      if (clonedObj.type === 'activeSelection') {
        clonedObj.canvas = canvas;
        clonedObj.forEachObject(function(obj) {
          canvas.add(obj);
        });
        // this should solve the unselectability
        clonedObj.setCoords();
      } else {
        canvas.add(clonedObj);
      }
      this._clipboard.top += 10;
      this._clipboard.left += 10;
      canvas.setActiveObject(clonedObj);
      canvas.requestRenderAll();
    });
  }


  loadImage = (url, pointer, option) => {
    return new Promise(resolve => {
      fabric.Image.fromURL(url, img => {
        img.set({
          angle: 0,
          originX: option.originX,
          originY: option.originY,
          left: pointer.x,
          top: pointer.y,

          scaleX : option.scaleX,
          scaleY : option.scaleY,

          // max size 2048x2048 for Webgl
          // width : img.width * option.scaleX,
          // height : img.height * option.scaleY,
          // scaleX : 1,
          // scaleY : 1,

          strokeWidth : 0
        });
        resolve(img);
      }, { crossOrigin: 'anonymous' }
      );
    });
  }

  saveImage = () => {
    let dataURL = this._canvas.toDataURL({
      format: 'png'
    });
    var a = document.createElement("a");
    a.href = dataURL;
    a.setAttribute("download", 'image.png');
    a.click();
  }

  exportCanvas = () => {
    let c = this._canvas.toJSON();
    c.width = this._canvas.width;
    c.height = this._canvas.height;
    let data = JSON.stringify(c);
    let file = new Blob([data], {type : 'octet/stream'});
    var a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.setAttribute("download", 'canvas.json');
    a.click();
  }

  importCanvas = (event) => {
    let file = event.target.files[0];
    let json;
    var reader = new FileReader();
    reader.onload = (event) => {
      json = JSON.parse(event.target.result);
      console.log(json);

      this._canvas.loadFromJSON(json, () => {
        this.cropImg = null;
  
        // redo undo
        this.lock = false;
        this.currentState = { action : 'constructor' };
        this.stateStack = [];
        this.redoStack = [];
        this.maxSize = 100;
        this.state_id = 1;
        this.undoCanvasSize = [];
        this.redoCanvasSize = [];
        this.currentCanvasSize = {width: null, height: null};
  
        //add function
        this.shapeType = '';
    
        this.grid = null;
        this.gridOn = false;

        this.lockScale = false;

        this.currentState = this._canvas.toDatalessJSON();
        this.currentState.action = "initilize";
        this.currentState.width = json.width ? json.width : 800;
        this.currentState.height = json.height ? json.height : 600;
        this.currentState.id = 0;
        this.firstState = this.currentState;
        this.currentCanvasSize = {width: this._canvas.width, height: this._canvas.height};

        this._canvas.setWidth( json.width ? json.width : 800 );
        this._canvas.setHeight( json.height ? json.height : 600 );
        this._canvas.calcOffset();

        this._canvas.renderAll()
        this.forceUpdate(); // for undo/redo stack
      })
    }
    reader.readAsText(file);
  }

  fileChange = (event) => {
    new Promise((resolve) => {
      let file = event.target.files[0];
      this.testUrl = URL.createObjectURL(file)
      resolve();
    })
      .then(() => {
        this.addImage();
      })
  }

  addImageEvent = (event) => {
    const pointer = this._canvas.getPointer(event, false)
    if(event.target.tagName === 'CANVAS'){
      this.loadImage(this.testUrl, pointer, {originX : "center", originY : "center", scaleX : 1, scaleY : 1})
      .then((data) => {
        this._canvas.add(data).setActiveObject(data);
        this.saveState('image add');
        // this.setState({ layers: this.state.layers.concat(data) });
        // console.log(data.getSvgSrc());
      })
    }
    document.removeEventListener('mousedown', this.addImageEvent);
    this._canvas.defaultCursor = 'default';
  }

  addImage = () => {
    this._canvas.defaultCursor = 'pointer';
    document.addEventListener('mousedown',this.addImageEvent);
  }

  addText = () => {
    this.action['Text'].addText();
  }

  _bindShapeEvent = (shape) => {
    const canvas = this._canvas;
    shape.on({
      scaling(event){
        ResizeHelper.resize(canvas, event, this);
      },
    })
  }

  addShapeEvent = (event) => {
    let myFigure;
    if(event.target.tagName === 'CANVAS'){
      document.removeEventListener('keydown',this._onKeydownEvent);

      this.disableObj = this.getActiveObject();
      if(this.disableObj){
        // disableObj.evented = false;
        this.disableObj.lockMovementY = true;
        this.disableObj.lockMovementX = true;
      }
      const pointer = this._canvas.getPointer(event, false)
      switch(this.shapeType) {
        case 'triangle':
          myFigure = new fabric.Triangle({ width: 0, height: 0, left: pointer.x, top: pointer.y, fill: "black",  originX : "left", originY:"top", isRegular : this.shift, strokeWidth : 0, noScaleCache: false, });
          this._canvas.add(myFigure).setActiveObject(myFigure);
          this._bindShapeEvent(myFigure);
          break;
        case 'rectangle':
          myFigure = new fabric.Rect({ width: 0, height: 0, left: pointer.x, top: pointer.y, fill: "black", originX : "left", originY:"top", isRegular : this.shift, strokeWidth : 0, noScaleCache: false,});
          this._canvas.add(myFigure).setActiveObject(myFigure);
          this._bindShapeEvent(myFigure);
          break;
        case 'ellipse':
          myFigure = new fabric.Ellipse({ rx:0, ry:0, left: pointer.x, top: pointer.y, fill: "black", isRegular : this.shift, strokeWidth : 0 });
          this._canvas.add(myFigure).setActiveObject(myFigure);
          break;
        case 'circle':
          myFigure = new fabric.Circle({ radius : 0, left: pointer.x, top: pointer.y, fill: "black", originX : "left", originY:"top", isRegular : this.shift, strokeWidth : 0, noScaleCache: false,});
          this._canvas.add(myFigure).setActiveObject(myFigure);
          break;        
        default:
      }
      
      this._canvas.selection = false;
      this._canvas.on('mouse:move', this.shapeCreateResizeEvent);
      this._canvas.on('mouse:up', this.shapeEndResizeEvent);
    }

    this._canvas.defaultCursor = 'default';
    document.removeEventListener('keydown',this._onShiftKeydownEvent);
    document.removeEventListener('mousedown',this.addShapeEvent);    
  }

  addShape = (event) => {
    // let body = document.body;
    this._canvas.defaultCursor = 'pointer';
    this._canvas.discardActiveObject();
    this.shapeType = event.target.getAttribute('type');
    document.addEventListener('mousedown',this.addShapeEvent);    
    document.addEventListener('keydown',this._onShiftKeydownEvent);
  }

  shapeEndResizeEvent = (event) => {
    this._canvas.off('mouse:move', this.shapeCreateResizeEvent);

    let activeObject = this.getActiveObject();

    this.adjustOriginToCenter(activeObject);

    if(activeObject.width === 0 || activeObject.height === 0){
      this._canvas.remove(activeObject);
    }
    else{
      this.saveState(activeObject.type + ' add');
    }

    this._canvas.selection = true;
    this._canvas.renderAll();
    if(this.disableObj){
      this.disableObj.lockMovementY = false;
      this.disableObj.lockMovementX = false;
      this.disableObj = null;
    }
    document.addEventListener('keydown',this._onKeydownEvent);
    this.shift = false;
    this._canvas.off('mouse:up', this.shapeEndResizeEvent);
    // this._canvas.on('mouse:up', (event) => { console.log("fire", event)});
  }

  shapeCreateResizeEvent = (event) => {
    // console.log(keyCode)
    // let activeObject = event.target
    let activeObject = this.getActiveObject();
    // console.log(activeObject, event.target)

    const pointer = this._canvas.getPointer(event, false)
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
    this._canvas.renderAll();
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

  addIcon = (event) => {
    const options = {
      type : event.target.getAttribute('type'),
      color : this.state.color,
    }
    this.action['Icon'].addIcon(options);
  }

  addLine = () => {
    this.action['Line'].addLine();
  }

  makePolygonWithDrag = () => {
    this.action['Draw'].drawPolygonWithDrag();
  }

  makePolygonWithClick = () => {
    this.action['Draw'].drawPolygonWithClick();
  }

  lockScaleRatio = (event) => {
    if(this.getActiveObject()){
      let obj = this.getActiveObject();
      obj.set({
        scaleY : Math.max(obj.scaleX, obj.scaleY),
        scaleX : Math.max(obj.scaleX, obj.scaleY)
      })
    }
    this.lockScale = !this.lockScale;
    this.setState({ activeObject : this.getActiveObject() ? this.getActiveObject() : {type : 'not active', width : 0, height : 0, scaleX : 0, scaleY : 0} })
    this._canvas.renderAll();
  }

  handleAngleChange = (event) => {
    if (this.getActiveObject()) {
      this.action['Rotation'].setAngle(event.target.value);
      this.setState({ activeObject : this.getActiveObject() });
      this.saveState('angle change');
      this._canvas.renderAll();
    }
    // else {
    //   if(this._backgroundImage){
    //     this._canvas.backgroundImage.angle = event.target.value;
    //     this._canvas.renderAll();
    //   }
    // }
  }

  handleScaleXChange = (event) => {
    if(this.getActiveObject()){
      this.getActiveObject().scaleX = event.target.value / 100 ;
      if(this.lockScale){
        this.getActiveObject().scaleY = event.target.value / 100 ;
      }
      this.setState({activeObject : this.getActiveObject()});
      this._canvas.renderAll();
    }
  }

  handleScaleYChange = (event) => {
    if(this.getActiveObject()){
      this.getActiveObject().scaleY = event.target.value / 100;
      if(this.lockScale){
        this.getActiveObject().scaleX = event.target.value / 100 ;
      }
      this.setState({activeObject : this.getActiveObject()});
      this._canvas.renderAll();
    }
  }

  handleEndAngleChange = (event) => {
    if(this.getActiveObject()){
      let shape = this.getActiveObject();
      shape.set({
        endAngle : event.target.value * Math.PI / 180,
      })
      this.setState({activeObject : this.getActiveObject()});
      this._canvas.renderAll();
    }
  }

  handleFilterChange = (event) => {
    const value = event.target.value
    let filterOption = event.target.getAttribute('filter');
    let activeObject = this.getActiveObject();
    if ( activeObject || this._backgroundImage ) {
      let change_state = {
        brightness : this.state.filters.brightness, 
        contrast : this.state.filters.contrast, 
        pixelate : this.state.filters.pixelate,
        blur : this.state.filters.blur,
        noise : this.state.filters.noise,
        saturation : this.state.filters.saturation,
        hue : this.state.filters.hue,
        ink : this.state.filters.ink,
        vignette : this.state.filters.vignette,
        zoomblur : this.state.filters.zoomblur,
      };
      change_state[event.target.name] = event.target.value;
      new Promise((resolve) => {
        this.setState({filters : change_state});
        resolve();
      })
        .then(() => {
          this.action['Filter'].applyFilter(activeObject || this._backgroundImage , filterOption, true, value);
          this.saveState('input filter change : ' + filterOption);
        })
    }
    else {
      alert('image is not activated');
    } 
  }

  handleOpacityChange = (event) => {
    let activeObject = this.getActiveObject();
    if(activeObject || this._backgroundImage){
      this.action['Filter'].applyFilter(activeObject || this._backgroundImage , 'opacity', true, event.target.value);
      if(activeObject){
        this.setState({ activeObject : activeObject})
      }
      this._canvas.renderAll();
    }
  }

  handlefontSizeChange = (event) => {
    const fontSize = event.target.value;
    let activeObject = this.getActiveObject();
    let textOption = event.target.getAttribute('text');
    if(this.getActiveObject()) {
      new Promise((resolve) => {
        this.setState({fontsize: fontSize});
        resolve();
      })
      .then(() => {
        this.action['Text'].textObj(activeObject, textOption, true, fontSize);
        this.saveState('font size change');
      })
    }
    else{
      this.setState({fontsize: fontSize});
    }
	}
	
	handleColorChange = (color) => {
    // console.log((Math.round(color.rgb.a * 255)).toString(16))
    this.setState({ color: color.rgb, colorHex : color.hex })
  }

  handleColorChangeComplete = (color) => {
    // console.log("mouse up")
    const activeObject = this.getActiveObject();
    if(activeObject) {
      // this.action['Fill'].fill(color.hex);
      this.action['Fill'].fill(`rgba(${ color.rgb.r }, ${ color.rgb.g }, ${ color.rgb.b }, ${ color.rgb.a })`);
      this.setState({ activeObject : this.getActiveObject() });
      this.saveState('Fill : colorChangeComplete');
    }
  }
  
  
  handleStrokeWidthChange = (event) => {
    if(this.getActiveObject()){
      let options = {
        strokeColor : '#ffffff',
        strokeWidth : Number(event.target.value)
      }
      this.action['Shape'].setStroke(this.getActiveObject(), options);
      this.saveState('stroke change');
    }
    this.setState({ activeObject : this.getActiveObject() })
  }

  handleStrokeColorChange = (color) => {
    // if(this.getActiveObject()){
    //   let options = {
    //     strokeColor : color.hex
    //   }
    //   this.setState({strokeColor : color.hex})
    //   this.action['Shape'].setStroke(this.getActiveObject(), options);
    // }
  }

  handleCropCanvasSizeChange = (event) => {
    let obj = this.getActiveObject();
    let change_state = {
      width : this.state.cropCanvasSize.width,
      height : this.state.cropCanvasSize.height
    };
    if(event.target.name === 'width') {
      if(obj.left - event.target.value/2 < 0 || obj.left + event.target.value/2 > this._canvas.width) {
        if(obj.left < this._canvas.width - obj.left) {
          obj.left = event.target.value/2;
        }
        else {
          obj.left = this._canvas.width - event.target.value/2;
        }
        change_state.width = Math.min(obj.left*2, (this._canvas.width-obj.left)*2);
      }
    }
    else {
      if(obj.top - event.target.value/2 < 0 || obj.top + event.target.value/2 > this._canvas.height) {
        if(obj.top < this._canvas.height - obj.top) {
          obj.top = event.target.value/2;
        }
        else {
          obj.top = this._canvas.height - event.target.value/2;
        }
        change_state.height = Math.min(obj.top*2, (this._canvas.height-obj.top)*2);
      }
    }
    change_state[event.target.name] = event.target.value;
    new Promise((resolve) => {
      this.setState({cropCanvasSize : change_state});
      resolve();
    })
    .then(() => {
      this.action['Crop'].resizeCropzone(this.state.cropCanvasSize);
    })
  }

  handletextBgChange = (event) => {
    if(this.getActiveObject() && this.getActiveObject().type === 'textbox') {
      let change_state = {color : event.hex};
      this.setState({text : change_state});
      this.action['Text'].textObj(this.getActiveObject(), 'background-color', true, event.hex);
      this.saveState('text bg change');
    }
  }

  handleShadowChange = (event) => {
    let object = this.getActiveObject();
    let change_state = {
      blur : this.state.shadow.blur,
      offsetX : this.state.shadow.offsetX,
      offsetY : this.state.shadow.offsetY,
      color : this.state.shadow.color
    }
    if(event.hex) {
      change_state['color'] = event.hex;
    }
    else {
      change_state[event.target.name] = event.target.value;
    }
    new Promise((resolve) => {
      this.setState({shadow: change_state});
      resolve();
    })
    .then(() => {
      object.set('shadow', new fabric.Shadow(this.state.shadow));
      this.saveState('shadow changed');
      this._canvas.renderAll();
    })
  }


  rotateObject = (event) => {
    var changeAngle = event.target.getAttribute('angle');
    var activeObject = this.getActiveObject();

    if (activeObject) {
      this.action['Rotation'].setAngle(activeObject.angle + Number(changeAngle));
      this.setState({ activeObject : activeObject })
      this.saveState('Object is rotated');
    }
    else {
      alert('image is not activated')
    }
  }

  filterObject = (event) => {
    let filterOption = event.target.getAttribute('filter');
    let activeObject = this.getActiveObject();

    if (activeObject) {
      this.action['Filter'].applyFilter(activeObject, filterOption, event.target.checked, event.target.value);
      this.saveState('apply filter objImg');
    }
    else if(this._canvas.backgroundImage){
      this.action['Filter'].applyFilter(this._canvas.backgroundImage, filterOption, event.target.checked, event.target.value);
      this.saveState('apply filter backgroundImg');
    }

  }

  deleteObject = () => {
    this.action['Delete'].deleteObject();
  }

  deleteAllObject = () => {
    this.action['Delete'].deleteAllObject();
  }

  flipObject = (event) => {
    let activeObject = this.getActiveObject();
    let option = event.target.getAttribute('flip');
    if (activeObject) {
      this.action['Flip'].flip(activeObject, option);
      this.saveState(activeObject.type + ' flip');
    }
    else if(this._backgroundImage) {
      this.action['Flip'].flip(this._backgroundImage, option);
      this.saveState('backgroundImg flip');
    }
  }

  cropObjMouseDown = (event) => {
    if(event.target == null || !(event.target === this.cropImg || event.target.type === "Cropzone")){
      this._canvas.off('mouse:down', this.cropObjMouseDown);
      this.action['Crop'].cropObjend(this.cropImg, null);
      this.cropImg = null;
    }
  }

  cropObject = (event) => {
    let cropOption = event.target.getAttribute('crop');
    let activeObject = this.getActiveObject();
    if(activeObject && activeObject.type === 'image'){
      this.cropImg = activeObject;
      this.action['Crop'].cropObj(activeObject, cropOption);
      this._canvas.on('mouse:down', this.cropObjMouseDown);
    }
  }

  cropEndObject = (event) => {
    let cropOption = event.target.getAttribute('crop');
    if(this.cropImg){
      this._canvas.off('mouse:down', this.cropObjMouseDown);
      this.action['Crop'].cropObjend(this.cropImg, cropOption);
      this.cropImg = null;
    }
  }

  cropCanvas = () => {
    if(this.getActiveObject() && this.getActiveObject().type === 'Cropzone') {
      return;
    }
    let change_state = {width: this._canvas.width/2, height: this._canvas.height/2};
    this.setState({
      displayCropCanvasSize: true,
      cropCanvasSize: change_state
    });
    this.action['Crop'].cropCanvas();
  }

  cropEndCanvas = () => {
    if(this.state.displayCropCanvasSize) {
      this.action['Crop'].cropEndCanvas();
      this.saveState('Crop Canvas');
    }
    // this._canvas.setZoom (1);  , zoom : 1
    this.setState({displayCropCanvasSize: false});
    // this._canvas.renderAll();
  }

  textObject = (event) => {
    let textOption = event.target.getAttribute('text');
    this.action['Text'].textObj(this.getActiveObject(), textOption, event.target.checked, event.target.value);
  }

  toggletextbg = () => {
    new Promise((resolve) => {
      this.setState({displayTextbgColorPicker: !this.state.displayTextbgColorPicker});
      resolve();
    })
    .then(() => {
      let object = this.getActiveObject();
      if(this.state.displayTextbgColorPicker) {
        object.set({textBackgroundColor: '#FFFFFF'});
      }
      else {
        object.set({textBackgroundColor: null});
      }
      this.saveState('textbox backgroundColor');
      this._canvas.renderAll();
    })
  }

  toggleshadow = () => {
    new Promise((resolve) => {
      this.setState({displayshadow: !this.state.displayshadow});
      resolve();
    })
    .then(() => {
      let object = this.getActiveObject();
      if(object) {
        if(this.state.displayshadow) {
          object.set('shadow', new fabric.Shadow({color:'black', blur:30, offsetX:10, offsetY:10, opacity:0}));
        }
        else {
          object.set('shadow', null);
        }
        this.saveState('shadow');
        this._canvas.renderAll();
      }
    })
  }

  layerThumb = () => {
    var layer_list = null;
    // if (this._canvas) {
    //     layer_list = this._canvas._objects.map(obj => <li key={obj.cacheKey}><img src={obj.getSvgSrc()} alt="" height="10%" width="10%" /></li>)
    // }
    return layer_list
  }

  onImgUrlChange = (url) => {
    this.testUrl = url;
    this.addImage();
  }

  objectInfo = () => {
    if(this.getActiveObject()){
      let obj = this.getActiveObject();
      console.log(obj);
      
    }
  }

  newCanvas = (url) => {
    // let url = "https://images.unsplash.com/photo-1547586696-ea22b4d4235d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=100"
    // console.log(url);
    // this._canvas.clear();
    // this._canvas.dispose();
    new Promise(resolve => {
      fabric.Image.fromURL(url, img => {
        img.set({
          originX : "left",
          originY : "top"
				});
				img.on('scaling', () => {

        })
        resolve(img);
      }, { crossOrigin: 'Anonymous' }
      );
    })
      .then((img) => {
        console.log(img);
        return new fabric.Canvas('canvas', {
          preserveObjectStacking: true,
          height: img.height,
          width: img.width,
          backgroundImage: img,
          backgroundColor: 'grey'
        });
        
      })
  }
  openColorPicker = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  }
  closeColorPicker = () => {
		console.log('close')
    this.setState({ displayColorPicker: false });
  }

  getCanvasInfo = () => {
    console.log(this._canvas);
  }

  getMousePointInfo = (event) => {
    if(event.target.checked){
      this._canvas.on('mouse:down', this.showPointer);
    }
    else{
      this._canvas.off('mouse:down', this.showPointer);
    }
  }

  showPointer = (event) => {
    console.log(this._canvas.getPointer(event, false));
  }

  getCanvasEventInfo = () => {
    for (const key in this._canvas.__eventListeners){
      console.log(key);
      for ( const i of this._canvas.__eventListeners[key]){
        console.log(i);
      }
    }
  }

  onclickUndoStack = (event) => {
    let origin = this.currentState.id;
    let dest = parseInt(event.target.getAttribute('number'), 10);
    // console.log('current id : ', this.currentState.id);
    // console.log('click id : ', parseInt(event.target.getAttribute('number'), 10));


    if(this.stateStack.length > 0){
      this.redoStack.push(this.currentState);
      for(let i = dest; i < origin - 1 ; i++ ){
        this.redoStack.push( this.stateStack.pop() );
      }

      this.currentState = this.stateStack.pop();
  
      this._canvas.loadFromJSON(this.currentState, () => {
        this._canvas.setWidth(this.currentState.width);
        this._canvas.setHeight(this.currentState.height);
        this._canvas.calcOffset();
      });
      this.forceUpdate();
    }

  }

  showUndoStack = () => {
    // console.log(this.stateStack);
    const listitem = this.stateStack.map((state) =>
      <p style = {{color : '#5404fb'}} key= {state.id} className="undo_stack" number = {state.id} onClick = {this.onclickUndoStack} >{state.id} : {state.action}</p>
    );
    return(
      <div>
        {listitem}
      </div>
    )
  }

  showRedoStack = () => {
    // console.log(this.redoStack);
    const listitem = this.redoStack.map((state) =>
      <p style = {{color : '#820000'}} key = {state.id} className="redo_stack">{state.id} : {state.action}</p>
    );
    return(
      <div>
        {listitem}
      </div>
    )
  }

  convertSvg = () => {
    let img = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Font_Awesome_5_solid_cloud.svg/512px-Font_Awesome_5_solid_cloud.svg.png";
    fabric.loadSVGFromURL(img, (objects, options) => {
      var shape = fabric.util.groupSVGElements(objects, options);
      console.log(shape.toSVG());
    })
  }

  convertObjSvg = () => {
    if(this.getActiveObject()){
      console.log(this.getActiveObject().toSVG());
    }
  }

  convertObjScale = () => {
    if(this.getActiveObject()){
      let obj = this.getActiveObject();
      obj.set({
        width : obj.width * obj.scaleX,
        height : obj.height * obj.scaleY,
        scaleY : 1,
        scaleX : 1,
      })
    }
  }

  makeGroup = () => {
    if(this.getActiveObject() && this.getActiveObject().type === 'activeSelection'){
      this._canvas.getActiveObject().toGroup();
      this.setState({ activeObject : this._canvas.getActiveObject()});
      this._canvas.renderAll();
      this.saveState('makeGroup')
    }
  }

  unGroup = () => {
    if(this.getActiveObject() && this.getActiveObject().type === 'group'){
      this._canvas.getActiveObject().toActiveSelection();
      this.setState({ activeObject : this._canvas.getActiveObject()});
      this._canvas.renderAll();
      this.saveState('unGroup')
    }
  }

  sendBackwards = () => {
    if(this.getActiveObject()){
      this._canvas.sendBackwards(this.getActiveObject())
      if(this.gridOn){ this._canvas.sendToBack(this.grid) }
      this._canvas.renderAll();
      this.saveState('sendBackwards');
    }
  }
  sendToBack = () => {
    if(this.getActiveObject()){
      this._canvas.sendToBack(this.getActiveObject())
      if(this.gridOn){ this._canvas.sendToBack(this.grid) }
      this._canvas.renderAll();
      this.saveState('sendToBack');
    }
  }
  bringForward = () => {
    if(this.getActiveObject()){
      this._canvas.bringForward(this.getActiveObject())
      this._canvas.renderAll();
      this.saveState('bringForward');
    }
  }
  bringToFront = () => {
    if(this.getActiveObject()){
      this._canvas.bringToFront(this.getActiveObject())
      this._canvas.renderAll();
      this.saveState('bringToFront');
    }
  }

  openDrawing = () => {
    this.setState({ drawingMode: true });
    this._canvas.isDrawingMode = true;
    this._canvas.freeDrawingCursor = 'crosshair';
  }

  closeDrawing = () => {
    this.setState({ drawingMode: false });
    this._canvas.isDrawingMode = false;
  }
  
  handleDrawingWidth = (event) => {
    const value = event.target.value;
    this.setState( {lineWidth: value} );
    this._canvas.freeDrawingBrush.width =  parseInt(this.state.lineWidth, 10);
  }

  handleDrawingColor = (color) => {
    this.setState({ lineColorRgb: color.rgb})
    let rgb = "rgb(" + this.state.lineColorRgb['r'] + ", " + this.state.lineColorRgb['g'] + ", " + this.state.lineColorRgb['b'] + ")"
    this._canvas.freeDrawingBrush.color = rgb;
  }

  changeBackgroundColor = () => {
    this._canvas.backgroundColor = `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`;
    this.saveState('change backgroundColor');
    this._canvas.renderAll();
  }

  pipetteEvent = (event) => {
    if(event.target.tagName === 'CANVAS') { 
      const pointer = this._canvas.getPointer(event, true);
      let context = document.getElementById('canvas').getContext('2d');
      let data = context.getImageData(pointer.x * fabric.devicePixelRatio , pointer.y * fabric.devicePixelRatio, 1, 1).data; 
      this.setState({pipette : false, pipetteRGB:{ r:data[0],g:data[1],b:data[2]}, color : {r:data[0],g:data[1],b:data[2], a:1}});
    }
    document.removeEventListener('mousedown', this.pipetteEvent);
  }

  enablePipette = () => {
    document.addEventListener('mousedown', this.pipetteEvent);
  }

  printObject = () => {
      let first = this._canvas._objects.map(
          x => Object.entries(x)
      );
      let objstack = [];
      for (let i = 0; i < this._canvas._objects.length; i++) {
          if(first[i][0][0] === "filters"){
            objstack[i] = 'img';
          }
          else if(first[i][0][0] === "styles"){
              objstack[i] = 'text';
          }
          else if(first[i][0][0] === "width"){
              objstack[i] = 'shape';
          }
      }
      console.log(objstack);
  }

  displayRoot = () => {
    this.setState({showRoot : !this.state.showRoot})
  }
  render() {
		const styles = {
			color : {
				backgroundColor : `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })` ,
      }
    };
    let i = 0;
    const fontList = this.fontList.map(font => (<option key={i++} value={font}>{font}</option>));
    return (
      <div className='App'>
        <div id='editor'>
          <div>
            <canvas id='canvas' tabIndex='0'></canvas>
          </div>
          <h5 onClick = {this.displayRoot}>개발자 기능</h5>

          {this.state.showRoot ?
          <div>

            {this.state.activeObject.type !== 'not active' ?
            <div>
              <p> left : {this.state.activeObject.aCoords.tl.x} </p>
              <p> right : {this.state.activeObject.aCoords.br.x} </p>
              <p> top : {this.state.activeObject.aCoords.tl.y} </p>
              <p> bottom : {this.state.activeObject.aCoords.br.y} </p>
            </div> : <div></div> }

            <button onClick={this.printObject}>현재 캔버스에 있는 오브젝트 확인하기</button>
            <button onClick={this.addImage}>테스트용 이미지 추가</button>
            <button onClick={this.objectInfo}>오브젝트 정보 콘솔 출력</button>
            <button onClick={this.getCanvasInfo}>캔버스정보</button>
            <button onClick={this.resetCanvas}>캔버스 줌 및 위치 리셋</button>
            <br/>
            <button onClick={this.getCanvasEventInfo}>캔버스 이벤트 정보</button>
            <button onClick={this.convertObjSvg}>클릭된 오브젝트 svg로 변환하기</button>
            <button onClick={this.convertObjScale}>클릭된 오브젝트 scale값 1로 변환</button>
            <button onClick={this.resetState}>state 초기화</button>
            <input type="checkbox" onClick = {this.getMousePointInfo} /> 캔버스 좌표 보기
            <p>캔버스 확대 값 = {this.state.zoom}</p>
            <p>캔버스 크기  {this._canvas? this._canvas.width : 0} X {this._canvas ? this._canvas.height : 0}</p>
            {this._canvas ? 
            <div>
            <p> 좌측 상단 좌표 = x : {(-this.state.canvasView.x / this.state.zoom)}  y : {(-this.state.canvasView.y / this.state.zoom)}</p>
            <p> 우측 하단 좌표 = x : { (-this.state.canvasView.x / this.state.zoom)  + (this._canvas.width / this.state.zoom) }  y : {(-this.state.canvasView.y / this.state.zoom) + (this._canvas.height / this.state.zoom) }</p>
            </div>
            : <div></div>}
            
            <p>현재 객체 타입 = {this.state.activeObject.type}</p>
            <p>선택 개체 밝기 값 = {this.state.filters.brightness}</p>
            <p>선택 개체 대조 값 = {this.state.filters.contrast}</p>
            <p>선택 개체 픽셀 값 = {this.state.filters.pixelate}</p>
            <p>선택 개체 블러 값 = {this.state.filters.blur}</p>
            <p>선택 개체 각도 값 = { this.state.activeObject.type !== 'not active' ? this.state.activeObject.angle : 'none'}</p>
            <p>선택 개체 가로 크기 = {this.state.activeObject.scaleX * this.state.activeObject.width}</p>
            <p>선택 개체 세로 크기 = {this.state.activeObject.scaleY * this.state.activeObject.height}</p>
            <p style={styles.color} >컬러 {this.state.color.r} {this.state.color.g} {this.state.color.b} {this.state.color.a} </p>
				  	<p>컬러 헥스 값{this.state.colorHex}</p>
            <hr />
            <p>- Undo Stack </p>
            {this.showUndoStack()} 
            <hr />
            <p>- currentState</p>
            <p style={{color : '#008000'}}>{this.currentState.action}</p>
            <hr />
            <p>- Redo Stack  </p>
            {this.showRedoStack()}
            

          </div> : null }
          <hr />
          <h5>레이어</h5>
          {/* {this.action['Layers'].showLayers()} */}
          <hr />
        </div>
        
        <div id='tool'>
          <div>
            <h5>오브젝트 기능</h5>
            <button onClick={this.sendToBack}>맨 뒤로 보내기</button>
            <button onClick={this.sendBackwards}>뒤로 보내기</button>
            <button onClick={this.bringToFront}>맨 앞으로 보내기</button>
            <button onClick={this.bringForward}>앞으로 보내기</button>
            <button onClick={this.deleteObject}>선택 개체 삭제</button>
            <button onClick={this.deleteAllObject}>모든 객체 삭제</button>
            <button onClick={this.makeGroup}>그룹화</button>
            <button onClick={this.unGroup}>그룹해제</button>
            <button onClick={this.rotateObject} angle='90' > 선택 개체 90도 회전</button>
            <p>회전</p>
            <input
              type='number'
              name='angle'
              min='-360'
              max='360'
              step='1'
              value={this.state.activeObject.type !== 'not active' ? this.state.activeObject.angle : 0}
              onChange={this.handleAngleChange}
            />
            <p>확대 및 축소</p>
            <input
              type='number'
              name='scaleX'
              min='1'
              max='200'
              step='1'
              value={this.state.activeObject.scaleX * 100}
              onChange={this.handleScaleXChange}
            />%
            <input
              type='number'
              name='scaleY'
              min='1'
              max='200'
              step='1'
              value={this.state.activeObject.scaleY * 100}
              onChange={this.handleScaleYChange}
            />%
            <input type='checkbox' onClick={this.lockScaleRatio} /> 비율 고정
          </div>

          <hr />

          <div>
            <h5>텍스트 기능</h5>
            <button onClick={this.addText}>텍스트 추가</button>
            <label htmlFor='material-switch'>
              <span>배경색</span>
              <Switch 
              checked={this.state.displayTextbgColorPicker} 
              onChange={this.toggletextbg}
              onColor="#86d3ff"
              onHandleColor="#2693e6"
              handleDiameter={30}
              uncheckedIcon={false}
              checkedIcon={false}
              boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
              activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
              height={20}
              width={48}
              className="react-switch"
              id="material-switch"
              disabled = {this.state.activeObject.type === 'textbox' ? false : true}
              ></Switch>
            </label>
            {this.state.displayTextbgColorPicker ? 
            <CompactPicker color={this.state.text.color} onChange={this.handletextBgChange}></CompactPicker> : null}
				  	<p>선택 텍스트 폰트크기 = {this.state.fontsize}</p>
            <input type='checkbox' className='text' onClick={this.textObject} text='bold' />bold
            <input type='checkbox' className='text' onClick={this.textObject} text='italic' id='italic_checkbox' />italic
            <button type='checkbox' className='text' onClick={this.textObject} text='left-align'>좌측정렬</button>
            <button type='checkbox' className='text' onClick={this.textObject} text='center-align' >가운데정렬</button>
            <button type='checkbox' className='text' onClick={this.textObject} text='right-align' >우측정렬</button>
            <label htmlFor='fontSize'> 글자 크기: </label>
            <input 
              type='number' 
              onChange={this.handlefontSizeChange} 
              text='fontSize'
              name='fontSize'
              min='1'
              value={this.state.fontsize} 
            />
            <label htmlFor='fontfamily'>글꼴: </label>
            <select className='text' name='fontfamily' text='fontfamily' onChange={this.textObject}>
              {fontList}
            </select>
          </div>

          <hr />

          <div>
            <h5>이미지 기능</h5>
            <button onClick={this.cropObject} crop="right">자르기 시작</button>
            <button onClick={this.cropEndObject} crop="left">자르기 완료</button>

            <button onClick={this.flipObject} flip="X">Flip x</button>
            <button onClick={this.flipObject} flip="Y">Flip y</button>
            
            <br />
            <div>
                <label>Filter grey</label>
                <input type='checkbox' className='filter' id='grey' onClick={this.filterObject} filter='grey' />
            </div>
            <div>
                <label>Filter invert</label>
                <input type='checkbox' className='filter' id='invert' onClick={this.filterObject} filter='invert' />
            </div>
            <div>
                <label>Filter brownie</label>
                <input type='checkbox' className='filter' id='brownie' onClick={this.filterObject} filter='brownie' />
            </div>
                <div><label>Filter technicolor</label>
                <input type='checkbox' className='filter' id='technicolor' onClick={this.filterObject} filter='technicolor' />
            </div>
                <div><label>Filter polaroid</label>
                <input type='checkbox' className='filter' id='polaroid' onClick={this.filterObject} filter='polaroid' />
            </div>
                <div><label>Filter blackwhite</label>
                <input type='checkbox' className='filter' id='blackwhite' onClick={this.filterObject} filter='blackwhite' />
            </div>
                <div><label>Filter vintage</label>
                <input type='checkbox' className='filter' id='vintage' onClick={this.filterObject} filter='vintage' />
            </div>
                <div><label>Filter sepia</label>
                <input type='checkbox' className='filter' id='sepia' onClick={this.filterObject} filter='sepia' />
            </div>
                <div><label>Filter kodachrome</label>
                <input type='checkbox' className='filter' id='kodachrome' onClick={this.filterObject} filter='kodachrome' />
            </div>
                <div><label>Filter emboss</label>
                <input type='checkbox' className='filter' id='emboss' onClick={this.filterObject} filter='emboss' />
            </div>
            
            <br />

            <input
              type='range'
              className='filter'
              id='brightness'
              min='-1'
              max='1'
              name='brightness'
              step='0.01'
              value={this.state.filters.brightness || 0}
              onChange={this.handleFilterChange} filter='brightness'
            />Brightness

            <input
              type='range'
              className='filter'
              id='contrast'
              min='-1'
              max='1'
              name='contrast'
              step='0.01'
              value={this.state.filters.contrast || 0}
              onChange={this.handleFilterChange} filter='contrast'
            />Contrast

            <input
              type='range'
              className='filter'
              id='pixelate'
              min='1'
              max='50'
              name='pixelate'
              step='1'
              value={this.state.filters.pixelate || 1}
              onChange={this.handleFilterChange} filter='pixelate'
            />pixelate

            <input
              type='range'
              className='filter'
              id='blur'
              min='0'
              max='1'
              name='blur'
              step='0.01'
              value={this.state.filters.blur || 0}
              onChange={this.handleFilterChange} filter='blur'
            />blur

            <input
              type='range'
              className='filter'
              id='noise'
              min='0'
              max='100'
              name='noise'
              step='1'
              value={this.state.filters.noise || 0}
              onChange={this.handleFilterChange} filter='noise'
            />noise

            <input
              type='range'
              className='filter'
              id='saturation'
              min='-1'
              max='1'
              name='saturation'
              step='0.01'
              value={this.state.filters.saturation || 0}
              onChange={this.handleFilterChange} filter='saturation'
            />Saturation

            <input
              type='range'
              className='filter'
              id='hue'
              min='-1'
              max='1'
              name='hue'
              step='0.01'
              value={this.state.filters.hue || 1}
              onChange={this.handleFilterChange} filter='hue'
            />Hue

            <input
              type='range'
              className='filter'
              id='ink'
              min='0'
              max='1'
              name='ink'
              step='0.01'
              value={this.state.filters.ink || 0}
              onChange={this.handleFilterChange} filter='ink'
            />ink from glfx.js

            <input
              type='range'
              className='filter'
              id='vignette'
              min='0'
              max='1'
              name='vignette'
              step='0.01'
              value={this.state.filters.vignette || 0}
              onChange={this.handleFilterChange} filter='vignette'
            />vignette from glfx.js

            <input
              type='range'
              className='filter'
              id='zoomblur'
              min='0'
              max='1'
              name='zoomblur'
              step='0.01'
              value={this.state.filters.zoomblur || 0}
              onChange={this.handleFilterChange} filter='zoomblur'
            />zoomblur from glfx.js

            
            <input
              type='range'
              id='opacity'
              min='0'
              max='1'
              name='opacity'
              step='0.01'
              value={this.state.activeObject.type === 'image' ? this.state.activeObject.opacity : 1}
              onChange={this.handleFilterChange} filter='opacity'
              disabled = {this.state.activeObject.type === 'image' ? false : true}
            />opacity
          </div>

          <hr />

          <div>
            <h5>도형 기능</h5>
            
            <button onClick={this.addShape} type="triangle">삼각형</button>
            <button onClick={this.addShape} type="rectangle">직사각형</button>
            <button onClick={this.addShape} type="ellipse">타원</button>
            <button onClick={this.addShape} type="circle">원</button>
            <button onClick={this.addLine} type="line">직선</button>

            <button onClick={this.makePolygonWithClick} type="line">클릭으로 만들기</button>
            <button onClick={this.makePolygonWithDrag} type="line">드래그로 만들기</button>

            { this.state.activeObject.type === "circle" ? 
            <div>
              {/* <input type="number" name="startAngle"  value = {this.state.activeObject.startAngle} /> */}
              <input type="number" name="endAngle" min='0' max='360' step = '0' value = {this.state.activeObject.endAngle * 180 / Math.PI} onChange = {this.handleEndAngleChange}/>degree
            </div> : <div></div>
            }
          </div>

          <hr />

          <div>
              <h5>그리기 기능</h5>
              {this.state.drawingMode
                ? <div> 
                    <button onClick={this.closeDrawing}>Cancel Drawing</button>
                    <br/>
                    <label>Width</label><input type='range' className='drawing' id='width' min='0' max='30' name='width' step='1' value={this.state.lineWidth} onChange={this.handleDrawingWidth.bind(this)}/>
                    <br/>
                    <label>Line Color</label><SketchPicker color={ this.state.lineColorRgb } onChange={ this.handleDrawingColor } />
                  </div>
                : <button onClick={this.openDrawing}>Free Drawing</button>
                }
          </div>

          <hr />

          <div>
            <h5>캔버스 기능</h5>
            <button onClick={this.changeBackgroundColor}>캔버스 배경색 현재 색깔로 변경</button>
            <button onClick={this.cropCanvas}>캔버스 자르기 시작</button>
            <button onClick={this.cropEndCanvas}>캔버스 자르기 완료</button>
            {this.state.displayCropCanvasSize ? 
              <div>
                <label htmlFor='cropCanvasWidth'> x : </label>
                <input 
                  type='number' 
                  onChange={this.handleCropCanvasSizeChange} 
                  name='width'
                  min='1'
                  max={this._canvas.width}
                  value={this.state.cropCanvasSize.width} 
                />
                <label htmlFor='cropCanvasHeight'> y : </label>
                <input 
                  type='number' 
                  onChange={this.handleCropCanvasSizeChange} 
                  name='height'
                  min='1'
                  max={this._canvas.height}
                  value={this.state.cropCanvasSize.height} 
                />
              </div> : null
            }
            <button onClick={this.saveImage}> 지금 캔버스 배경색 없이 다운 </button>
            <button onClick={this.exportCanvas}> 캔버스 export </button>
            <button><input type='file' id='_file' onChange={this.importCanvas} accept="json"></input>캔버스 import</button>
            <button><input type='file' id='_file' onChange={this.fileChange} accept="image/*"></input>파일 불러오기</button>
            <button onClick={this.undo}>Undo</button>
            <button onClick={this.redo}>Redo</button>
            <h5>{this.currentState.action}</h5>
            <input type="checkbox" onClick={this.onClickSnap}/>그리드 스냅 옵션
            <input type="checkbox" onClick={this.onClickGrid}/>그리드 on/off
            <input type="checkbox" onClick={this.onClickObjectSnap}/> 오브젝트 스냅 옵션
          </div>

          <hr />

          <div>
            <h5>색깔 : 기본 색</h5>
            <button onClick={this.openColorPicker}>color</button>
          	{ this.state.displayColorPicker ? <div>
          	  <div onClick={this.closeColorPicker} role="button" tabIndex="0"/>
          	  <SketchPicker color={ this.state.color } onChange={ this.handleColorChange } onChangeComplete = { this.handleColorChangeComplete }/>
          	</div> : null }
          </div>

          <hr/>

          <div>
            <h5>스포이드</h5>
            <button onClick={this.enablePipette}>Pipette</button>
            <p>{this.state.pipetteRGB.r}|{this.state.pipetteRGB.g}|{this.state.pipetteRGB.b}</p>
          </div>

          <hr />

          <div>
            <h5>그림자</h5>
            <Switch 
              checked={this.state.displayshadow} 
              onChange={this.toggleshadow}
              onColor="#86d3ff"
              onHandleColor="#2693e6"
              handleDiameter={30}
              uncheckedIcon={false}
              checkedIcon={false}
              boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
              activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
              height={20}
              width={48}
              className="react-switch"
              id="material-switch"
              ></Switch>
              {this.state.displayshadow ?
                <div>
                  <br/>
                  <label htmlFor='shadow'>
                    <span>블러</span>
                    <input
                      type='range'
                      className='shadow'
                      id='shadow'
                      min='1'
                      max='100'
                      name='blur'
                      step='1'
                      value={this.state.shadow.blur}
                      onChange={this.handleShadowChange}/>

                    <span>세로 위치</span>
                    <input
                      type='range'
                      className='shadow'
                      id='shadow'
                      min='-100'
                      max='100'
                      name='offsetY'
                      step='1'
                      value={this.state.shadow.offsetY}
                      onChange={this.handleShadowChange}/>

                    <span>가로 위치</span>
                    <input
                      type='range'
                      className='shadow'
                      id='shadow'
                      min='-100'
                      max='100'
                      name='offsetX'
                      step='1'
                      value={this.state.shadow.offsetX}
                      onChange={this.handleShadowChange}/>
                    </label>
                    <CompactPicker color={this.state.shadow.color} onChange={this.handleShadowChange}></CompactPicker>
                  </div>
              :null}
            <h5>테두리 두깨</h5>
            <input
              type='number'
              name='stroke'
              min='0'
              max='100'
              step='1'
              value={ this.state.activeObject.strokeWidth ? this.state.activeObject.strokeWidth : 0}
              disabled = { (this.state.activeObject.type === 'group' || this.state.activeObject.type === 'activeSelection' || this.state.activeObject.type === 'not active') ? true : false }
              onChange={this.handleStrokeWidthChange}
            />
          </div>
            
          <div>
            <h5>아이콘 기능</h5>
            <button className="fas fa-times" onClick={this.addIcon} type = "cancel"></button>
            <button className="fas fa-arrow-right" onClick={this.addIcon} type = "icon_arrow_2"></button>
            <button className="fas fa-angle-right" onClick={this.addIcon} type = "icon_arrow_3"></button>
            <button className="fas fa-star" onClick={this.addIcon} type = "icon_star"></button>
            <button className="fas fa-certificate" onClick={this.addIcon} type = "icon_star_2"></button>
            <button className="fas fa-times" onClick={this.addIcon} type = "icon_polygon"></button>
            <button className="fas fa-map-marker-alt" onClick={this.addIcon} type = "icon_location"></button>
            <button className="fas fa-heart" onClick={this.addIcon} type = "icon_heart"></button>
            <button className="fas fa-comment-alt" onClick={this.addIcon} type = "icon_bubble"></button>
            <button className="fas fa-cloud" onClick={this.addIcon} type = "icon_cloud"></button>
          </div>

          <div>
            <h5>일단은 안 쓰는 기능</h5>
            <button onClick={this.newCanvas} disabled>배경이미지 캔버스로 변경</button>
            <button onClick={this.convertSvg}>svg로 변환하기</button>
          </div>
        </div>



        <hr />
      </div>
    );
  }
}

export default ImageEditor;