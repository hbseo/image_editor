import React, { Component } from 'react';
import $ from 'jquery';
import './Save.scss'

class Save extends Component {
    
  render(){
		const { open, close, save } = this.props;
		return(
			<div>
				{open ?
				  <div className = "modal">
						<div className = "saveModal">
							<button  onClick = {close}>X</button>
							<h1>modal</h1>
              <div>
                <h5>화질</h5>
                <input type="radio" id="high" name="quality" value="1.0" defaultChecked/><label htmlFor="high">high</label>
                <input type="radio" id="medium" name="quality" value="0.6"/><label htmlFor="medium">medium</label>
                <input type="radio" id="low"  name="quality" value="0.1"/><label htmlFor="low">low</label>
              </div>

							<button onClick = {save}>save</button>

						</div>
					</div> : null }
			</div>
		)
  }
}
export default Save;