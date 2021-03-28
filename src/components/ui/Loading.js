import React, { Component } from 'react';
import i18next from "../../locale/i18n";
import { withTranslation } from "react-i18next";
import '../../css/Loading.scss'

class Loading extends Component {
  // constructor(props) {
  //   super(props);
  // }
  componentDidMount(){
    console.log('loading........................', new Date().getTime());
  }

  componentDidUpdate(){
    console.log('loading update?........................', new Date().getTime());
  }

  componentWillUnmount(){
    console.log('finish.........................', new Date().getTime());
  }
  render(){
    const { open } = this.props;
		return(
			<div>
				{open === true ?
				  <div className = "modal">
						<div className = "loadingModal">
              				<h1>{i18next.t('ui/loading.Loading')}</h1>
						</div>
					</div> : null }
			</div>
		)
  }
}

export default withTranslation()(Loading);