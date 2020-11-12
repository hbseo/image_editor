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
// import FilterMenu from './FilterMenu';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      angle: 0,   //active object's angle
      filters: [], //active object's filter
      brightness: 0, //active object's brightness
      fontsize: 50, //active object's fontSize
      newimg: false,
      layers: [],
      tri: false,
      rect: false,
      circle: false,
			selected: 'radio-4',
			displayColorPicker: false,
			color: {
				r: '241',
				g: '112',
				b: '19',
				a: '1',
			},
      colorHex : 0,
    }

    this._canvas = null;
    this._canvasImage = null;
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
      const activeObject = this.getActiveObject();
      if(activeObject.type === 'activeSelection') {
        for(let i in activeObject._objects) {
          let object = fabric.util.object.clone(activeObject._objects[i]);
          object.set('top', object.top+5);
          object.set('left', object.left+5);
          this.copiedObjects[i] = object;
        }
      }
      else {
        let object = fabric.util.object.clone(activeObject);
        object.set('top', object.top+5);
        object.set('left', object.left+5);
        this.copiedObject = object;
        // eslint-disable-next-line no-array-constructor
        this.copiedObjects = new Array();
      }
    }
    // ctrl + v
    if((metaKey || ctrlKey) && keyCode === 86) {
      if(this.copiedObjects.length > 0) {
        for(let i in this.copiedObjects) {
          let object = fabric.util.object.clone(this.copiedObjects[i]);
          object.set('top', object.top+5);
          object.set('left', object.left+5);
          this.copiedObjects[i] = object;
          this._canvas.add(this.copiedObjects[i]);
        }
      }
      else if(this.copiedObject) {
        let object = fabric.util.object.clone(this.copiedObject);
        object.set('top', object.top+5);
        object.set('left', object.left+5);
        this.copiedObject = object;
        this._canvas.add(this.copiedObject);
      }
      this._canvas.renderAll();
    }
	}

	_createDomEvent = () => {
		document.addEventListener('mousedown', (event) => {
			if(event.target.tagName !== 'CANVAS'){
				this._canvas.defaultCursor = 'default';
				this.setState({
					newimg : false
				})
			}
		})

		document.addEventListener('keydown',this._onKeydownEvent)
	}

  // 캔버스 이벤트 설정
  _createCanvasEvent = () => {
    this._canvas.on('mouse:down', (event) => {
      
      // 새로운 이미지 추가
      if (this.state.newimg) {
				this.addImage(event.pointer);
				this._canvas.defaultCursor = 'default';
        this.setState({ newimg: false })
      }
      if (this.state.tri) {
        this.addTriangle(event.pointer);
        this.setState({ tri: false });
      }
      else if (this.state.rect) {
        this.addRectangle(event.pointer);
        this.setState({ rect: false });
      }
      else if (this.state.circle) {
        this.addCircle(event.pointer);
        this.setState({ circle: false });
      }

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
			switch(type) {
				case 'image':
					this._imageSelection(this._canvas.getActiveObject());
					break;
				case 'textbox':
					this._textboxSelection(this._canvas.getActiveObject());
					break;
				case 'activeSelection':
					this.switchTools('filter', 'text', true);
					this.setState({
						angle: 0
					});
					break;
				default:
					this.switchTools('filter', 'text', true);
			}
      

      
		});

		this._canvas.on('selection:updated', (event) => {
			let type = this._canvas.getActiveObject().type;
			switch(type) {
				case 'image':
					this._imageSelection(this._canvas.getActiveObject());
					break;
				case 'textbox':
					this._textboxSelection(this._canvas.getActiveObject());
					break;
				case 'activeSelection':
					this.switchTools('filter', 'text', true);
					this.setState({
						angle: 0
					});
					break;
				default:
					this.switchTools('filter', 'text', true);
			}
		});

		this._canvas.on('selection:cleared', (event) => {
			if(!this._canvas.backgroundImage){
        this.switchTools('filter', 'text', true);
			}
			else{
        this.switchTools('text', true);
				this._imageSelection(this._canvas.backgroundImage);
			}
		});
    
    this._canvas.on('object:added', (event) => {
      console.log('object:added');
      this.saveState();
    })
    this._canvas.on('object:modified', (event) => {
      console.log('object:modified');
      this.saveState();
    })
    this._canvas.on('object:skewed', (event) => {
      console.log('object:skewed');
    })
    this._canvas.on('object:removed', (event) => {
      console.log('object:removed');
    })
    this._canvas.on('object:skewing', (event) => {
      console.log('object:skewing');
    })
    this._canvas.on('object:scaling', (event) => {
      console.log('object:scaling');
    })
    this._canvas.on('object:scaled', (event) => {
      console.log('object:scaled');
    })
  }

  saveState = () => {
    if(!this.lock) {
      if(this.stateStack.length === this.maxSize) {
        this.stateStack.shift();
      }
      this.stateStack.push(this.currentState);
      this.currentState = this._canvas.toDatalessJSON();
      // this.redoStack.length = 0;
    }
  }

  undo = () => {
    console.log('undo');
    this.applyState(this.redoStack, this.stateStack.pop());
  }

  redo = () => {
    console.log('redo');
    this.applyState(this.stateStack, this.redoStack.pop());
  }

  applyState = (stack, newState) => {
    console.log('applyState');
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
			brightness: image.filters[8] ? image.filters[8].brightness : 0
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
			angle : text.angle
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

    // console.log("----",this._canvas._activeObject._objects)
    // if(this._canvas._activeObject._objects){
    //   // console.log(this._canvas.getActiveObjects())
    //   // return this._canvas.getActiveObjects();
    //   const original_point_left = this._canvas._activeObject.left;
    //   const original_point_top = this._canvas._activeObject.top;

    //   var group = new fabric.Group(this._canvas._activeObject._objects,{
    //     // originX:'center',
    //     // originY:'center'
    //     left : original_point_left,
    //     top : original_point_top,
    //     angle : 0
    //   });
    //   this._canvas._activeObject.onDeselect();
    //   // group.onDeselect();
    //   group.onSelect();
    //   console.log(group);
    //   return group;
    // //   this._canvas._activeObject = alltogetherObj;
    // //   console.log("adasdf",alltogetherObj);

    // //   return alltogetherObj;
    // }
    // else{
    //   return this._canvas._activeObject;
    // }
  }

  /**
   * Get canvas instance
   * @returns {fabric.Canvas}
   */
  getCanvas() {
    return this._canvas;
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

  addNewImage = () => {
		this._canvas.defaultCursor = 'pointer';
    this.setState({ newimg: true });
  }

  addImage = (pointer) => {
    this.loadImage(this.testUrl, pointer)
      .then((data) => {
				this._canvas.add(data).setActiveObject(data);
        this.setState({ layers: this.state.layers.concat(data) });
        // console.log(data.getSvgSrc());
      })
  }

  addText = () => {
    let text = new fabric.Textbox('Hello world', {
      left: 100, top: 100, fontSize: 50, lockScalingY: true
    });
    this._canvas.add(text).setActiveObject(text);
  }

  addTriangle = (pointer) => {
    let myFigure = new fabric.Triangle({ width: 40, height: 40, left: pointer.x, top: pointer.y, fill: "black" });
    this._canvas.add(myFigure);
    this.setState({ tri: true });
  }

  addRectangle = (pointer) => {
    let myFigure = new fabric.Rect({ width: 40, height: 40, left: pointer.x, top: pointer.y, fill: "black" });
    this._canvas.add(myFigure);
    this.setState({ rect: true });
  }

  addCircle = (pointer) => {
    let myFigure = new fabric.Circle({ radius: 20, left: pointer.x, top: pointer.y, fill: "black" });
    this._canvas.add(myFigure);
    this.setState({ circle: true });
  }

  coloringFigure = (event) => {
    let colorOption = event.target.getAttribute("color");
    let activeObject = this.getActiveObject();
    if (activeObject) {
      this.action['Coloring'].changeColor(activeObject, colorOption, event.target.checked);
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
          this.action['Filter'].applyFilter(activeObject, filterOption, true, brightValue)
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
        this.action['Text'].textObj(activeObject, textOption, true, fontSize)
      })
    }
	}
	
	handleColorChange = (color) => {
    const activeObject = this.getActiveObject();
    if(activeObject) {
      this.action['Fill'].fill(color.hex);
    }
    this.setState({ color: color.rgb, colorHex : color.hex })
	}




  rotateObject = (event) => {
    var changeAngle = event.target.getAttribute('angle');
    var activeObject = this.getActiveObject();

    if (activeObject) {
      this.setState({ angle: (activeObject.angle + Number(changeAngle)) % 360 })
      this.action['Rotation'].setAngle(activeObject.angle + Number(changeAngle));
    }
    else {
      alert('image is not activated')
    }
  }

  filterObject = (event) => {
    var filterOption = event.target.getAttribute('filter');
    var activeObject = this.getActiveObject();

    if (activeObject) {
      this.action['Filter'].applyFilter(activeObject, filterOption, event.target.checked, event.target.value);
    }
    else {
      this.action['Filter'].applyFilter(this._canvas.backgroundImage, filterOption, event.target.checked, event.target.value);
      // alert('image is not activated');
      // event.target.checked = false;
    }

  }

  deleteObject = (event) => {
    this.action['Delete'].deleteObj();
  }

  flipObject = (event) => {
    var activeObject = this.getActiveObject();
    var option = event.target.getAttribute('flip');
    if (activeObject) {
      this.action['Flip'].flip(activeObject, option);
    }
    else {
      this.action['Flip'].flip(null, option);

      // alert('image is not activated');
    }
  }

  cropObject = (event) => {
    let cropOption = event.target.getAttribute('crop');
    let activeObject = this.getActiveObject();
    this.cropImg = activeObject;
    this.action['Crop'].cropObj(activeObject, cropOption);
  }

  cropEndObject = (event) => {
    let cropOption = event.target.getAttribute('crop');
    if(this.cropImg){
      this.action['Crop'].cropObjend(this.cropImg, cropOption);
      this.cropImg = null;
    }
  }

  cropCanvas = () => {
    this.action['Crop'].cropCanvas();
  }

  cropEndCanvas = () => {
    this.action['Crop'].cropEndCanvas();
  }

  textObject = (event) => {
    let textOption = event.target.getAttribute('text');
    let activeObject = this.getActiveObject();

    if (activeObject) {
      this.action['Text'].textObj(activeObject, textOption, event.target.checked, event.target.value);
    }
    else {
      alert('text is not activated');
      event.target.checked = false;
    }
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
    this.setState({ newimg: true })
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

  
  render() {
		const styles = {
			color : {
				// backgroundColor : `rgba(this.state.color.r,this.state.color.g,this.state.color.b,this.state.color.a)`,
				backgroundColor : `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })` ,
				// backgroundColor : this.state.colorHex
			}
		}
    return (
      <div className='App'>
        <h1>Image Editor</h1>
        <div>
          <h5>미구현</h5>
          <button onClick={this.undo}>Undo</button>
          <button onClick={this.redo}>Redo</button>
          {/* <button>Rotate</button>
          <button>Flip</button> */}
          <button>Draw Line</button>
          {/* <button>Figure</button> */}
          <button>Cut</button>
          {/* <button>Text</button> */}
        </div>

        <div>
          <h5>개발자 기능</h5>
          <button onClick={this.addNewImage}>테스트용 이미지 추가</button>
          <button onClick={this.newCanvas}>배경이미지 캔버스로 변경</button>
          <button onClick={this.objectInfo}>오브젝트 정보 콘솔 출력</button>
          <button onClick={this.getCanvasInfo}>캔버스정보</button>


          <p>선택 개체 밝기 값{this.state.brightness}</p>
          <p>선택 개체 각도 값{this.state.angle}</p>
          <h5>텍스트 기능</h5>
					<p>선택 텍스트 폰트크기{this.state.fontsize}</p>
					<p style={styles.color} >컬러 {this.state.color.r} {this.state.color.g} {this.state.color.b} {this.state.color.a} </p>
					<p>{this.state.colorHex}</p>
					<hr />
        </div>

        <ul>


          {/* <button onClick= {this.filterObject} filter="grey">Filter grey </button> */}
          {/* <button onClick= {this.filterObject} filter="vintage" >Filter vintage </button>  */}
          <button onClick={this.deleteObject}>선택 개체 삭제</button>
          <button>|</button>
          <button onClick={this.cropObject} crop="right">자르기 시작</button>
          <button onClick={this.cropEndObject} crop="left">자르기 완료</button>

          <button onClick={this.cropCanvas}>캔버스 자르기 시작</button>
          <button onClick={this.cropEndCanvas}>캔버스 자르기 완료</button>
          <button onClick={this.flipObject} flip="X">Flip x</button>
          <button onClick={this.flipObject} flip="Y">Flip y</button>
          <button>|</button>
          <button onClick={this.addText}>텍스트</button>
          <button onClick={this.rotateObject} angle='90' > 선택 개체 90도 회전</button>
          <button>|</button>
          <button onClick={this.saveImage}> 지금 캔버스 배경색 없이 다운 </button>
          <button>| 각도설정</button>
          <input
            type='number'
            name='angle'
            min='-360'
            max='360'
            step='1'
            value={this.state.angle}
            onChange={this.handleAngleChange}
          >
          </input>
          <button>| 파일 불러오기</button>
          <input type='file' id='_file' onChange={this.fileChange} accept="image/*"></input>
          <div>
        	<button onClick={this.openColorPicker}>color</button>
        	{ this.state.displayColorPicker ? <div>
        	  <div onClick={this.closeColorPicker}/>
        	  <SketchPicker color={ this.state.color } onChange={ this.handleColorChange } />
        	</div> : null }
      	</div>
          <div style={{ border: "solid 1px black" }}>
            <button onClick={this.addTriangle}>삼</button>
            <button onClick={this.addRectangle}>직</button>
            <button onClick={this.addCircle}>원</button>
            <ul>
              <input type='radio' id="radio-1" color='red' onClick={this.coloringFigure} checked={this.state.selected === 'radio-1'} onChange={(e) => this.setState({ selected: e.target.value })} />red
              <input type='radio' id="radio-2" color='yellow' onClick={this.coloringFigure} checked={this.state.selected === 'radio-2'} onChange={(e) => this.setState({ selected: e.target.value })} />yellow
              <input type='radio' id="radio-3" color='green' onClick={this.coloringFigure} checked={this.state.selected === 'radio-3'} onChange={(e) => this.setState({ selected: e.target.value })} />green
              <input type='radio' id="radio-4" color='black' onClick={this.coloringFigure} checked={this.state.selected === 'radio-4'} onChange={(e) => this.setState({ selected: e.target.value })} />black
            </ul>
          </div>
        </ul>
        <ul>
          <h5>필터기능</h5>
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
            onChange={this.handleBrightChange} filter='brightness' />Brightness
        </ul>
        <ul>
          <h5>텍스트 기능</h5>
          <input type='checkbox' className='text' onClick={this.textObject} text='bold' />bold
          <label htmlFor='fontSize'> 글자 크기: </label>
          <input 
            type='number' 
            className='text'
            onChange={this.handlefontSizeChange} 
            text='fontSize'
            name='fontSize'
            min='1'
            value={this.state.fontsize} />
            <label htmlFor='fontfamily'>글꼴: </label>
            <select className='text' name='fontfamily' text='fontfamily' onChange={this.textObject}>
              <option value='Times New Roman'>Times New Roman</option>
              <option value='Georgia'>Georgia</option>
              <option value='serif'>serif</option>
              <option value='VT323'>VT323</option>
            </select>
        </ul>
        {/* <FilterMenu onClick= {this.filterObject}/> */}
        <br />

        <hr />
        <canvas id='canvas' tabIndex='0'></canvas>

        <hr />
        <ul>
          {this.layerThumb()}
        </ul>
        <hr />
        <ImageList onClick={this.onImgUrlChange} />
      </div>
    );
  }
}

export default App;