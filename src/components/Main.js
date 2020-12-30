import React, { Component} from 'react';
import { Link } from 'react-router-dom';
import ImageList from './ImageList';
import './Main.scss'

class Main extends Component {
  constructor(props) {
		super(props);
		this.state = {width : 5, height : 5, url :  "", submit : false, imgRatio : 100, imgWidth : 0, imgHeight : 0};
		this.url= "";
		this.image = null;
  }
    
  componentDidMount() {
		
	}  

  handleSubmit = (event) => {
		if(event){ event.preventDefault(); }

		console.log("submit", this.state.url);
		this.url = this.state.url;
		this.setState({url : "", submit : false, width:0, height : 0, imgRatio : 100});
		

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
		document.getElementById("imgRatio").disabled = false;
		var ratio = 1;
		if(this.image.width > 2048 || this.image.height > 2048) {
			if(this.image.width > this.image.height){
				ratio = 2048 / this.image.width 
				this.image.width = 2048;
				this.image.height *= ratio
			}
			else{
				ratio = 2048 / this.image.height
				this.image.height = 2048
				this.image.width *= ratio
			}
		}
		this.setState({
			submit : true, 
			width:this.image.width, 
			height : this.image.height, 
			imgRatio : ratio*100,
			imgWidth : this.image.width, 
			imgHeight : this.image.height
		})
	}
	

	renderLink = (width, height) => {
		if(width ===0 || height === 0){
			return <p>no link</p>
		}
		return <div><Link to ={{
			pathname : '/edit',
			state : {
				width : width,
				height : height,
			}
		}}><i className="far fa-square fa-5x canvas-icon"></i></Link>
		<p>{width}X{height}</p></div>
	}

	handleChange = (event) => {
		// console.log(event.target.value);
		document.getElementById("imgRatio").disabled = true;
    	let change_state = {};
		change_state[event.target.name] = event.target.value;
		this.url = ""
		this.setState({ submit : false, imgRatio : 100 })
    	this.setState(change_state);
	}

	handleImageSizeChange = (event) => {
		new Promise((resolve) => {
			if(this.state.imgWidth === 2048 || this.state.imgHeight === 2048){
				return ;
			}
			let ratio = event.target.value;
			let width = Math.round(this.state.imgWidth * (event.target.value / 100));
			let height = Math.round(this.state.imgHeight * (event.target.value / 100));

			if(width > 2048 || height > 2048){
				return ;
			}

			// console.log((event.target.value / 100), width, height);
			resolve({ratio, width, height})
		})
		.then((data) => {
			this.setState({imgRatio : data.ratio, width : data.width, height : data.height});
		})
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
	
	fileChange = (event) => {
    new Promise((resolve) => {
			let file = event.target.files[0];
			this.setState({url : URL.createObjectURL(file) });
      resolve();
    })
    .then(() => {
			this.handleSubmit();
    })
  }

	
  render() {
    return (
      <div>
				<div id="main-title-div">
					<h2 id="main-title">MAIN</h2>
				</div>
				<hr />

				<div id="canvas-template">
					<h4>빈 캔버스 시작</h4>
					<ul className="canvas-list-ul">
						<li className="canvas-list">
							<div id="select-canvas-size">
								{this.renderLink(800,600)}
							</div>
						</li>
						<li className="canvas-list">
							<div id="select-canvas-size">
								{this.renderLink(360,360)}
							</div>
						</li>
						<li className="canvas-list">
							<div id="select-canvas-size">
								{this.renderLink(1280,720)}
							</div>
						</li>
						<li className="canvas-list">
							<div id="select-canvas-size">
								{this.renderLink(1920,1080)}
							</div>
						</li>
						<li className="canvas-list">
							<div id="select-canvas-size">
								{this.renderLink(512,512)}
							</div>
						</li>
						<li className="canvas-list">
							<div id="select-canvas-size">
								{this.renderLink(1080,1080)}
							</div>
						</li>
						<li className="canvas-list">
							<div id="select-canvas-size">
								{this.renderLink(2048,2048)}
							</div>
						</li>
						<li className="canvas-list">
							<div id="select-canvas-size">
								{this.renderLink(600,600)}
							</div>
						</li>
					</ul>
				</div>
				<div>adf</div>
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
						: <div><Link to ={{
							pathname : '/edit',
							state : {
								width : this.state.width,
								height : this.state.height,
								url : this.url,
								ratio : this.state.imgRatio,
							}
						}}><i className="far fa-square fa-5x canvas-icon"></i></Link>
						<p>{this.state.width}X{this.state.height}</p></div>
					}
					<input disabled type="range" name="imgRatio" id="imgRatio" value={this.state.imgRatio} onChange={this.handleImageSizeChange} min = "5" max = "200" step="1" />
					<p>{this.state.imgRatio}</p>
					<hr/>
					<ImageList onClick={this.onImgUrlChange} />
				</div>

				<div>
					<h5>로컬에서 이미지 불러오기</h5>

					<button><input type='file' id='_file' onChange={this.fileChange} accept="image/*"></input>파일 불러오기</button>
				</div>

				
      </div>
    )
  }
}
export default Main;
