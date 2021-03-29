import React, {Component} from 'react';
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
        <div className="sub-filters">
          <div>
              <button onClick={this.addImage}><h2>테스트용 이미지 추가</h2></button>
          </div>
          <div>
              <button onClick={this.props.objectInfo}><h2>오브젝트 정보 출력</h2></button>
              <button onClick={this.props.getCanvasInfo}><h2>캔버스 출력</h2></button>
              <button onClick={this.props.getCanvasBackinfo}><h2>캔버스 배경 크기</h2></button>
          </div>
          <div>
              <button onClick={this.props.openSaveModal}><h2>save</h2></button>
          </div>
          <div>
            <button onClick={this.props.exportCanvas}> 캔버스 export </button>
            <div className="file-input-group">
              <label className="input-file-button" htmlFor="_file">캔버스 import</label>
              <input name="file" type='file' id='_file' onChange={this.props.importCanvas} accept="json" style={{ display: 'none' }}></input>
            </div>
          </div>
          <div>
            <input id="grid-snap" type="checkbox" onClick={this.props.onClickSnap}/><label htmlFor = "grid-snap">그리드 스냅 옵션</label>
            <input id="grid-show" type="checkbox" onClick={this.props.onClickGrid}/><label  htmlFor = "grid-show">그리드 on/off</label>
            <input id="object-snap" type="checkbox" onClick={this.props.onClickObjectSnap}/><label  htmlFor ="object-snap"> 오브젝트 스냅 옵션</label>
          </div>
          
          <button onClick = {this.handleInfo} style={{color : 'black', backgroundColor : 'skyblue'}}>내부 정보 열고닫기</button>
          { this.state.info ? 
            <div>
              <div style={ {color : 'red', padding : '10px'}}>
              {this.props.object.type !== 'not active' ? 
                <div>
                  <p>오브젝트 left : {this.props.object.left}</p>
                  <p>오브젝트 top : {this.props.object.top}</p>
                  <p>오브젝트 scaleX : {this.props.object.scaleX}</p>
                  <p>오브젝트 scaleY : {this.props.object.scaleY}</p>

                  <p> left : {this.props.object.aCoords.tl.x} </p>
                  <p> right : {this.props.object.aCoords.br.x} </p>
                  <p> top : {this.props.object.aCoords.tl.y} </p>
                  <p> bottom : {this.props.object.aCoords.br.y} </p>
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