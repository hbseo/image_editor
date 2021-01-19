import React, { Component } from 'react';
import $ from 'jquery';
import './Save.scss'

class Save extends Component {
  constructor(props) {
    super(props);
    this.state = {
      format : 'png',
      title : '',
    };
  }

  changeFormat = () => {
    let format = $('input[name=format]:checked').val()
    this.setState({format : format});
  }

  saveHandler = () => {
    var json = this.props.canvas;
    fetch('/content/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id : this.props.user_name , title : 'test', data : json})
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      alert('save success');
    })
    .catch(() => {
      alert('error');
    })
  }

  render(){
    const { open, close, save, size, user_name } = this.props;
    let imageSize = <label className="canvas-size">{size().x} X {size().y}</label>
		return(
			<div>
				{open ?
				  <div className = "modal">
						<div className = "saveModal">
              <div className="top-div">
							  <label id="headline">Save {user_name}</label>
                <button id="close" onClick = {close}><i className="fa fa-times" aria-hidden="true"></i></button>
              </div>
              <hr className = "modal-line"></hr>
              <div className="content">
                <label id="option">Format</label>
                <input type="radio" id="png" name="format" value="png" defaultChecked onClick={this.changeFormat}/><label htmlFor="png">png</label>
                <input type="radio" id="jpeg" name="format" value="jpeg" onClick={this.changeFormat}/><label htmlFor="jpeg">jpeg</label>
                { this.state.format === 'jpeg' ? 
                  <div className="quality-div">
                    <label id="option">Quality</label>
                    <input type="radio" id="high" name="quality" value="1.0" defaultChecked/><label htmlFor="high">high</label>
                    <input type="radio" id="medium" name="quality" value="0.6"/><label htmlFor="medium">medium</label>
                    <input type="radio" id="low"  name="quality" value="0.1"/><label htmlFor="low">low</label>
                  </div> : null
                }

              </div>

              <div className = "bottom-div">
                {imageSize} 
							  <button id = "close-button" onClick = {close}>close</button>
							  <button id = "save-button" onClick = {save}>save</button>
							  <button id = "save-button" onClick = {this.saveHandler}><h4>서버</h4></button>
              </div>


						</div>
					</div> : null }
			</div>
		)
  }
}
export default Save;