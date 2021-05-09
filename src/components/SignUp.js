import React, { Component } from 'react';
import debounce from 'lodash/debounce';
import i18next from "../locale/i18n";
import { CSSTransition } from 'react-transition-group';
import { withTranslation } from "react-i18next";
import { Link } from 'react-router-dom';
import '../css/Login/font-awesome.min.scss';
import '../css/Login/main.scss';
import '../css/Login/util.scss';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      password: '',
      passwordConfirm: '',
      answer: '',
      idDupCheck: null,
      id_highlight: false,
      password_hightlight: false
    }
    this.id_style = null;
    this.choose = null;
  }
  componentDidMount() {
    document.addEventListener("mouseup", this.findHighlightTag);
    document.addEventListener("keyup", this.findHighlightTag);
  }
  componentWillUnmount() {
    document.removeEventListener("mouseup", this.findHighlightTag);
    document.removeEventListener("keyup", this.findHighlightTag);
  }
  swtichSubmit = () => {
    let pattern_id = /(?=.*\d)(?=.*[a-z]).{8,20}/;
    let pattern_pass = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}/;
    if(this.state.id.match(pattern_id) && this.state.password.match(pattern_pass)
    && this.state.passwordConfirm.match(pattern_pass) && this.choose !== null && this.state.answer !== '') {
      document.getElementById("register-btn").disabled = false;
    }
    else {
      document.getElementById("register-btn").disabled = true;
    }
  }
  findHighlightTag = () => {
    const id = document.activeElement.id;
    if(id === "id" || id === "password") {
      if(id === "id") {
        this.setState({id_highlight: true, password_hightlight: false});
        this.validateInput('id')

      }
      else {
        this.setState({id_highlight: false, password_hightlight: true});
        this.validateInput('password')
      }
    }
    else this.setState({id_highlight: false, password_hightlight: false});
  }
  registerHandler = (e) => {
    let { name, value } = e.target;
    new Promise((resolve) => {
      if(name === 'choose') {
        this.choose = value;
        document.getElementById("options-view-button").checked = false;
      }
      else {
        if(name === "id" || name === "password") {
          let pattern = /[^a-zA-Z-_0-9]/g;
          if(value.length > 0 && value.match(pattern)) value = value.replace(pattern, "");
        }
        this.setState({ [name]: value });
      }
      resolve();
    })
    .then(() => {
      if(this.state.id || this.state.password) this.validateInput(name);
      if(name === 'id') {
        this.registerDupHandler(value);
      }
      this.swtichSubmit();
    })
  }
  validatePassword = () => {
    if(this.state.password === '' || this.state.passwordConfirm === '') {
      return false;
    }
    return this.state.password === this.state.passwordConfirm;
  }

  validateInput = (name) => {
    let lowerCaseLetters = /[a-z]/g;
    let upperCaseLetters = /[A-Z]/g;
    let numbers = /[0-9]/g;
    let length = /.{8,20}/g;
    if(name === "id" && this.state.id_highlight) {
      if(this.state.id.match(lowerCaseLetters)) {
        document.getElementById("letter_id").classList.remove("invalid");
        document.getElementById("letter_id").classList.add("valid");
      } else {
        document.getElementById("letter_id").classList.remove("valid");
        document.getElementById("letter_id").classList.add("invalid");
      }
      if(this.state.id.match(numbers)) {
        document.getElementById("number_id").classList.remove("invalid");
        document.getElementById("number_id").classList.add("valid");
      } else {
        document.getElementById("number_id").classList.remove("valid");
        document.getElementById("number_id").classList.add("invalid");
      }
      if(this.state.id.match(length)) {
        document.getElementById("length_id").classList.remove("invalid");
        document.getElementById("length_id").classList.add("valid");
      } else {
        document.getElementById("length_id").classList.remove("valid");
        document.getElementById("length_id").classList.add("invalid");
      }
    }
    if(name === "password" && this.state.password_hightlight) {
      if(this.state.password.match(lowerCaseLetters)) {
        document.getElementById("letter_pass").classList.remove("invalid");
        document.getElementById("letter_pass").classList.add("valid");
      } else {
        document.getElementById("letter_pass").classList.remove("valid");
        document.getElementById("letter_pass").classList.add("invalid");
      }
      if(this.state.password.match(upperCaseLetters)) {
        document.getElementById("capital_pass").classList.remove("invalid");
        document.getElementById("capital_pass").classList.add("valid");
      } else {
        document.getElementById("capital_pass").classList.remove("valid");
        document.getElementById("capital_pass").classList.add("invalid");
      }
      if(this.state.password.match(numbers)) {
        document.getElementById("number_pass").classList.remove("invalid");
        document.getElementById("number_pass").classList.add("valid");
      } else {
        document.getElementById("number_pass").classList.remove("valid");
        document.getElementById("number_pass").classList.add("invalid");
      }
      if(this.state.password.match(length)) {
        document.getElementById("length_pass").classList.remove("invalid");
        document.getElementById("length_pass").classList.add("valid");
      } else {
        document.getElementById("length_pass").classList.remove("valid");
        document.getElementById("length_pass").classList.add("invalid");
      }
    }
  }

  registerClickHandler = (e) => {
    e.preventDefault();
    if(!this.validatePassword()) {
      alert(i18next.t("SignUp.Dup"));
      return;
    }
    if(this.choose === null) {
      alert(i18next.t("SignUp.Select"));
      return;
    }
    if(this.state.answer === '') {
      alert(i18next.t("SignUp.Answer"));
      return;
    }
    if (this.state.idDupCheck) {
      const { id, password, answer } = this.state;
      const question = this.choose;
      fetch('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, password, answer, question })
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.msg === 'success') {
            alert(i18next.t("SignUp.Success"));
            window.location.replace('/login'); 
          }
          else {
            alert(i18next.t("SignUp.Fail"));
          }
        })
        .catch((error) => {
          console.log(error);
          alert(i18next.t("SignUp.Error"));
        })
    }
    else {
      alert(i18next.t("SignUp.Dup"));
    }
  }
  registerDupHandler = debounce(async(id) => {
    fetch('/auth/dupCheck', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.msg === 'exist') {
          this.setState({ idDupCheck: false});
        }
        else {
          this.setState({ idDupCheck: true });
        }
      })
      .catch((error) => {
        alert('error');
      })
  }, 300)

  render() {
    let duptag = null;
    this.id_style = {border: '1px solid white'};
    if(this.state.id !== '') {
      if(this.state.idDupCheck !== null && !this.state.idDupCheck) {
        duptag = <div className = 'duptag' >{i18next.t("SignUp.DupID")}</div>
        this.id_style = {border: '5px solid #ff4c4c'}
      }
    }
    return (
      <div className='SignUp'>
        <div className="limiter">
          <div className="container-login100">
            <div className="wrap-login100">
              <form className="login100-form validate-form" onSubmit={this.registerClickHandler}>
                <span className="login100-form-title">
                  {i18next.t("SignUp.Member Register")}
              </span>
                <div className="wrap-input100 validate-input" data-validate='ID is required'>
                  {duptag}
                  <input className="input100" type="text" id="id" name="id" placeholder="ID" value={this.state.id} onChange={this.registerHandler} style={this.id_style} maxLength="20" />
                  <span className="focus-input100" />
                  <span className="symbol-input100">
                    <i className="fa fa-envelope" aria-hidden="true" />
                  </span>

                  <CSSTransition in = {this.state.id_highlight} timeout={200} classNames="validCheck" unmountOnExit >
                    <div className="validateId">
                      <p className="invalid" id="letter_id"><b>{i18next.t("SignUp.Lower Case")}</b></p>
                      <p className="invalid" id="number_id"><b>{i18next.t("SignUp.Number")}</b></p>
                      <p className="invalid" id="length_id"><b>{i18next.t("SignUp.Minimum Length")}</b></p>
                    </div>
                  </CSSTransition>
                </div>
                <div className="wrap-input100 validate-input" data-validate="Password is required">
                  <input className="input100" type="password" id="password" name="password" placeholder="Password" value={this.state.password} onChange={this.registerHandler} maxLength="20"/>
                  <span className="focus-input100" />
                  <span className="symbol-input100">
                    <i className="fa fa-lock" aria-hidden="true" />
                  </span>
                  <CSSTransition in = {this.state.password_hightlight} timeout={200} classNames="validCheck" unmountOnExit >
                    <div className="validatePass">
                      <p className="invalid" id="letter_pass"><b>{i18next.t("SignUp.Lower Case")}</b></p>
                      <p className="invalid" id="capital_pass"><b>{i18next.t("SignUp.Upper Case")}</b></p>
                      <p className="invalid" id="number_pass"><b>{i18next.t("SignUp.Number")}</b></p>
                      <p className="invalid" id="length_pass"><b>{i18next.t("SignUp.Minimum Length")}</b></p>
                    </div>
                  </CSSTransition>
                </div>
                <div className="wrap-input100 validate-input" data-validate="Password is required">
                  <input className="input100" type="password" name="passwordConfirm" placeholder="Password Confirm" vlaue={this.state.passwordConfirm} onChange={this.registerHandler} maxLength="20"/>
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
                        <span>{i18next.t("SignUp.Select")}</span>
                      </div>
                      <div id="chevrons">
                        <i className="fa fa-chevron-up" />
                        <i className="fa fa-chevron-down" />
                      </div>
                    </div>
                    <div id="options">
                      <div className="option">
                        <input className="s-c top" type="radio" name="choose" defaultValue="1" onChange={this.registerHandler} />
                        <input className="s-c bottom" type="radio" name="choose" defaultValue="1"  onChange={this.registerHandler}/>
                        <span className="label">{i18next.t("SignUp.Place")}</span>
                        <span className="opt-val">{i18next.t("SignUp.Place")}</span>
                      </div>
                      <div className="option">
                        <input className="s-c top" type="radio" name="choose" defaultValue="2"  onChange={this.registerHandler}/>
                        <input className="s-c bottom" type="radio" name="choose" defaultValue="2"  onChange={this.registerHandler}/>
                        <span className="label">{i18next.t("SignUp.To be")}</span>
                        <span className="opt-val">{i18next.t("SignUp.To be")}</span>
                      </div>
                      <div className="option">
                        <input className="s-c top" type="radio" name="choose" defaultValue="3" onChange={this.registerHandler} />
                        <input className="s-c bottom" type="radio" name="choose" defaultValue="3"  onChange={this.registerHandler}/>
                        <span className="label">{i18next.t("SignUp.Treasure")}</span>
                        <span className="opt-val">{i18next.t("SignUp.Treasure")}</span>
                      </div>
                      <div className="option">
                        <input className="s-c top" type="radio" name="choose" defaultValue="4"  onChange={this.registerHandler}/>
                        <input className="s-c bottom" type="radio" name="choose" defaultValue="4"  onChange={this.registerHandler}/>
                        <span className="label">{i18next.t("SignUp.Motto")}</span>
                        <span className="opt-val">{i18next.t("SignUp.Motto")}</span>
                      </div>
                      <div className="option">
                        <input className="s-c top" type="radio" name="choose" defaultValue="5" onChange={this.registerHandler} />
                        <input className="s-c bottom" type="radio" name="choose" defaultValue="5"  onChange={this.registerHandler}/>
                        <span className="label">{i18next.t("SignUp.Respect")}</span>
                        <span className="opt-val">{i18next.t("SignUp.Respect")}</span>
                      </div>
                      <div id="option-bg" />
                    </div>
                  </div>
                </div>
                <div className="wrap-input100 validate-input">
                  <input className="input100" type="text" name="answer" placeholder="Answer" value={this.state.answer} onChange={this.registerHandler}></input>
                  <span className="focus-input100" />
                  <span className="symbol-input100">
                    <i className="fa fa-sticky-note" aria-hidden="true" />
                  </span>
                </div>
                <div className="container-login100-form-btn">
                  <button className="login100-form-btn" id="register-btn" type='submit' disabled={true}>
                    {i18next.t("SignUp.Register")}
                </button>
                </div>
                <div className="text-center p-t-136">
                  <Link to={{
                    pathname: '/login',
                  }}><div className="txt2 was-a">
                      {i18next.t("SignUp.Login your Account")}
                    <i className="fa fa-long-arrow-right m-l-5" aria-hidden="true" />
                    </div></Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withTranslation()(SignUp);