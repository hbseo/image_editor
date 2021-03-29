import React, {Component} from 'react';
export default class Tools extends Component {
  // constructor(props){
  //   super(props);
  // }

  componentDidMount(){
    console.log('Tools UI Mount');
  }
  componentDidUpdate(){
    console.log('Tools UI Update');
  }
  componentWillUnmount(){
    console.log('Tools UI Unmount');
  }
  addImage = () => {
    this.props.addImage('https://source.unsplash.com/random/500x400');
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
            <button><input type='file' id='_file' onChange={this.props.importCanvas} accept="json"></input>캔버스 import</button>
          </div>
          <div>
            <input id="grid-snap" type="checkbox" onClick={this.props.onClickSnap}/><label htmlFor = "grid-snap">그리드 스냅 옵션</label>
            <input id="grid-show" type="checkbox" onClick={this.props.onClickGrid}/><label  htmlFor = "grid-show">그리드 on/off</label>
            <input id="object-snap" type="checkbox" onClick={this.props.onClickObjectSnap}/><label  htmlFor ="object-snap"> 오브젝트 스냅 옵션</label>
          </div>

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