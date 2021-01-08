import React, { Component } from 'react';
import $ from 'jquery';
import './Save.scss'

class Save extends Component {
  constructor(props) {
    super(props);
    this.state = {
      format : 'png'
    };
  }

  changeFormat = () => {
    let format = $('input[name=format]:checked').val()
    this.setState({format : format});
  }

  render(){
    const { open, close, save, size } = this.props;
    let imageSize = <label className="canvas-size">{size().x} X {size().y}</label>
		return(
			<div>
				{open ?
				  <div className = "modal">
						<div className = "saveModal">
              <div className="top-div">
							  <label id="headline">Save</label>
                <button id="close" onClick = {close}><i class="fa fa-times" aria-hidden="true"></i></button>
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
              </div>


						</div>
					</div> : null }
			</div>
		)
  }
}
export default Save;