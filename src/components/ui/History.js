import React, {Component} from 'react';
export default class History extends Component {
  constructor(props){
    super(props);
  }

  componentDidMount(){
    console.log('History UI Mount');
  }
  componentDidUpdate(){
    console.log('History UI Update');
  }
  componentWillUnmount(){
    console.log('History UI Unmount');
  }

  render(){
    return (
      <div className="tooltip">
        History
        <div className="left">
          <p style = {{color : 'black'}}>현재 state : {this.props.currentState.action}</p>
          <hr/>
          {this.props.showUndoStack()}
        </div>
      </div>
    );
  }

}