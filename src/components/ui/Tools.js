import React, {Component} from 'react';
export default class Tools extends Component {
  constructor(props){
    super(props);
  }

  componentDidMount(){
    console.log('Tools UI Mount');
  }
  componentDidUpdate(){
    console.log('Tools UI Update');
  }
  componentWillUnmount(){
    console.log('Tools UI Unmount');
  }
  render(){
    return (
      <div className="sub">
        <div className="sub-title">
            Tools
        </div>
        <div className="sub-filters">
          <div>
              <button onClick={this.props.addImage}><h2>테스트용 이미지 추가</h2></button>
          </div>
          <div>
              <button onClick={this.props.objectInfo}><h2>오브젝트 정보 출력</h2></button>
          </div>
        </div>
      </div>
    );
  }

}