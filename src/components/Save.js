import React, { Component } from 'react';
import $ from 'jquery';
import '../css/Save.scss'

class Save extends Component {
  constructor(props) {
    super(props);
    this.state = {
      format : 'png',
      title : '',
      saveState : true
    };
    this.err = false;
  }

  changeFormat = () => {
    let format = $('input[name=format]:checked').val()
    this.setState({format : format});
  }

  saveHandler = () => {
    if(this.props.user_name === ""){alert('server err'); return;}
    var json = this.props.canvas;
    fetch('/content/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id : this.props.user_name , title : 'test', data : json})
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      alert('save success');
      this.props.getCheckSave(data.prj_idx);
    })
    .catch(() => {
      alert('error');
    })
  }

  updateHandler = () => {
    if(this.props.isSaved && this.props.prj_idx > 0){
      var json = this.props.canvas;
      fetch('/content/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({id : this.props.user_name , prj_idx : this.props.prj_idx, data : json})
      })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        alert('update success');
      })
      .catch(() => {
        alert('error');
      })
    }
    else{
      this.saveHandler();
    }
  }

  handleTitleChange = (event) => {
    new Promise((resolve) => {
      this.setState({ title : event.target.value});
      resolve();
    })
    .then(() => {
      if(this.state.title === ""){
        this.setState({ saveState : true});
      }
      else{
        this.setState({ saveState : false});
      }
    })
    
  }

  imageHandler = () => {
    this.props.save(this.state.title);
    this.setState({title : "", saveState : true});
  }

  render(){
    const { open, close, size, user_name } = this.props;
    if(this.props.prj_idx === -1){this.err = true;}
    let imageSize = <label className="canvas-size">{size().x} X {size().y}</label>
		return(
			<div>
				{open ?
				  <div className = "modal">
						<div className = "saveModal">
              <div className="top-div">
							  <label id="headline">Save {user_name} {this.props.prj_idx} </label>
                <button id="close" onClick = {close}><i className="fa fa-times" aria-hidden="true"></i></button>
              </div>
              <hr className = "modal-line"></hr>
              <div className="title-input">
					      <input id = "title" name="title" value={this.state.title} onChange = {this.handleTitleChange}/>
              </div>
              <div className="content">
                <label id="option">Format</label>
                <input type="radio" id="png" name="format" value="png" defaultChecked onClick={this.changeFormat}/><label htmlFor="png">png</label>
                <input type="radio" id="jpeg" name="format" value="jpeg" onClick={this.changeFormat}/><label htmlFor="jpeg">jpeg</label>
                { this.state.format === 'jpeg' ? 
                  <div className="quality-div">
                    <label id="option">Quality</label>
                    <input type="radio" id="high" name="quality" value="1.0" defaultChecked/><label htmlFor="high">high</label>
                    <input type="radio" id="medium" name="quality" value="0.6"/><label htmlFor="medium">medium</label>
                    <input type="radio" id="low"  name="quality" value="0.1"/><label htmlFor="low">low</label>
                  </div> : null
                }

              </div>

              <div className = "bottom-div">
                {imageSize} 
							  <button id = "close-button" onClick = {close}>close</button>
							  <button id = "save-image-button" onClick = {this.imageHandler} disabled = {this.state.saveState}>이미지로 저장</button>
							  <button id = "save-button" onClick = {this.saveHandler} disabled = {this.err}><h4>다른이름으로 저장</h4></button>
							  <button id = "save-button" onClick = {this.updateHandler} disabled = {this.err}><h4>서버 저장</h4></button>
              </div>


						</div>
					</div> : null }
			</div>
		)
  }
}
export default Save;