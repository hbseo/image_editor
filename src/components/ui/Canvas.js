import React, {Component} from 'react';
export default class Canvas extends Component{
  constructor(props){
    super(props);
  }

  componentDidMount(){
    console.log('Canvas UI Mount');
  }
  componentDidUpdate(){
    console.log('Canvas UI Update');
  }
  componentWillUnmount(){
    console.log('Canvas UI Unmount');
  }

  render(){
    return (
      <div className="sub">
        <div className="sub-title">
            Canvas ( {this.props.object.type} )
        </div>
        <div className = "sub-iconmenu">
          <div>
            <button onClick = {this.props.resetCanvas}> 리셋 캔버스</button>
          </div>
        </div>
      </div>
    );
  }
}