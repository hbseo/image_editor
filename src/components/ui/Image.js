import React, {Component} from 'react';
import Loading from './Loading';
import '../../css/ui/Image.scss'
export default class Image extends Component {
  constructor(props){
    super(props);
    this.state = { 
      imgURL : '',
    }
    this.url = '';
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

  handleChange = (event) => {
    this.setState({imgURL : event.target.value})
  }

  handleSubmit = (event) => {
    if(event){ event.preventDefault(); }
    this.url = this.state.imgURL;
    this.setState({imgURL : ""});
    console.log("loading");
    this.props.addImage('https://cors-anywhere.herokuapp.com/' + this.url);
  }

  importImage = (event) => {
    if(!event.target.files[0]) { return; }
    new Promise((resolve) => {
      let file = event.target.files[0];
      this.url = URL.createObjectURL(file);
      resolve();
    })
    .then(() => {
      console.log("loading");
			this.props.addImage(this.url);
    })
  }

  render(){
    return (
      <div className="nav-sub-image">
        <div className="sub-title">
            Image ( { this.props.object.type })
        </div>
        <div className="sub-images">
          <div>
            <button onClick={this.handleCropImage} className = "cropStart" crop="4:3">4:3자르기 시작</button>
            <button onClick={this.handleCropImage} className = "cropStart" crop="16:9">16:9자르기 시작</button>
            <button onClick={this.handleCropImage} className = "cropStart" crop="3:2">3:2자르기 시작</button>
            <button onClick={this.handleCropImage} className = "cropStart" crop="1:1">사이즈 맞게 자르기 시작</button>
          </div>
          <div>
            <button onClick={this.props.cropEndObject} crop="left">자르기 완료</button>
          </div>
          <div>
            <button><input type='file' id='_file' onChange={this.importImage} accept="image/*"></input>로컬 이미지 불러오기</button>
          </div>
          <div>
            <form id="imgload" onSubmit={this.handleSubmit}>
              url : <input name="url" value={this.state.imgURL} onChange = {this.handleChange}/>
					    <input type="submit" value="Submit" />
					  </form>
          </div>
        </div>
        {this.props.imgStatus ? <Loading open = {true} /> : null}
      </div>
    );
  }

}