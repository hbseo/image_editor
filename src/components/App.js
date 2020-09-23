import React, { Component } from 'react';
import { fabric } from 'fabric';
import './App.css'
// import * as Filter from './filter';

class App extends Component {
  constructor(props) {
    super(props);
    this.canvas = null;
    this.saveImage = this.saveImage.bind(this);
  }
  componentDidMount() {
    this.canvas = new fabric.Canvas('canvas', {
      preserveObjectStacking: true,
      height: 1000,
      width: 1000
    });
    this.canvas.backgroundColor = 'grey';
    fabric.Image.fromURL('http://fabricjs.com/assets/pug_small.jpg', img => {
      img.set({left:300, top:100});
      img.scaleToWidth(300);
      this.canvas.add(img);
    }, {crossOrigin: 'Anonymous'});
  }
  saveImage(el) {
    // let myImg = new Image();
    // myImg.crossOrigin = 'Anonymous';
    // myImg.src = this.canvas.toDataURL('image/png');
    let dataURL = this.canvas.toDataURL('image/jpg');
    el.href = dataURL;
    console.log(dataURL);
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
          <button>Filter</button>
          <button>Text</button>
          <a id='save' onClick={this.saveImage} 
            download='myImage.jpg' href=''>Save</a>
          {/* <button id='save' onClick={this.saveImage}>Save</button> */}
        </ul>
        <canvas id='canvas'></canvas>
      </div>
    );
  }
}

export default App;