import React, {Component} from 'react';
export default class Image extends Component {
  constructor(props){
    super(props);
  }

  componentDidMount(){
    console.log('Image UI Mount');
  }
  componentDidUpdate(){
    console.log('Image UI Update');
  }
  componentWillUnmount(){
    console.log('Image UI Unmount');
  }
  handleCropImage = (event) => {
    let cropOption = event.target.getAttribute('crop');
    this.props.cropObject(cropOption)
  }
  render(){
    return (
      <div className="sub">
        <div className="sub-title">
            Image ( { this.props.object.type })
        </div>
        <div className="sub-filters">
          <div>
            <button onClick={this.handleCropImage} className = "cropStart" crop="4:3">4:3자르기 시작</button>
            <button onClick={this.handleCropImage} className = "cropStart" crop="16:9">16:9자르기 시작</button>
            <button onClick={this.handleCropImage} className = "cropStart" crop="3:2">3:2자르기 시작</button>
            <button onClick={this.handleCropImage} className = "cropStart" crop="1:1">사이즈 맞게 자르기 시작</button>
          </div>
          <div>
            <button onClick={this.props.cropEndObject} crop="left">자르기 완료</button>
          </div>
        </div>
      </div>
    );
  }

}