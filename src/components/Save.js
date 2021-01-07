import React, { Component } from 'react';
import './Save.scss'

class Save extends Component {

	saveImage = () => {

	}
    
  render(){
		const { open, close, save } = this.props;
		return(
			<div>
				{open ?
				  <div className = "modal">
						<div className = "saveModal">
							<button  onClick = {close}>X</button>
							<h1>modal</h1>
							<button onClick = {save}>save</button>
						</div>
					</div> : null }
			</div>
		)
  }
}
export default Save;