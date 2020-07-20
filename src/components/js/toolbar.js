import React, { Component } from 'react';
import '../css/toolbar.css';

class Toolbar extends Component {
  render() {
    return(
      <div>
        <h1>테스트</h1>
        <input type="file" 
          placeholder="input"
          name="img"
          onChange={(e) => {
            e.preventDefault();
            let _previewURL = '';
            let _file = '';
            let reader = new FileReader();
            let file = e.target.files[0];
            reader.readAsDataURL(file);
            reader.onload = (e) => {
              _file = file;
              _previewURL = e.target.result;
              this.props.onInputImg(_file, _previewURL);
            }
          }}>
        </input>
      </div>
    );
  }
}

export default Toolbar;