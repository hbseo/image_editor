import React, { Component } from 'react';
import { fabric } from 'fabric';
import Login from './Login';
import './App.css'

class App extends Component {
  componentDidMount() {
    const canvas = new fabric.Canvas('canvas', {
      preserveObjectStacking: true,
      height: 100,
      width: 1000
    });
    canvas.backgroundColor = 'grey';
    fabric.Image.fromURL('http://fabricjs.com/assets/pug_small.jpg', img => {
      img.set({left:300, top:100});
      img.scaleToWidth(300);
      canvas.add(img);
    })
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
        </ul>
        <canvas id='canvas'></canvas>

        <hr />
        <Login/>
        <hr />
      </div>
    );
  }
}

export default App;