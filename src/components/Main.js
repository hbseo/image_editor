import React, { Component} from 'react';
import { Link } from 'react-router-dom';
import ImageList from './ImageList';


class Main extends Component {
  constructor(props) {
		super(props);
		this.state = {width : 5, height : 5, url :  "", submit : false};
		this.url= "";
		this.image = null;
  }
    
  componentDidMount() {

	}  

  handleSubmit = (event) => {
		if(event){ event.preventDefault(); }

		console.log("submit", this.state.url);
		this.url = this.state.url;
		this.setState({url : "", submit : false, width:0, height : 0});

		this.image = new Image();
		this.image.onload = this.imageFound;
		this.image.onerror = this.imageNotFound;
		this.image.src = this.url;
	}

	imageNotFound = () => {
		this.image = null;
		alert("not valid url");
	}
	imageFound = () => {
		this.setState({submit : true, width:this.image.width, height : this.image.height})
	}
	

	renderLink = (width, height) => {
		if(width ===0 || height === 0){
			return <p>adf</p>
		}
		return <Link to ={{
			pathname : '/edit',
			state : {
				width : width,
				height : height,
			}
		}}>{width}X{height}</Link>
	}

	handleChange = (event) => {
		// console.log(event.target.value);
    let change_state = {};
		change_state[event.target.name] = event.target.value;
		this.url = ""
		this.setState({ submit : false })
    this.setState(change_state);
	}

	onImgUrlChange = (url) => {
		new Promise(resolve => {
			this.setState({url : url});
      resolve();
		})
		.then( () => {
			this.handleSubmit();
		});
  }

	
  render() {
    return (
      <div>
				<div><h2>홈 화면</h2></div>
				<hr />
				<div>
					<h4>빈 캔버스 시작</h4>
					<ul>
						<li>{this.renderLink(800,600)}</li>
						<li>{this.renderLink(360,360)}</li>
						<li>{this.renderLink(1280,720)}</li>
						<li>{this.renderLink(1920,1080)}</li>
						<li>{this.renderLink(512,512)}</li>
						<li>{this.renderLink(1080,1080)}</li>
						<li>{this.renderLink(2048,2048)}</li>
					</ul>
				</div>

				<div>
					
					<input type="number" name="width" value={this.state.width} onChange={this.handleChange} min = "5" />
					<input type="number" name="height" value={this.state.height} onChange={this.handleChange} min = "5"/>
					<span>{this.renderLink(this.state.width,this.state.height)}</span>
					
				</div>

				<hr/>
				<div>
					<h4>랜덤 이미지 불러오기</h4>
					<form id="imgload" onSubmit={this.handleSubmit}>
					url : <input name="url" value={this.state.url} onChange = {this.handleChange}/>
					<input type="submit" value="Submit" />
					<img id="preview" src = {this.url} alt = "no-url"></img>

					</form>

					{
						!this.state.submit ? <p>enter the link</p>
						: <Link to ={{
							pathname : '/edit',
							state : {
								width : this.state.width,
								height : this.state.height,
								url : this.url
							}
						}}>{this.state.width}X{this.state.height}</Link>
					}


				</div>

				<ImageList onClick={this.onImgUrlChange} />
      </div>
    )
  }
}
export default Main;
