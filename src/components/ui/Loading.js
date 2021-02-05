import React, { Component } from 'react';
import '../../css/Loading.scss'

class Loading extends Component {
  constructor(props) {
    super(props);
  }
  render(){
    const { open } = this.props;
		return(
			<div>
				{open === true ?
				  <div className = "modal">
						<div className = "loadingModal">
              				<h1>로딩</h1>
						</div>
					</div> : null }
			</div>
		)
  }
}
export default Loading;