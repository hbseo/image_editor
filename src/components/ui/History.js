import React, {Component} from 'react';
import '../../css/ui/History.scss'
import { withTranslation } from "react-i18next";
class History extends Component {
  // constructor(props){
  //   super(props);
  // }
  componentDidMount(){
    // console.log('History UI Mount');
  }
  componentDidUpdate(){
    // console.log('History UI Update');
  }
  componentWillUnmount(){
    // console.log('History UI Unmount');
  }

  render(){
    return (
      <div className="history">
        {this.props.showUndoStack()}
        <hr/>
        {this.props.showCurrentState()}
      </div>
    );
  }
}
export default withTranslation()(History);