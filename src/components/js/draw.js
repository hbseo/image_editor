import React, { Component } from 'react';
import '../css/draw.css';

class Draw extends Component {
  render() {
    let file = null;
    let previewURL = null;
    let i = 0;
    file = this.props.file;
    previewURL = this.props.previewURL;
    let preview = '';
    if(file !== null && file !== undefined) {
      console.log('hi');
      console.log(file);
      preview = <img key={i} src={previewURL} alt="img"></img>
    }
    return(
      <div className='Draw'>
        {preview}
      </div>
    );
  }
}

export default Draw;