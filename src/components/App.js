import React, { Component } from 'react';
import { fabric } from 'fabric';
import './App.css'
import Rotation from './Rotation';
import Filter from './Filter';
import ImageList from './ImageList';
import Delete from './Delete';
import FilterMenu from './FilterMenu';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      angle : 0,   //active object's angle
      filters : [], //active object's filter
      newimg : false,
      layers : []
    }

    this._canvas = null; 
    this._canvasImage = null;
    this.testUrl = 'http://fabricjs.com/assets/pug_small.jpg';
    this.action = {};



    this._createAction();

  }

  componentDidMount()  {
    this._canvas = new fabric.Canvas('canvas', {
      preserveObjectStacking: true,
      height: 600,
      width: 1000,
      backgroundColor : 'grey'
    });
    
    this._createCanvasEvent();
    this.layerThumb();
  }

  // 캔버스 이벤트 설정
  _createCanvasEvent = () => {
    this._canvas.on('mouse:down', (event) => {
      // console.log(this._canvas._activeObject);
    
      // 객체 선택됬을시
      if(event.target){
        if(this._canvas._activeObject._objects) { // 여러개의 객체 선택됬을시
          this.setState({angle : 0})
        }
        else{
          this.setState({angle : event.target.angle, filters : event.target.filters})
          // console.log(event.target.filters)

        }
      }

      // 새로운 이미지 추가
      if(this.state.newimg) {
        this.addImage(event.pointer);
        this.setState({newimg : false})
      }


      
    });


    this._canvas.on('object:rotated', (event) => {
      this.setState({angle : event.target.angle})
    });

    // 키 입력 이벤트 - mouse:up과 down으로 뭔가를 해보길.
    this._canvas.on('mouse:up', (event) => {
      // console.log('fire', event.target);
    });

    this._canvas.on('mouse:move', (event) => {
      // console.log(this._canvas.targets);
    });


  }

  /**
   * create Action List
   * @private
   */
  _createAction = () => {
    this._register(this.action,  new Rotation(this));
    this._register(this.action,  new Filter(this));
    this._register(this.action,  new Delete(this));
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

  getActiveObject(){
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
  getCanvas(){
    return this._canvas;
  }


  loadImage = (url, pointer) => {
    return new Promise(resolve => {
      fabric.Image.fromURL(url, img => {
        img.set({
          angle:0,
          originX: "center",
          originY: "center",
          left : pointer.x,
          top : pointer.y

        });
        img.scaleToWidth(300);
        resolve(img);
      }, {crossOrigin: 'Anonymous'}
      );
    }); 
  }

  saveImage = (el) => {
    this._canvas.backgroundColor = null;
    let dataURL = this._canvas.toDataURL({
      format : 'png'
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
      this.setState({newimg : true});  
    })
  }

  addNewImage = () => {
    this.testUrl = 'http://fabricjs.com/assets/pug_small.jpg';
    this.setState({newimg : true});
  }

  addImage = (pointer) => {
    this.loadImage(this.testUrl, pointer)
    .then((data) => {
      this._canvas.add(data);
      this.setState({ layers : this.state.layers.concat(data)});
      // console.log(data.getSvgSrc());
    })
  }

  handleAngleChange = (event) => {
    if(this.getActiveObject()) {
      let change_state = {};
      change_state[event.target.name] = event.target.value;
      new Promise((resolve) => {
        this.setState(change_state);
        resolve();
      })
      .then( () => {
        this.action['Rotation'].setAngle(this.state.angle);
      })
    }
    else{
      alert('image is not activated');
    }
  }






  rotateObject = (event) => {
    var changeAngle = event.target.getAttribute('angle');
    var activeObject = this.getActiveObject();

    if(activeObject) {
      this.setState({angle : (activeObject.angle + Number(changeAngle)) % 360})
      this.action['Rotation'].setAngle(activeObject.angle + Number(changeAngle));
    }
    else{
      alert('image is not activated')
    }
  }

  filterObject = (event) => {
    var filterOption = event.target.getAttribute('filter');
    var activeObject = this.getActiveObject();

    if(activeObject) {
      this.action['Filter'].applyFilter(activeObject, filterOption, event.target.checked, event.target.value);
    }
    else{
      alert('image is not activated');
      event.target.checked = false;
    }
    
  }

  deleteObject = (event) => {
    this.action['Delete'].deleteObj();
  }

  layerThumb = () => {
    var layer_list = null;
    if(this._canvas){
      layer_list= this._canvas._objects.map( obj => <li key={obj.cacheKey}><img src={obj.getSvgSrc()} alt="" height="10%" width="10%"/></li>)
    }
    return layer_list
  }

  onImgUrlChange = (url) => {
    this.testUrl = url;
    this.setState({newimg : true})
  }

  render() {
    return(
      <div className='App'>
        <h1>Image Editor</h1>

        <ul>
          <button>Undo</button>
          <button>Redo</button>
          
          <button>Rotate</button>
          <button>Flip</button>
          <button>Draw Line</button>
          <button>Figure</button>
          <button>Cut</button>
          <button>Text</button>
          
          {/* <button onClick= {this.filterObject} filter="grey">Filter grey </button> */}
          {/* <button onClick= {this.filterObject} filter="vintage" >Filter vintage </button>  */}
          <button onClick = {this.deleteObject}>Delete</button>
          <button onClick = {this.rotateObject} angle='90' > 90 degree rotate</button>
          <button onClick = {this.addNewImage}>add image from url</button>
          <button onClick = {this.saveImage}> downlaod </button>
          <input
            type='number'
            name='angle'
            min='-360'
            max='360'
            step='1'
            value={this.state.angle}
            onChange = {this.handleAngleChange}
          >
          </input>
          <input type='file' id='_file' onChange={this.fileChange}></input>
        </ul>
        <ul>
          <input type='checkbox' onClick= {this.filterObject} filter='grey'/>Filter grey
          <input type='checkbox' onClick= {this.filterObject} filter='invert'/>Filter invert
          <input type='checkbox' onClick= {this.filterObject} filter='vintage' />Filter vintage
          <input 
            type='range' 
            min='-1'
            max='1'
            step='0.01'
            defaultValue='0'
            onInput= {this.filterObject} filter='brightness' />Brightness
        </ul>
        {/* <FilterMenu onClick= {this.filterObject}/> */}
        <br/>

        <hr/>
        <canvas id='canvas' tabIndex='0'></canvas>

        <hr />
        <ul>
          {this.layerThumb()}
        </ul>
        <hr />
        <ImageList onClick = {this.onImgUrlChange} />
      </div>
    );
  }
}

export default App;