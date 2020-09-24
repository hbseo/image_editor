import React, { Component } from 'react';
import { fabric } from 'fabric';
import './App.css'
import Rotation from './Rotation';
import Filter from './filter';
import ImageList from './ImageList';
// import * as Filter from './filter';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      angle : 0,
      newimg : false,
      layers : []
    }
    this.canvas = null;
    this.rotation = new Rotation(this);
    this.filter = new Filter(this);
    this.canvasImage = null;
    this.testUrl = 'http://fabricjs.com/assets/pug_small.jpg';

    this.getRotation = this.getRotation.bind(this);

    
    // this.applyFilter = this.applyFilter.bind(this);
  }

  getRotation() {
    if(this.getActiveObject()) {
      this.rotation.setAngle(90);
    }
    else{
      alert('image is not activated')
    }
  }



  componentDidMount()  {
    this.canvas = new fabric.Canvas('canvas', {
      preserveObjectStacking: true,
      height: 600,
      width: 1000,
      backgroundColor : 'grey'
    });
    this.canvasEvent();

    this.layerThumb();
    console.log('test');


  }

  canvasEvent = () => {
    this.canvas.on('mouse:down', (event) => {
      // console.log('canvas mouse down', event.target);
      console.log(this.canvas._activeObject);
    
      // 객체 선택됬을시
      if(event.target){
        if(this.canvas._activeObject._objects) { // 여러개의 객체 선택됬을시
          // console.log(this.canvas._activeObject._objects)

          this.setState({angle : 0})
        }
        else{
          this.setState({angle : event.target.angle})
        }
      }

      // 새로운 이미지 추가
      if(this.state.newimg) {
        this.addImage(event.pointer);
        // console.log(event)
        this.setState({newimg : false})
      }
    });

    this.canvas.on('object:rotated', (event) => {
      // console.log('object:rotated', event);
      this.setState({angle : event.target.angle})
    });
  }

  getActiveObject(){
    // console.log("----",this.canvas._activeObject._objects)
    // if(this.canvas._activeObject._objects){
    //   // console.log(this.canvas.getActiveObjects())
    //   // return this.canvas.getActiveObjects();
    //   const original_point_left = this.canvas._activeObject.left;
    //   const original_point_top = this.canvas._activeObject.top;

    //   var group = new fabric.Group(this.canvas._activeObject._objects,{
    //     // originX:'center',
    //     // originY:'center'
    //     left : original_point_left,
    //     top : original_point_top,
    //     angle : 0
    //   });
    //   this.canvas._activeObject.onDeselect();
    //   // group.onDeselect();
    //   group.onSelect();
    //   console.log(group);
    //   return group;
    // //   this.canvas._activeObject = alltogetherObj;
    // //   console.log("adasdf",alltogetherObj);

    // //   return alltogetherObj;
    // }
    // else{
    //   return this.canvas._activeObject;
    // }
    return this.canvas._activeObject;

  }

  getCanvas(){
    return this.canvas;
  }

  // applyFilter() {
  //   let obj = this.canvas.getActiveObject();
  //   if(obj) {
  //     if(obj.filters.length === 0) {
  //       obj.filters.push(new fabric.Image.filters.Grayscale());
  //       obj.applyFilters();
  //     }
  //     else {
  //       obj.filters.pop();
  //       obj.applyFilters();
  //     }
  //     this.canvas.renderAll();
  //   }
  //   else {
  //     alert('image is not activated');
  //   }
  // }

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
    // let myImg = new Image();
    // myImg.crossOrigin = 'Anonymous';
    // myImg.src = this.canvas.toDataURL('image/png');
    this.canvas.backgroundColor = null;
    let dataURL = this.canvas.toDataURL({
      format : 'png'
    });
    // console.log(dataURL);
    el.href = dataURL;
    var a = document.createElement("a");
    a.href = dataURL;
    a.setAttribute("download", 'image.png');
    a.click();
    this.canvas.backgroundColor = 'grey';

    
  }


  addImage = (pointer) => {
    this.loadImage(this.testUrl, pointer)
    .then((data) => {
      this.canvas.add(data);
      this.setState({ layers : this.state.layers.concat(data)});
      // console.log(data.getSvgSrc());
    })
  }

  handleAngleChange = (event) => {
    let change_state = {};
    change_state[event.target.name] = event.target.value;

    new Promise((resolve) => {
      this.setState(change_state);
      resolve();
    })
    .then( () => {
      if(this.getActiveObject()) {
        this.rotation.setAngle(this.state.angle);
      }
      else{
        alert('image is not activated')
      }
    })
  }


  addNewImage = () => {
    this.testUrl = 'http://fabricjs.com/assets/pug_small.jpg';
    this.setState({newimg : true});
  }

  layerThumb = () => {
    var layer_list = null;
    if(this.canvas){
      // console.log("------------------", this.canvas._objects);
      
      layer_list= this.canvas._objects.map( obj => <li key={obj.cacheKey}><img src={obj.getSvgSrc()} alt="" height="10%" width="10%"/></li>)
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
          <button onClick= {this.filter.applyFilter}>Filter</button>
          <button>Text</button>
          <button onClick = {this.getRotation} > 90 degree rotate</button>
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
        </ul>
        <canvas id='canvas'></canvas>

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