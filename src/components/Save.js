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
      body: JSON.stringify({id : this.props.user_name , title : this.state.title, data : json})
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if(data.success && data.prj_idx !== -1){
        alert('save success');
        this.props.getCheckSave(data.prj_idx);
      }
      else{
        alert('error on server');
      }

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
        if(data.success){
          console.log(data);
          alert('update success');
        }
        else{
          alert('error')
        }
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
    // if(this.props.user_name === ""){this.err = true;}
    let imageSize = <label className="canvas-size">{size().x} X {size().y}</label>
		return(
			<div>
				{open ?
				  <div className = "modal">
						<div className = "saveModal">
              <div className="top-div">
							  <div className="headline">Save {user_name} {this.props.prj_idx} </div>
                <button className="close" onClick = {close}>close</button>
              </div>
              <div className="title-container">
					      <input type="text" placeholder=" " className="title-input" id="title-id" name="title-name" value={this.state.title} onChange = {this.handleTitleChange}/>
                <label className="title-placeholder" htmlFor="title-name">Project title</label>
              </div>
              <div className="content">
                <div className="format-box">
                  <div id="option">Format</div>
                  <div className="format-radio">
                    <input type="radio" id="png" name="format" value="png" defaultChecked onClick={this.changeFormat}/><label htmlFor="png">png</label>
                    <input type="radio" id="jpeg" name="format" value="jpeg" onClick={this.changeFormat}/><label htmlFor="jpeg">jpeg</label>
                  </div>
                </div>
                { this.state.format === 'jpeg' ? 
                  <div className="quality-box">
                    <div id="option">Quality</div>
                    <div className="quality-radio">
                      <input type="radio" id="high" name="quality" value="1.0" defaultChecked/><label htmlFor="high">high</label>
                      <input type="radio" id="medium" name="quality" value="0.6"/><label htmlFor="medium">medium</label>
                      <input type="radio" id="low"  name="quality" value="0.1"/><label htmlFor="low">low</label>
                    </div>
                  </div> : null
                }
              </div>

              <div className = "bottom-div">
                {/* {imageSize} */}
							  <button id="save-local" onClick = {this.imageHandler} disabled = {this.state.saveState}>local</button>
							  <button id="save-rename" onClick = {this.saveHandler} disabled = {this.state.saveState}>rename</button>
							  <button id="save-server" onClick = {this.updateHandler} disabled = {this.state.saveState}>server</button>
              </div>
						</div>
					</div> : null }
			</div>
		)
  }
}
export default Save;