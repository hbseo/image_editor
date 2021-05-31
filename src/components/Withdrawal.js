import React, { Component } from 'react';
import '../css/Withdrawal.scss';
import i18next from "../locale/i18n";
import { withTranslation } from "react-i18next";

class Withdrawal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: ''
    }
  }
  inputHandler = (e) => {
    const{name, value} = e.target;
    this.setState({[name]: value});
  }
  withdrawalHandler = (e) => {
    e.preventDefault();
    const {password} = this.state;
    const id = this.props.id;
    fetch('/auth/withdraw', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id, password})
    })
    .then((res) => res.json())
    .then((data) => {
      if(data.msg === 'success') {
        alert(i18next.t("Withdrawal.Success"));
        this.props.close();
        window.location.replace('/');
      }
      else {
        if(data.msg === "not login") {
          alert(i18next.t("login_expired"));
          window.location.replace('/');
          return;
        }
        alert(i18next.t("Withdrawal.Wrong"));
      }
    })
    .catch((error) => {
      console.log(error);
      alert(i18next.t("Withdrawal.Error"))
    })
  }
  render(){
    return(
      <div className='modal'>
        <div className='withdrawal'>
          <div className="top-div">
            {i18next.t("Withdrawl.Input Password")}
          </div>
          <div className="middle-div">
            <input 
              type="password" 
              name="password"
              className = "input-pw" 
              value={this.state.password} 
              onChange={this.inputHandler}
              maxLength="20">
            </input>
          </div>

          <div className="bottom-div">
            <button className="confirm" onClick={this.withdrawalHandler}>{i18next.t("Withdrawal.Confirm")}</button>
            <button className="cancel" onClick={this.props.close}>{i18next.t("Withdrawal.Cancel")}</button>
          </div>
          
        </div>
      </div>
    )
  }
}

export default withTranslation()(Withdrawal);