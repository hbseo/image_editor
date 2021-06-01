import React, { Component } from 'react';
import i18next from "../locale/i18n";
import { withTranslation } from "react-i18next";
import $ from 'jquery';
import '../css/Save.scss'

class Save extends Component {
  constructor(props) {
    super(props);
    this.state = {
      format : 'png',
      title : '',
      saveState : true // true이면 저장 불가능, false이면 저장 가능
    };
    this.err = false;
    this.loginstat = false;
  }

  changeFormat = () => {
    let format = $('input[name=format]:checked').val()
    this.setState({format : format});
  }

  saveHandler = () => {
    // 다른이름으로 저장 : 무조건 새로운 프로젝트로 저장
    if(this.state.title.length > 25) {
      alert(i18next.t('Save.TooLong'));
      return;
    }
    if(this.props.user_name === ""){
      alert(i18next.t('Save.Error on server')); 
      return;
    }

    var json = this.props.canvas;
    // console.log(this.props.canvas)
    fetch('/content/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id : this.props.user_name , title : this.state.title, data : json})
    })
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      if(data.success && data.prj_idx !== -1){
        alert(i18next.t('Save.Save') + ' ' + i18next.t('Save.Success'));
        this.props.getCheckSave(data.prj_idx);
        this.props.close();
      }
      else{
        alert(i18next.t('Save.Error on server'));
      }

    })
    .catch((error) => {
      alert(i18next.t('Save.Error'));
      console.log(error)
    })
  }

  updateHandler = () => {
    // 저장 : 이미 저장되어 있다면, 업데이트를 해주고, 아니면 saveHandler
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
          // console.log(data);
          alert(i18next.t('Save.Update') + ' '+ i18next.t('Save.Success'));
          this.props.getCheckSave(data.prj_idx);
          this.props.close();
        }
        else{
          alert(i18next.t('Save.Error'))
        }
      })
      .catch((error) => {
        alert(i18next.t('Save.Error'));
        console.log(error)
      })
    }
    else{
      this.saveHandler();
    }
  }

  handleTitleChange = (event) => {
    new Promise((resolve) => {
      let pattern = /[^a-zA-Z-_0-9]/g;
      let value = event.target.value;
      if(value.length > 0 && value.match(pattern)) value = value.replace(pattern, "");
      this.setState({ title : value});
      resolve();
    })
    .then(() => {
      if(this.state.title.length === 0 || this.state.title.length > 25){
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
    this.props.close();
  }

  render(){
    const { open, close, user_name } = this.props;
    // if(this.props.user_name === ""){this.err = true;}
    // let imageSize = <label className="canvas-size">{size().x} X {size().y}</label>
		return(
			<div>
				{open ?
				  <div className = "save-modal">
						<div className = "saveModal">
              <div className="top-div">
							  <div className="headline">{i18next.t('Save.Save')}</div>
                <button className="close" onClick = {close}>{i18next.t('Save.Close')}</button>
              </div>
              <div className="title-container">
					      <input type="text" placeholder=" " className="title-input" id="title-id" name="title-name" maxLength="25" value={this.state.title} onChange = {this.handleTitleChange}/>
                <label className="title-placeholder" htmlFor="title-name">{i18next.t('Save.Title')}</label>
              </div>
              <div className="content">
                <div className="format-box">
                  <div id="option">{i18next.t('Save.Format')}</div>
                  <div className="format-radio">
                    <input type="radio" id="png" name="format" value="png" defaultChecked onClick={this.changeFormat}/><label htmlFor="png">png</label>
                    <input type="radio" id="jpeg" name="format" value="jpeg" onClick={this.changeFormat}/><label htmlFor="jpeg">jpeg</label>
                  </div>
                </div>
                { this.state.format === 'jpeg' ? 
                  <div className="quality-box">
                    <div id="option">{i18next.t('Save.Quality')}</div>
                    <div className="quality-radio">
                      <input type="radio" id="high" name="quality" value="1.0" defaultChecked/><label htmlFor="high">{i18next.t('Save.High')}</label>
                      <input type="radio" id="medium" name="quality" value="0.6"/><label htmlFor="medium">{i18next.t('Save.Medium')}</label>
                      <input type="radio" id="low"  name="quality" value="0.1"/><label htmlFor="low">{i18next.t('Save.Low')}</label>
                    </div>
                  </div> : null
                }
              </div>
              {user_name === '' && !this.loginstat ? 
                <div className="bottom-div">
                  <div className="not-registerd">
                    <button id="save-local" onClick = {this.imageHandler} disabled = {this.state.saveState}>{i18next.t('Save.Saveimage')}</button>
                  </div>
                </div> :
                <div className="bottom-div">
                  <div className="registered">
                    <button id="save-local" onClick = {this.imageHandler} disabled = {this.state.saveState}>{i18next.t('Save.Saveimage')}</button>
                    <button id="save-rename" onClick = {this.saveHandler} disabled = {this.state.saveState}>{i18next.t('Save.Save as')}</button>
                    <button id="save-server" onClick = {this.updateHandler} disabled = {!this.props.isSaved}>{i18next.t('Save.Save on server')}</button>
                  </div>
                </div>
              }
						</div>
					</div> : null }
			</div>
		)
  }
}

export default withTranslation()(Save);