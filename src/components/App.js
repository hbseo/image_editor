import React, { Component } from 'react';
import { fabric } from 'fabric';
import './App.css'
import Rotation from './Rotation';
import Filter from './Filter';
import ImageList from './ImageList';
import Delete from './Delete';
import Crop from './Crop';
import Flip from './Flip';

// import FilterMenu from './FilterMenu';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      angle : 0,   //active object's angle
      filters : [], //active object's filter
      brightness : 0, //active object's brightness
      newimg : false,
      layers : []
    }

    this._canvas = null; 
    this._canvasImage = null;
    // this.testUrl = 'http://fabricjs.com/assets/pug_small.jpg';
    this.testUrl = 'https://images.unsplash.com/photo-1601388354919-cd320b26f39b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE2NjAxMX0';
    
    this.action = {};



    this._createAction();

  }

  componentDidMount()  {
    this._canvas = new fabric.Canvas('canvas', {
      preserveObjectStacking: true,
      height: 500,
      width: 500,
      backgroundColor : 'grey'
    });
    
    this._createCanvasEvent();
    this.layerThumb();
  }

  // 캔버스 이벤트 설정
  _createCanvasEvent = () => {
    this._canvas.on('mouse:down', (event) => {
      console.log(this._canvas)
      // 객체 선택됐을시
      if(event.target){
        if(this._canvas._activeObject._objects) { // 여러개의 객체 선택됐을시
          this.setState({angle : 0})
          // 여러객체가 선택되었을 경우 필터 버튼 막음
          let list, index;
          list = document.getElementsByClassName('filter');
          for(index = 0; index< list.length; index++) {
            list[index].setAttribute('disabled', true);
          }
        }
        else{
          if(event.target.hasOwnProperty('text')) {
            console.log('this is text!');
          }
          else {
            this.setState({
              angle : event.target.angle, 
              filters : event.target.filters,
              brightness : event.target.filters[5] ?  event.target.filters[5].brightness : 0
            })
            // 하나의 객체가 선택되었을 경우 필터 버튼 뚫어줌
            let list, index;
            list = document.getElementsByClassName('filter');
            for(index = 0; index< list.length; index++) {
              list[index].removeAttribute('disabled');
            }
            // 필터 체크 여부 실시간 변경 ( 미완성 )
            if(event.target.filters.length !== 0) {
              console.log(event.target.filters)
            }
            else {
              console.log();
            }
          }
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
    this._register(this.action,  new Crop(this));
    this._register(this.action,  new Flip(this));


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
    // this.testUrl = 'http://fabricjs.com/assets/pug_small.jpg';
    this.testUrl = 'https://images.unsplash.com/photo-1601388354919-cd320b26f39b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE2NjAxMX0';

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

  addText = () => {
    let text = new fabric.Text('Hello world', {left:100, top:100});
    this._canvas.add(text);
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

  handleBrightChange = (event) => {
    const brightValue = event.target.value
    var filterOption = event.target.getAttribute('filter');
    var activeObject = this.getActiveObject();
    if(this.getActiveObject()) {
      let change_state = {};
      change_state[event.target.name] = event.target.value;

      new Promise((resolve) => {
        this.setState(change_state);
        resolve();
      })
      .then( (brightEvent) => {
        this.action['Filter'].applyFilter(activeObject, filterOption, true, brightValue)
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

  flipObject = (event) => {
    var activeObject = this.getActiveObject();
    var option = event.target.getAttribute('flip');
    if(activeObject) {
      this.action['Flip'].flip(activeObject, option);
    }
    else{
      this.action['Flip'].flip(null, option);

      // alert('image is not activated');
    }
  }

  deleteObject = (event) => {
    this.action['Delete'].deleteObj();
  }

  cropObject = (event) => {
    var cropOption = event.target.getAttribute('crop');
    var activeObject = this.getActiveObject();

    if(activeObject) {
      this.action['Crop'].cropObj(this.getActiveObject(), cropOption);
    }
    else{
      this.action['Crop'].cropObj(null, cropOption);
      // alert('image is not activated');
    }
  }

  layerThumb = () => {
    var layer_list = null;
    // if(this._canvas){
    //   layer_list= this._canvas._objects.map( obj => <li key={obj.cacheKey}><img src={obj.getSvgSrc()} alt="" height="10%" width="10%"/></li>)
    // }
    return layer_list
  }

  onImgUrlChange = (url) => {
    this.testUrl = url;
    this.setState({newimg : true})
  }

  newCanvas = () => {
    var url = "https://images.unsplash.com/photo-1547586696-ea22b4d4235d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=100"
    this._canvas.clear();
    this._canvas.dispose();
    
    new Promise(resolve => {
      fabric.Image.fromURL(url, img => {
        img.set({

        });
        resolve(img);
      }, {crossOrigin: 'Anonymous'}
      );
    })
    .then((img) => {
      this._canvas = new fabric.Canvas('canvas', {
        preserveObjectStacking: true,
        height: img.height,
        width: img.width,
        backgroundImage : img,
        backgroundColor : 'red'
      });
    })
    .then(() => {
      this._createCanvasEvent();
      this.layerThumb();
    })
    

    

  }

  render() {
    return(
      <div className='App'>
        <h1>Image Editor</h1>
        <div>
          <h5>미구현</h5>
          <button>Undo</button>
          <button>Redo</button>
          <button>Rotate</button>
          
          <button>Draw Line</button>
          <button>Figure</button>
          <button>Cut</button>
          <button>Text</button>
        </div>

        <div>
          <h5>개발자 기능</h5>
          <button onClick = {this.addNewImage}>테스트용 이미지 추가</button>
          <button onClick = {this.newCanvas}>배경이미지 캔버스로 변경</button>

          <p>선택 개체 밝기 값{this.state.brightness}</p>
          <p>선택 개체 각도 값{this.state.angle}</p>

          <hr />
        </div>

        <ul>
          
          
          {/* <button onClick= {this.filterObject} filter="grey">Filter grey </button> */}
          {/* <button onClick= {this.filterObject} filter="vintage" >Filter vintage </button>  */}
          <button onClick = {this.flipObject} flip = "X">Flip x</button>
          <button onClick = {this.flipObject} flip = "Y">Flip y</button>

          <button onClick = {this.deleteObject}>선택 개체 삭제</button>
          <button>|</button>
          <button onClick = {this.cropObject} crop="right">선택 개체 오른쪽 반 자르기</button>
          <button onClick = {this.cropObject} crop="left">선택 개체 왼쪽 반 자르기</button>
          <button>|</button>
          <button onClick = {this.addText}>텍스트</button>
          <button onClick = {this.rotateObject} angle='90' > 선택 개체 90도 회전</button>
          <button>|</button>
          <button onClick = {this.saveImage}> 지금 캔버스 배경색 없이 다운 </button>
          <button>| 각도설정</button>
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
          <button>| 파일 불러오기</button>
          <input type='file' id='_file' onChange={this.fileChange} accept="image/*"></input>
        </ul>
        <ul>
          <input type='checkbox' className='filter' id='grey' onClick= {this.filterObject} filter='grey'/>Filter grey
          <input type='checkbox' className='filter' id='invert' onClick= {this.filterObject} filter='invert'/>Filter invert
          <input type='checkbox' className='filter' id='vintage' onClick= {this.filterObject} filter='vintage' />Filter vintage
          <input 
            type='range'
            className='filter'
            id='brightness'
            min='-1'
            max='1'
            name = 'brightness'
            step='0.01'
            value = {this.state.brightness}
            onChange= {this.handleBrightChange} filter='brightness' />Brightness
          
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