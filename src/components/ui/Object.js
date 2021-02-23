import React, {Component} from 'react';

export default class Objects extends Component{
  constructor(props){
    super(props);
    this.state = {
      blur : 30, //shadow
      offsetX : 10, //shadow
      offsetY: 10, //shadow
      color : '#000000'//shadow
    }
  }

  componentDidMount(){
    console.log('Object UI Mount');
    this.documentUpdate();
  }
  componentDidUpdate(){
    // console.log('Object UI Update');
    this.documentUpdate();
  }
  componentWillUnmount(){
    console.log('Object UI Unmount');
  }

  documentUpdate = () => {
    if(this.props.object.shadow){
      document.getElementById('shadow_toggle').disabled = false;
      document.getElementById('shadow_toggle').checked = true;

    }
    else{
      document.getElementById('shadow_toggle').disabled = true;
    }
  }

  // ObjectSelection = (object) => {

  // }

  flipObject = (event) => {
    let option = event.target.getAttribute('flip');
    this.props.flipObject(option);
  }

  handleShadowChange = (event) => {
    let change_state = {};
    change_state[event.target.name] = event.target.value
    this.setState(change_state);
    this.props.setShadow({color : 'black', blur : this.state.blur, offsetX : this.state.offsetX, offsetY : this.state.offsetY});
  }

  toggleShadow = (event) => {
    if(event.target.checked){
      this.props.setShadow({color : 'black', blur : this.state.blur, offsetX : this.state.offsetX, offsetY : this.state.offsetY});
    }
    else{
      this.props.removeShadow();
    }
  }

  render(){
    return (
      <div className="sub">
        <div className="sub-title">
            Object ( {this.props.object.type} )
        </div>
        <div className="sub-textmenu">
        <div>
            <input id = "shadow_toggle" type="checkbox" onClick = {this.toggleShadow}></input>
            <label htmlFor='shadow'>
            <span>블러</span>
            <input
              type='range'
              className='shadow'
              id='shadow'
              min='1'
              max='100'
              name='blur'
              step='1'
              value={this.state.blur}
              onChange={this.handleShadowChange}/>
            <span>세로 위치</span>
            <input
              type='range'
              className='shadow'
              id='shadow'
              min='-100'
              max='100'
              name='offsetY'
              step='1'
              value={this.state.offsetY}
              onChange={this.handleShadowChange}/>
            <span>가로 위치</span>
            <input
              type='range'
              className='shadow'
              id='shadow'
              min='-100'
              max='100'
              name='offsetX'
              step='1'
              value={this.state.offsetX}
              onChange={this.handleShadowChange}/>
            </label>
          </div>
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
            <button onClick={this.props.lockScaleRatio}>초기 비율 유지</button>
          </div>
        </div>
      </div>
    );
  }

}