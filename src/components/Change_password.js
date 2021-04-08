import React, { Component } from 'react';
import i18next from "../locale/i18n";
import { withTranslation } from "react-i18next";
import { CSSTransition } from 'react-transition-group';
import '../css/Login/main.scss';
class Change_password extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current_password: '',
      new_password: '',
      confirm_password: '',
      password_highlight: false
    }
    this.id = props.match.params.id;
  }

  componentDidMount() {
    document.addEventListener("mouseup", this.findHighlightTag);
    document.addEventListener("keyup", this.findHighlightTag);
  }
  componentWillUnmount() {
    document.removeEventListener("mouseup", this.findHighlightTag);
    document.removeEventListener("keyup", this.findHighlightTag);
  }

  validatePassword = () => {
    if(this.state.new_password === '' || this.state.confirm_password === '') {
      return false;
    }
    return this.state.new_password === this.state.confirm_password;
  }

  findHighlightTag = () => {
    const id = document.activeElement.id;
    if(id === "password") this.setState({password_highlight: true})
    else this.setState({password_highlight: false});
  }

  change_passwordHandler = (e) => {
    const { name, value } = e.target;
    new Promise((resolve) => {
      this.setState({ [name] : value});
      resolve();
    })
    .then(() => {
      if(name === "new_password") this.validateInput();
    })
  }
  validateInput = () => {
    let lowerCaseLetters = /[a-z]/g;
    let upperCaseLetters = /[A-Z]/g;
    let numbers = /[0-9]/g;
    let length = /.{8,20}/g;
    if(this.state.password_highlight) {
      if(this.state.new_password.match(lowerCaseLetters)) {
        document.getElementById("letter_pass").classList.remove("invalid");
        document.getElementById("letter_pass").classList.add("valid");
      } else {
        document.getElementById("letter_pass").classList.remove("valid");
        document.getElementById("letter_pass").classList.add("invalid");
      }
      if(this.state.new_password.match(upperCaseLetters)) {
        document.getElementById("capital_pass").classList.remove("invalid");
        document.getElementById("capital_pass").classList.add("valid");
      } else {
        document.getElementById("capital_pass").classList.remove("valid");
        document.getElementById("capital_pass").classList.add("invalid");
      }
      if(this.state.new_password.match(numbers)) {
        document.getElementById("number_pass").classList.remove("invalid");
        document.getElementById("number_pass").classList.add("valid");
      } else {
        document.getElementById("number_pass").classList.remove("valid");
        document.getElementById("number_pass").classList.add("invalid");
      }
      if(this.state.new_password.match(length)) {
        document.getElementById("length_pass").classList.remove("invalid");
        document.getElementById("length_pass").classList.add("valid");
      } else {
        document.getElementById("length_pass").classList.remove("valid");
        document.getElementById("length_pass").classList.add("invalid");
      }
    }
  }

  change_passwordClickHandler = (e) => {
    e.preventDefault();
    let pattern_pass = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}/;
    if(!this.state.new_password.match(pattern_pass)) return;
    const {current_password, new_password} = this.state;
    const id = this.id;
    if(!this.validatePassword()) {
      alert(i18next.t('Change_password.notMatchPW'));
      return;
    }
    if(this.id) {
      fetch('/auth/changeUserPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({id, current_password, new_password})
      })
      .then((res) => res.json())
      .then((data) => {
        if(data.msg === 'success') {
          alert(i18next.t('Change_password.PWsuccess'));
          window.location.replace('/');
        }
        else {
          alert(i18next.t('Change_password.PWfail'));
        }
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      })
    }
  }

  render() {
    return(
      <div className="Change_password">
        <div className="limiter">
          <div className="container-login100">
            <div className="wrap-login100">
              <form className="login100-form validate-form">
                <span className="login100-form-title">
                  {i18next.t('Change_password.Change Password')}
              </span>
                <div className="wrap-input100 validate-input" data-validate="Password is required">
                  <input className="input100" type="password" name="current_password" placeholder="Current password" value={this.state.current_password} onChange={this.change_passwordHandler}/>
                  <span className="focus-input100" />
                  <span className="symbol-input100">
                    <i className="fa fa-lock" aria-hidden="true" />
                  </span>
                </div>
                <div className="wrap-input100 validate-input" data-validate="Password is required">
                  <input className="input100" type="password" id="password" name="new_password" placeholder="New password" value={this.state.new_password} onChange={this.change_passwordHandler} />
                  <span className="focus-input100" />
                  <span className="symbol-input100">
                    <i className="fa fa-lock" aria-hidden="true" />
                  </span>
                  <CSSTransition in ={this.state.password_highlight} timeout={200} classNames="validCheck" unmountOnExit>
                  <div className="validatePass">
                    <p className="invalid" id="letter_pass"><b>소문자</b></p>
                    <p className="invalid" id="capital_pass"><b>대문자</b></p>
                    <p className="invalid" id="number_pass"><b>숫자</b></p>
                    <p className="invalid" id="length_pass"><b>최소길이 8</b></p>
                  </div>
                  </CSSTransition>
                </div>
                <div className="wrap-input100 validate-input" data-validate="Password is required">
                  <input className="input100" type="password" name="confirm_password" placeholder="Confirm password" value={this.state.confirm_password} onChange={this.change_passwordHandler} />
                  <span className="focus-input100" />
                  <span className="symbol-input100">
                    <i className="fa fa-lock" aria-hidden="true" />
                  </span>
                </div>
                <div className="container-login100-form-btn">
                  <button className="login100-form-btn" id="confirm" onClick={this.change_passwordClickHandler}>
                    {i18next.t('Change_password.Confirm')}
                </button>
                </div>
                <div className="container-login100-form-btn">
                  <button className="login100-form-btn" id="cancel" onClick={() => this.props.history.push('/')}>
                    {i18next.t('Change_password.Cancel')}
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

export default withTranslation()(Change_password);