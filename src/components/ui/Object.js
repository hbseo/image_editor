import { fabric } from 'fabric';
import React, {Component} from 'react';

export default class Object extends Component{
  constructor(props){
    super(props);
  }

  componentDidMount(){
    console.log('Object UI Mount');
    this.documentUpdate();
  }
  componentDidUpdate(){
    console.log('Object UI Update');
    this.documentUpdate();
  }
  componentWillUnmount(){
    console.log('Object UI Unmount');
  }

  documentUpdate = () => {

  }

  ObjectSelection = (object) => {

  }

  render(){
    return (
      <div className="sub">
        <div className="sub-title">
            Object ( {this.props.object.type} )
        </div>
        <div className="sub-textmenu">
          <div>
            <button onClick={this.props.sendToBack}>맨 뒤로 보내기</button>
          </div>
          <div>
            <button onClick={this.props.sendBackwards}>뒤로 보내기</button>
          </div>
          <div>
            <button onClick={this.props.bringToFront}>맨 앞으로 보내기</button> 
          </div>
          <div>
            <button onClick={this.props.bringForward}>앞으로 보내기</button>
          </div>
          <div>
            <button onClick={this.props.deleteObject}>선택 개체 삭제</button>
          </div>
          <div>
            <button onClick={this.props.deleteAllObject}>모든 객체 삭제</button>
          </div>
          <div>
            <button onClick={this.props.makeGroup}>그룹화</button>
          </div>
          <div>
            <button onClick={this.props.unGroup}>그룹해제</button>
          </div>
          <div>
            <button onClick={this.props.rotateObject} angle='90' > 선택 개체 90도 회전</button>
          </div>
          <div>
            <p>회전</p>
            {/* <input
              type='number'
              name='angle'
              min='-360'
              max='360'
              step='1'
              value={this.state.activeObject.type !== 'not active' ? this.state.activeObject.angle : 0}
              onChange={this.handleAngleChange}
            /> */}
          </div>
          <div>
            <p>확대 및 축소</p>
            {/* <input
              type='number'
              name='scaleX'
              min='1'
              max='200'
              step='1'
              value={this.state.activeObject.scaleX * 100}
              onChange={this.handleScaleXChange}
            />% */}
          </div>
          <div>     
            {/* <input
              type='number'
              name='scaleY'
              min='1'
              max='200'
              step='1'
              value={this.state.activeObject.scaleY * 100}
              onChange={this.handleScaleYChange}
            />% */}
          </div>
          <div>
            <input type='checkbox' onClick={this.props.lockScaleRatio} /> 비율 고정
          </div>
        </div>
      </div>
    );
  }

}