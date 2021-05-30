import React, { Component } from 'react';
import i18next from "../locale/i18n";
import { withTranslation } from "react-i18next";

class Find_password extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      answer: ''
    }
    this.question = null;
  }
  findHandler = (e) => {
    const { name, value } = e.target;
    if (name === 'question') {
      this.question = value;
      document.getElementById("options-view-button").checked = false;
    }
    else {
      this.setState({ [name]: value });
    }
  }
  findClickHandler = (e) => {
    e.preventDefault();
    if(this.state.id === '') {
      alert(i18next.t("Find_Password.Input Id"));
      return;
    }
    if(this.state.answer === '') {
      alert(i18next.t("Find_Password.Answer"));
      return;
    }
    if(this.question === null) {
      alert(i18next.t("Find_Password.Choose"));
      return;
    }
    const {id, answer} = this.state;
    const question = this.question;
    fetch('/auth/findPassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id, question, answer})
    })
    .then((res) => res.json())
    .then((data) => {
      if(data.msg === 'success') {
        alert(`${i18next.t("Find_Password.Temp")}: `+data.password);
        window.location.replace('/');
      }
      else{
        alert(i18next.t("Find_Password.Wrong"));
      }
    })
    .catch((error) => {
      console.log(error);
      alert('error: '+error);
    })
  }
  render() {
    return (
      <div className="Find_password">
        <div className="limiter">
          <div className="container-login100">
            <div className="wrap-login100">
              <form className="login100-form validate-form">
                <span className="login100-form-title">
                  {i18next.t("Find_Password.Find")}
              </span>
                <div className="wrap-input100 validate-input" data-validate="ID is required">
                  <input className="input100" type="text" name="id" placeholder="ID" value={this.state.id} onChange={this.findHandler} />
                  <span className="focus-input100" />
                  <span className="symbol-input100">
                    <i className="fa fa-lock" aria-hidden="true" />
                  </span>
                </div>
                <div id="app-cover">
                  <div id="select-box">
                    <input type="checkbox" id="options-view-button" />
                    <div id="select-button" className="brd">
                      <div id="selected-value">
                        <span>{i18next.t("Find_Password.Choose")}</span>
                      </div>
                      <div id="chevrons">
                        <i className="fa fa-chevron-up" />
                        <i className="fa fa-chevron-down" />
                      </div>
                    </div>
                    <div id="options">
                      <div className="option">
                        <input className="s-c top" type="radio" name="question" defaultValue="1" onChange={this.findHandler} />
                        <input className="s-c bottom" type="radio" name="question" defaultValue="1" onChange={this.findHandler} />
                        <span className="label">{i18next.t("Find_Password.Place")}</span>
                        <span className="opt-val">{i18next.t("Find_Password.Place")}</span>
                      </div>
                      <div className="option">
                        <input className="s-c top" type="radio" name="question" defaultValue="2" onChange={this.findHandler} />
                        <input className="s-c bottom" type="radio" name="question" defaultValue="2" onChange={this.findHandler} />
                        <span className="label">{i18next.t("Find_Password.To be")}</span>
                        <span className="opt-val">{i18next.t("Find_Password.To be")}</span>
                      </div>
                      <div className="option">
                        <input className="s-c top" type="radio" name="question" defaultValue="3" onChange={this.findHandler} />
                        <input className="s-c bottom" type="radio" name="question" defaultValue="3" onChange={this.findHandler} />
                        <span className="label">{i18next.t("Find_Password.Treasure")}</span>
                        <span className="opt-val">{i18next.t("Find_Password.Treasure")}</span>
                      </div>
                      <div className="option">
                        <input className="s-c top" type="radio" name="question" defaultValue="4" onChange={this.findHandler} />
                        <input className="s-c bottom" type="radio" name="question" defaultValue="4" onChange={this.findHandler} />
                        <span className="label">{i18next.t("Find_Password.Motto")}</span>
                        <span className="opt-val">{i18next.t("Find_Password.Motto")}</span>
                      </div>
                      <div className="option">
                        <input className="s-c top" type="radio" name="question" defaultValue="5" onChange={this.findHandler} />
                        <input className="s-c bottom" type="radio" name="question" defaultValue="5" onChange={this.findHandler} />
                        <span className="label">{i18next.t("Find_Password.Respect")}</span>
                        <span className="opt-val">{i18next.t("Find_Password.Respect")}</span>
                      </div>
                      <div id="option-bg" />
                    </div>
                  </div>
                </div>
                <div className="wrap-input100 validate-input" data-validate="Asnwer is required">
                  <input className="input100" type="text" name="answer" placeholder="Answer" value={this.state.answer} onChange={this.findHandler} />
                  <span className="focus-input100" />
                  <span className="symbol-input100">
                    <i className="fa fa-lock" aria-hidden="true" />
                  </span>
                </div>
                <div className="container-login100-form-btn">
                  <button className="login100-form-btn" id="confirm" onClick={this.findClickHandler}>
                    {i18next.t("Find_Password.Confirm")}
                </button>
                </div>
                <div className="container-login100-form-btn">
                  <button className="login100-form-btn" id="cancel" onClick={() => this.props.history.push('/main')}>
                    {i18next.t("Find_Password.Cancel")}
                </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withTranslation()(Find_password);