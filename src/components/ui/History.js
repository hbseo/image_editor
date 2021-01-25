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
          <p style = {{color : 'black'}}>{this.props.currentState.action}</p>
          
          {this.props.showUndoStack()}
        </div>
      </div>
    );
  }

}