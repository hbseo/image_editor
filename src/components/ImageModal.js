import React, { Component } from 'react';
import i18next from "../locale/i18n";
import { withTranslation } from "react-i18next";
import '../css/ImageModal.scss'

class ImageModal extends Component {
//   constructor(props) {
//     super(props);
//   }

  render(){
    const { open, close } = this.props;
		return(
			<div>
        {open ? 
        <div className = "newimage-modal">
          <div className = "image-modal">
            <div className="top-div">
							<div className="headline">{i18next.t('ImageModal.New')}</div>
              <button className="close" onClick = {close}><i className="fas fa-times"></i></button>
            </div>
            {this.props.children}
          </div>
        </div> : null }
      </div>
		)
  }
}

export default withTranslation()(ImageModal);