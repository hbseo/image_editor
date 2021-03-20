import React, {Component} from 'react';
import '../../css/ui/History.scss'
export default class History extends Component {
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
        <div className="history-inner">
          <div>Current state : {this.props.currentState.action}</div>
          {this.props.showUndoStack()}
        </div>
      </div>
    );
  }

}