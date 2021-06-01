import React, {Component} from 'react';
import '../../css/ui/Tools.scss';
export default class Tools extends Component {
  constructor(props){
    super(props);
    this.state = {
      info : true
    }
  }

  componentDidMount(){
    // console.log('Tools UI Mount');
  }
  componentDidUpdate(){
    // console.log('Tools UI Update');
  }
  componentWillUnmount(){
    // console.log('Tools UI Unmount');
  }
  addImage = () => {
    this.props.addImage('https://source.unsplash.com/random/500x400');
  }

  handleInfo = () => {
    this.setState({info : !this.state.info});
  }

  render(){
    return (
      <div className="sub">
        <div className="sub-title">
            Tools
        </div>
        <div className="sub-tools-menu">
          <div>
              <button onClick={this.props.objectInfo}>오브젝트 정보 출력</button>
              <button onClick={this.props.getCanvasInfo}>캔버스 출력</button>
              <button onClick={this.props.getCanvasBackinfo}>캔버스 배경 크기</button>
          </div>
          <div>
              <button onClick={this.props.openSaveModal}>save</button>
          </div>
          
          <button onClick = {this.handleInfo} style={{color : 'black', backgroundColor : 'skyblue'}}>내부 정보 열고닫기</button>
          { this.state.info ? 
            <div>
              <div style={ {color : 'red', padding : '10px'}}>
              {this.props.object.type !== 'not active' ? 
                <div>
                  <p>object left from center : {this.props.object.left.toFixed(3)}</p>
                  <p>object top from center: {this.props.object.top.toFixed(3)}</p>
                  <p>object scaleX : {this.props.object.scaleX.toFixed(3)}</p>
                  <p>object scaleY : {this.props.object.scaleY.toFixed(3)}</p>
                  <p>object width : {this.props.object.width}</p>
                  <p>object height : {this.props.object.height}</p>
                  
                  <p>object width * scaleX : {(this.props.object.width * this.props.object.scaleX).toFixed(3)}</p>
                  <p>object height * scaleY : {(this.props.object.height * this.props.object.scaleY).toFixed(3)}</p>
                  <p> left : {this.props.object.aCoords.tl.x.toFixed(3)} </p>
                  <p> right : {this.props.object.aCoords.br.x.toFixed(3)} </p>
                  <p> top : {this.props.object.aCoords.tl.y.toFixed(3)} </p>
                  <p> bottom : {this.props.object.aCoords.br.y.toFixed(3)} </p>
                </div> : null}
              </div>

              <div style={ { padding : '10px'}}>
              {this.props.canvas ? 
                <div>
                  <p> 좌측 상단 좌표 = x : {(-this.props.canvasView.x / this.props.zoom)}  y : {(-this.props.canvasView.y / this.props.zoom)}</p>
                  <p> 우측 하단 좌표 = x : { (-this.props.canvasView.x / this.props.zoom)  + (this.props.canvas.width / this.props.zoom) }  
                      y : {(-this.props.canvasView.y / this.props.zoom) + (this.props.canvas.height / this.props.zoom) }</p>

                  {this.props.canvas.backgroundImage ?
                <div>
                  <p>배경 width {this.props.canvas.backgroundImage.width}</p>
                  <p>배경 height {this.props.canvas.backgroundImage.height}</p>
                  <p>배경 scaleX {this.props.canvas.backgroundImage.scaleX}</p>
                  <p>배경 scaleY {this.props.canvas.backgroundImage.scaleY}</p>
                  <p>배경 left {this.props.canvas.backgroundImage.left}</p>
                  <p>배경 top {this.props.canvas.backgroundImage.top}</p>
                </div> : null}
              </div> : null}
            </div>
          </div> : null   
        }


          <div>
            <p>유저 이름 : {this.props.user_name} </p>
            <p>프로젝트 정보 : {this.props.prj_idx} </p>
            <p>저장 유무: {this.props.isSaved ? 'true' : 'false'} </p>           
          </div>
        </div>
      </div>
    );
  }

}