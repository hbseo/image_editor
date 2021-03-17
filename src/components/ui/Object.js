import React, {Component} from 'react';

export default class Objects extends Component{
  constructor(props){
    super(props);
  }

  componentDidMount(){
    // console.log('Object UI Mount');
    this.documentUpdate();
  }
  componentDidUpdate(){
    // console.log('Object UI Update');
    this.documentUpdate();
  }
  componentWillUnmount(){
    // console.log('Object UI Unmount');
  }

  documentUpdate = () => {
    document.getElementById("lockScale").checked = this.props.getLockScale();
  }

  handleScaleXChange = (event) => {
    this.props.scaleXChange(event.target.value);
  }

  handleScaleYChange = (event) => {
    this.props.scaleYChange(event.target.value);
  }

  flipObject = (event) => {
    let option = event.target.getAttribute('flip');
    this.props.flipObject(option);
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
            <button onClick={this.flipObject} flip="X">Flip x</button>
            <button onClick={this.flipObject} flip="Y">Flip y</button>
          </div>
          <div>
            <p>확대 및 축소</p>
            <input
              type='range'
              name='scaleX'
              min='1'
              max='200'
              step='1'
              disabled = {this.props.object.type === 'not active' || this.props.object.type === 'path' ? true : false}
              value={this.props.object.scaleX * 100}
              onChange={this.handleScaleXChange}
            />
            <label>{this.props.object.scaleX * 100}%</label>
          </div>
          <div>     
            <input
              type='range'
              name='scaleY'
              min='1'
              max='200'
              step='1'
              disabled = {this.props.object.type === 'not active' || this.props.object.type === 'path' ? true : false}
              value={this.props.object.scaleY * 100}
              onChange={this.handleScaleYChange}
            />
            <label>{this.props.object.scaleY * 100}%</label>
          </div>
          <div>
            <input type="checkbox" id="lockScale" onClick={this.props.lockScaleRatio} /> 비율 유지?
          </div>
        </div>
      </div>
    );
  }

}