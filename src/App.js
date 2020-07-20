import React, { Component } from 'react';
import Toolbar from './components/js/toolbar';
import Draw from './components/js/draw';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file : '',
      previewURL : ''
    }
  }
  render() {
    let _file, _previewURL = null;
    if(this.state.file !== '') {
      _file = this.state.file;
      _previewURL = this.state.previewURL;
    }
    return (
      <div className="App">
        <Toolbar onInputImg = {function(file, URL) {
          this.setState({
            file : file,
            previewURL : URL
          });
        }.bind(this)}></Toolbar>
        <Draw file={_file} previewURL={_previewURL}></Draw>
      </div>
    );
  }

}

export default App;
