import React, { Component } from 'react';
import i18next from "../locale/i18n";
import { withTranslation } from "react-i18next";
import '../css/Save.scss'

class Modal extends Component {
  render(){
    const { open, close } = this.props;
		return(
			<div>
				{open ?
				  <div className = "modal">
						<div className = "saveModal">
              <div className="top-div">
                <button onClick = {close}>X</button>
              </div>
              {this.props.children}
						</div>
					</div> : null }
			</div>
		)
  }
}

export default withTranslation()(Modal);