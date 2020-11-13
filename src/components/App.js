import React, { Component } from 'react';
import { fabric } from 'fabric';
import { SketchPicker } from 'react-color';
import './App.css'
import Rotation from './Rotation';
import Filter from './Filter';
import ImageList from './ImageList';
import Delete from './Delete';
import Crop from './Crop';
import Coloring from './Coloring';
import Flip from './Flip';
import Text from './Text';
import Fill from './Fill';
import Icon from './Icon';
import Shape from './Shape';

// import FilterMenu from './FilterMenu';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      angle: 0,   //active object's angle
      filters: [], //active object's filter
      brightness: 0, //active object's brightness
      fontsize: 50, //active object's fontSize
      stroke : 0,
      strokeWidth : 0,
      layers: [],
      displayColorPicker: false,
      isDrawingMode: false,
      activeObject : { type : 'not active'},
			color: {
				r: '255',
				g: '255',
				b: '255',
				a: '1',
			},
      colorHex : '#F17013',
    }

    this._canvas = null;
    this._canvasImage = null;
    this._clipboard = null;
    // this.testUrl = 'http://fabricjs.com/assets/pug_small.jpg';
    this.testUrl = 'https://source.unsplash.com/random/500x400';
    this.action = {};
    this.copiedObject = null;
    
    this.cropImg = null;
    // eslint-disable-next-line no-array-constructor
    this.copiedObjects = new Array();

    // redo undo
    this.lock = false;
    this.currentState = null;
    this.stateStack = [];
    this.redoStack = [];
    this.maxSize = 10;
    fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';

    this._createAction();

  }

  componentDidMount() {
    this._canvas = new fabric.Canvas('canvas', {
      preserveObjectStacking: true,
      height: 600,
      width: 1000,
      backgroundColor: 'grey'
    });
		this.switchTools('filter', 'text', true);

		this._createDomEvent();
    this._createCanvasEvent();
    this.layerThumb();

    this.currentState = this._canvas.toDatalessJSON();
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
      this.pasteObject();
    }
	}

	_createDomEvent = () => {
		document.addEventListener('keydown',this._onKeydownEvent)
	}

  // 캔버스 이벤트 설정
  _createCanvasEvent = () => {
    this._canvas.on('mouse:down', (event) => {

      if(this.cropImg){
        if(event.target == null || !(event.target === this.cropImg || event.target.type === "Container")){
          this.action['Crop'].cropObjend(this.cropImg, null);
          this.cropImg = null;
        }
      }

    });


    this._canvas.on('object:rotated', (event) => {
      this.setState({ angle: event.target.angle })
    });

    // 키 입력 이벤트 - mouse:up과 down으로 뭔가를 해보길.
    this._canvas.on('mouse:up', (event) => {
      // console.log('fire', event.target);
    });

    // this._canvas.on('mouse:move', (event) => {
      // console.log(this._canvas.targets);
		// });
		
		this._canvas.on('selection:created', (event) => {
			// 객체 선택됐을시
      let type = this._canvas.getActiveObject().type;
      this.setState({activeObject : this.getActiveObject()});
			switch(type) {
				case 'image':
					this._imageSelection(this._canvas.getActiveObject());
					break;
				case 'textbox':
					this._textboxSelection(this._canvas.getActiveObject());
					break;
				case 'activeSelection': //group using drag
					this.switchTools('filter', 'text', true);
					this.setState({
						angle: 0
					});
					break;
				default:
          this.switchTools('filter', 'text', true);
          this.setState({
            stroke : this.getActiveObject().stroke,
						strokeWidth : this.getActiveObject().stroke ? this.getActiveObject().strokeWidth : 0,
					});
			}
      

      
		});

		this._canvas.on('selection:updated', (event) => {
      let type = this._canvas.getActiveObject().type;
      this.setState({activeObject : this.getActiveObject()});
			switch(type) {
				case 'image':
					this._imageSelection(this._canvas.getActiveObject());
					break;
				case 'textbox':
					this._textboxSelection(this._canvas.getActiveObject());
					break;
				case 'activeSelection': //group using drag
					this.switchTools('filter', 'text', true);
					this.setState({
            angle: 0
					});
					break;
				default:
          this.switchTools('filter', 'text', true);
          this.setState({
            stroke : this.getActiveObject().stroke,
            strokeWidth : this.getActiveObject().stroke ? this.getActiveObject().strokeWidth : 0,
					});
			}
		});

		this._canvas.on('selection:cleared', (event) => {
      this.setState({activeObject : { type : 'not active'}});
			if(!this._canvas.backgroundImage){
        this.switchTools('filter', 'text', true);
			}
			else{
        this.switchTools('text', true);
				this._imageSelection(this._canvas.backgroundImage);
			}
		});
    
    this._canvas.on('object:added', (event) => {
      // console.log('object:added');
      this.saveState();
    })
    this._canvas.on('object:modified', (event) => {
      // console.log('object:modified');
      this.saveState();
    })
    // this._canvas.on('object:skewed', (event) => {
    //   console.log('object:skewed');
    // })
    // this._canvas.on('object:removed', (event) => {
    //   console.log('object:removed');
    // })
    // this._canvas.on('object:skewing', (event) => {
    //   console.log('object:skewing');
    // })
    // this._canvas.on('object:scaling', (event) => {
    //   console.log('object:scaling');
    // })
    // this._canvas.on('object:scaled', (event) => {
    //   console.log('object:scaled');
    // })
  }

  saveState = () => {
    if(!this.lock) {
      if(this.stateStack.length === this.maxSize) {
        this.stateStack.shift();
      }
      this.stateStack.push(this.currentState);
      this.currentState = this._canvas.toDatalessJSON();
      this.redoStack.length = 0;
    }
  }

  undo = () => {
    // console.log('undo');
    if(this.stateStack.length > 0) {
      this.applyState(this.redoStack, this.stateStack.pop());
    }
  }

  redo = () => {
    // console.log('redo');
    if(this.redoStack.length > 0) {
      this.applyState(this.stateStack, this.redoStack.pop());
    }
  }

  applyState = (stack, newState) => {
    // console.log('applyState');
    stack.push(this.currentState);
    this.currentState = newState;
    this.lock = true;
    this._canvas.loadFromJSON(this.currentState, () => {
      this.lock = false;
    });
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
		for(let i=0; i<list.length; i++){
			list[i].checked = !!image.filters[i];
		}
		this.setState({
			angle: image.angle,
      brightness: image.filters[8] ? image.filters[8].brightness : 0,
      stroke : image.stroke,
      strokeWidth : image.stroke ? image.strokeWidth : 0,
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
		this.setState({
			fontsize : text.fontSize,
      angle : text.angle,
      stroke : text.stroke,
      strokeWidth : text.stroke ? text.strokeWidth : 0,
		})
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
    this._register(this.action, new Filter(this));
    this._register(this.action, new Delete(this));
    this._register(this.action, new Crop(this));
    this._register(this.action, new Text(this));
    this._register(this.action, new Coloring(this))
    this._register(this.action, new Flip(this));
    this._register(this.action, new Fill(this));
    this._register(this.action, new Icon(this));
    this._register(this.action, new Shape(this));
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

  getActiveObject() {
    return this._canvas._activeObject;
  }

  /**
   * Get canvas instance
   * @returns {fabric.Canvas}
   */
  getCanvas() {
    return this._canvas;
  }

  copyObject = () => {
    this.getActiveObject().clone((cloned) => {
      this._clipboard = cloned;
    });
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


  loadImage = (url, pointer) => {
    return new Promise(resolve => {
      fabric.Image.fromURL(url, img => {
        img.set({
          angle: 0,
          // originX: "center",
          // originY: "center",
          left: pointer.x,
          top: pointer.y

        });
        // img.scaleToWidth(300);
        resolve(img);
      }, { crossOrigin: 'Anonymous' }
      );
    });
  }

  saveImage = (el) => {
    this._canvas.backgroundColor = null;
    let dataURL = this._canvas.toDataURL({
      format: 'png'
    });
    el.href = dataURL;
    var a = document.createElement("a");
    a.href = dataURL;
    a.setAttribute("download", 'image.png');
    a.click();
    this._canvas.backgroundColor = 'grey';
  }

  fileChange = (event) => {
    new Promise((resolve) => {
      let file = event.target.files[0];
      this.testUrl = URL.createObjectURL(file)
      resolve();
    })
      .then(() => {
        this.setState({ newimg: true });
      })
  }


  addImage = () => {
    let body = document.body;
    this._canvas.defaultCursor = 'pointer';

    body.onclick = (event) => {
      const pointer = { x: event.layerX, y : event.layerY  }
      if(event.target.tagName === 'CANVAS'){
        this.loadImage(this.testUrl, pointer)
        .then((data) => {
          this._canvas.add(data).setActiveObject(data);
          // this.setState({ layers: this.state.layers.concat(data) });
          // console.log(data.getSvgSrc());
        })
      }
      this._canvas.defaultCursor = 'default';
      body.onclick = null;
    }
    
  }

  addText = () => {
    let body = document.body;
    this._canvas.defaultCursor = 'pointer';
    
    body.onclick = (event) => {
      if(event.target.tagName === 'CANVAS'){
        let text = new fabric.Textbox('Hello world', {
          left: event.layerX, top: event.layerY , fontSize: this.state.fontsize, lockScalingY: true
        });
        this._canvas.add(text).setActiveObject(text);
      }
      this._canvas.defaultCursor = 'default';
      body.onclick = null;
    }
  }



  addShape = (event) => {
    let body = document.body;
    let myFigure;
    this._canvas.defaultCursor = 'pointer';

    let type = event.target.getAttribute('type');
    body.onclick = (event) => {
      if(event.target.tagName === 'CANVAS'){
        switch(type) {
          case 'triangle':
            myFigure = new fabric.Triangle({ width: 40, height: 40, left: event.layerX, top: event.layerY, fill: "black" });
            this._canvas.add(myFigure);
            break;
          case 'rectangle':
            myFigure = new fabric.Rect({ width: 40, height: 40, left: event.layerX, top: event.layerY, fill: "black" });
            this._canvas.add(myFigure);
            break;
          case 'circle':
            myFigure = new fabric.Circle({ radius: 20, left: event.layerX, top: event.layerY, fill: "black" });
            this._canvas.add(myFigure);
            break;
          default:
        }
      }
      this._canvas.defaultCursor = 'default';
      body.onclick = null;
    }
  }

  coloringFigure = (event) => {
    let colorOption = event.target.getAttribute("color");
    let activeObject = this.getActiveObject();
    if (activeObject) {
      this.action['Coloring'].changeColor(activeObject, colorOption, event.target.checked);
      this.saveState();
    }
    else {
      alert('select figure');
      event.target.checked = false;
    }
  }

  handleAngleChange = (event) => {
    if (this.getActiveObject()) {
      let change_state = {};
      change_state[event.target.name] = event.target.value;
      new Promise((resolve) => {
        this.setState(change_state);
        resolve();
      })
        .then(() => {
          this.action['Rotation'].setAngle(this.state.angle);
          this.saveState();
        })
    }
    else {
      alert('image is not activated');
    }
  }

  handleBrightChange = (event) => {
    const brightValue = event.target.value
    var filterOption = event.target.getAttribute('filter');
    var activeObject = this.getActiveObject();
    if (this.getActiveObject()) {
      let change_state = {};
      change_state[event.target.name] = event.target.value;

      new Promise((resolve) => {
        this.setState(change_state);
        resolve();
      })
        .then((brightEvent) => {
          this.action['Filter'].applyFilter(activeObject, filterOption, true, brightValue);
          this.saveState();
        })
    }
    else {
      alert('image is not activated');
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
        this.saveState();
      })
    }
    else{
      this.setState({fontsize: fontSize});
    }
	}
	
	handleColorChange = (color) => {
    const activeObject = this.getActiveObject();
    if(activeObject) {
      this.action['Fill'].fill(color.hex);
      this.saveState();
    }
    this.setState({ color: color.rgb, colorHex : color.hex })
  }
  
  
  handleStrokeWidthChange = (event) => {
    this.setState({strokeWidth : event.target.value})
    console.log(event.target.value);
    if(this.getActiveObject()){
      let options = {
        strokeColor : '#ffffff',
        strokeWidth : Number(event.target.value)
      }
      this.action['Shape'].setStroke(this.getActiveObject(), options);
    }
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




  rotateObject = (event) => {
    var changeAngle = event.target.getAttribute('angle');
    var activeObject = this.getActiveObject();

    if (activeObject) {
      this.setState({ angle: (activeObject.angle + Number(changeAngle)) % 360 })
      this.action['Rotation'].setAngle(activeObject.angle + Number(changeAngle));
      this.saveState();
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
      this.saveState();
    }
    else {
      this.action['Filter'].applyFilter(this._canvas.backgroundImage, filterOption, event.target.checked, event.target.value);
      this.saveState();
    }

  }

  deleteObject = (event) => {
    switch(this.state.activeObject.type){
      case 'textbox' : 
        if(this.getActiveObject().selectable){
          this.action['Delete'].deleteObj();
          this.saveState();
        }
        break;
      case 'null' :
        break;
      default :
        this.action['Delete'].deleteObj();
        this.saveState();
    }
  }

  flipObject = (event) => {
    let activeObject = this.getActiveObject();
    let option = event.target.getAttribute('flip');
    if (activeObject) {
      this.action['Flip'].flip(activeObject, option);
      this.saveState();
    }
    else {
      this.action['Flip'].flip(null, option);
      this.saveState();
    }
  }

  cropObject = (event) => {
    let cropOption = event.target.getAttribute('crop');
    let activeObject = this.getActiveObject();
    if(activeObject && activeObject.type === 'image'){
      this.cropImg = activeObject;
      this.action['Crop'].cropObj(activeObject, cropOption);
      this.saveState();
    }
  }

  cropEndObject = (event) => {
    let cropOption = event.target.getAttribute('crop');
    if(this.cropImg){
      this.action['Crop'].cropObjend(this.cropImg, cropOption);
      this.cropImg = null;
      this.saveState();
    }
  }

  cropCanvas = () => {
    this.action['Crop'].cropCanvas();
    this.saveState();
  }

  cropEndCanvas = () => {
    this.action['Crop'].cropEndCanvas();
    this.saveState();
  }

  textObject = (event) => {
    let textOption = event.target.getAttribute('text');
    let activeObject = this.getActiveObject();

    if (activeObject) {
      this.action['Text'].textObj(activeObject, textOption, event.target.checked, event.target.value);
      this.saveState();
    }
    else {
      alert('text is not activated');
      event.target.checked = false;
    }
  }

  addIcon = (event) => {
    const options = {
      type : event.target.getAttribute('type'),
      color : this.state.colorHex,
    }
    this.action['Icon'].addIcon(options);
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

  newCanvas = () => {
    let url = "https://images.unsplash.com/photo-1547586696-ea22b4d4235d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=100"
    this._canvas.clear();
    this._canvas.dispose();

    new Promise(resolve => {
      fabric.Image.fromURL(url, img => {
        img.set({
          
				});
				img.on('scaling', () => {

        })
        resolve(img);
      }, { crossOrigin: 'Anonymous' }
      );
    })
      .then((img) => {
        this._canvas = new fabric.Canvas('canvas', {
          preserveObjectStacking: true,
          height: img.height,
          width: img.width,
          backgroundImage: img,
          backgroundColor: 'grey'
        });
        this.currentState = this._canvas.toDatalessJSON();
        this.lock = false;
        this.stateStack = [];
        this.redoStack = [];
      })
      .then(() => {
				this._createCanvasEvent();
				fabric.util.toArray(document.getElementsByClassName('filter')).forEach(el =>
					el.disabled = false
				)
        this.layerThumb();
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

  getCanvasEventInfo = () => {
    for (const key in this._canvas.__eventListeners){
      console.log(key);
      for ( const i of this._canvas.__eventListeners[key]){
        console.log(i);
      }
    }
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

  sendBackwards = () => {
    if(this.getActiveObject()){
      this._canvas.sendBackwards(this.getActiveObject())
      this._canvas.renderAll();
    }
  }
  sendToBack = () => {
    if(this.getActiveObject()){
      this._canvas.sendToBack(this.getActiveObject())
      this._canvas.renderAll();
    }
  }
  bringForward = () => {
    if(this.getActiveObject()){
      this._canvas.bringForward(this.getActiveObject())
      this._canvas.renderAll();
    }
  }
  bringToFront = () => {
    if(this.getActiveObject()){
      this._canvas.bringToFront(this.getActiveObject())
      this._canvas.renderAll();
    }
  }

  drawing = () => {
      this._canvas.isDrawingMode = !this._canvas.isDrawingMode;
      this._canvas.freeDrawingBrush.color = "purple";
      this._canvas.freeDrawingBrush.width = 10;
  }

  render() {
		const styles = {
			color : {
				backgroundColor : `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })` ,
			}
		}
    return (
      <div className='App'>
        <div id='editor'>
          <canvas id='canvas' tabIndex='0'></canvas>
        </div>
        
        <div id='tool'>
          <div>
            <h5>미구현</h5>
            <button onClick={this.drawing}>Free Drawing</button>
          </div>

          <hr />

          <div>
            <h5>개발자 기능</h5>
            <button onClick={this.addImage}>테스트용 이미지 추가</button>
            <button onClick={this.newCanvas}>배경이미지 캔버스로 변경</button>
            <button onClick={this.objectInfo}>오브젝트 정보 콘솔 출력</button>
            <button onClick={this.getCanvasInfo}>캔버스정보</button>
            <button onClick={this.getCanvasEventInfo}>캔버스 이벤트 정보</button>
            <button onClick={this.convertObjSvg}>클릭된 오브젝트 svg로 변환하기</button>
            <button onClick={this.convertSvg}>svg로 변환하기</button>

            <p>현재 객체 타입 = {this.state.activeObject.type}</p>
            <p>선택 개체 밝기 값 = {this.state.brightness}</p>
            <p>선택 개체 각도 값 = {this.state.angle}</p>
            <p style={styles.color} >컬러 {this.state.color.r} {this.state.color.g} {this.state.color.b} {this.state.color.a} </p>
				  	<p>컬러 헥스 값{this.state.colorHex}</p>
          </div>

          <hr />

          <div>
            <h5>오브젝트 기능</h5>
            <button onClick={this.sendToBack}>맨 뒤로 보내기</button>
            <button onClick={this.sendBackwards}>뒤로 보내기</button>
            <button onClick={this.bringToFront}>맨 앞으로 보내기</button>
            <button onClick={this.bringForward}>앞으로 보내기</button>
            <button onClick={this.deleteObject}>선택 개체 삭제</button>
            <button onClick={this.rotateObject} angle='90' > 선택 개체 90도 회전</button>
            <input
              type='number'
              name='angle'
              min='-360'
              max='360'
              step='1'
              value={this.state.angle}
              onChange={this.handleAngleChange}
            />
          </div>

          <hr />

          <div>
            <h5>텍스트 기능</h5>
            <button onClick={this.addText}>텍스트 추가</button>
				  	<p>선택 텍스트 폰트크기 = {this.state.fontsize}</p>
            <input type='checkbox' className='text' onClick={this.textObject} text='bold' />bold
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
              <option value='Times New Roman'>Times New Roman</option>
              <option value='Georgia'>Georgia</option>
              <option value='serif'>serif</option>
              <option value='VT323'>VT323</option>
            </select>
          </div>

          <hr />

          <div>
            <h5>이미지 기능</h5>
            <button onClick={this.cropObject} crop="right">자르기 시작</button>
            <button onClick={this.cropEndObject} crop="left">자르기 완료</button>

            <button onClick={this.flipObject} flip="X">Flip x</button>
            <button onClick={this.flipObject} flip="Y">Flip y</button>

            <input type='checkbox' className='filter' id='grey' onClick={this.filterObject} filter='grey' />Filter grey
            <input type='checkbox' className='filter' id='invert' onClick={this.filterObject} filter='invert' />Filter invert
            <input type='checkbox' className='filter' id='brownie' onClick={this.filterObject} filter='brownie' />Filter brownie
            <input type='checkbox' className='filter' id='technicolor' onClick={this.filterObject} filter='technicolor' />Filter technicolor
            <input type='checkbox' className='filter' id='polaroid' onClick={this.filterObject} filter='polaroid' />Filter polaroid
            <input type='checkbox' className='filter' id='blackwhite' onClick={this.filterObject} filter='blackwhite' />Filter blackwhite
            <input type='checkbox' className='filter' id='vintage' onClick={this.filterObject} filter='vintage' />Filter vintage
            <input type='checkbox' className='filter' id='sepia' onClick={this.filterObject} filter='sepia' />Filter sepia
            <input
              type='range'
              className='filter'
              id='brightness'
              min='-1'
              max='1'
              name='brightness'
              step='0.01'
              value={this.state.brightness}
              onChange={this.handleBrightChange} filter='brightness'
            />Brightness
          </div>

          <hr />

          <div>
            <h5>도형 기능</h5>
            <div style={{ border: "solid 1px black" }}>
              <button onClick={this.addShape} type="triangle">삼각형</button>
              <button onClick={this.addShape} type="rectangle">직사각형</button>
              <button onClick={this.addShape} type="circle">원</button>
          </div>

          <hr />

          <div>
            <h5>캔버스 기능</h5>
            <button onClick={this.cropCanvas}>캔버스 자르기 시작</button>
            <button onClick={this.cropEndCanvas}>캔버스 자르기 완료</button>
            <button onClick={this.saveImage}> 지금 캔버스 배경색 없이 다운 </button>
            <button><input type='file' id='_file' onChange={this.fileChange} accept="image/*"></input>파일 불러오기</button>
            <button onClick={this.undo}>Undo</button>
            <button onClick={this.redo}>Redo</button>
          </div>

          <hr />

          <div>
            <h5>색깔 : FILL 하는 용도</h5>
            <button onClick={this.openColorPicker}>color</button>
          	{ this.state.displayColorPicker ? <div>
          	  <div onClick={this.closeColorPicker}/>
          	  <SketchPicker color={ this.state.color } onChange={ this.handleColorChange } />
          	</div> : null }

            <h5>테두리 두깨</h5>
            <input
              type='number'
              name='stroke'
              min='0'
              max='100'
              step='1'
              value={this.state.strokeWidth}
              onChange={this.handleStrokeWidthChange}
            />
            </div>
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

          <ImageList onClick={this.onImgUrlChange} />

        </div>

        <hr />
      </div>
    );
  }
}

export default App;