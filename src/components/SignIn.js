import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import i18next from "../locale/i18n";
import { withTranslation } from "react-i18next";
// import FindPassword from './Find_password';
import '../css/Login/font-awesome.min.scss';
import '../css/Login/main.scss';
import '../css/Login/util.scss';

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      password: ''
    }
  }
  loginHandler = (e) => {
    const {name, value} = e.target;
    this.setState({[name]: value});
  }
  loginClickHandler = (e) => {
    e.preventDefault();
    const {id, password} = this.state;
    fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id, password})
    })
    .then((res) => res.json())
    .then((data) => {
      if(data.msg === 'login success') {
        alert(i18next.t('SignIn.Signin') + ' ' + i18next.t('SignIn.Success'));
        try {
          window.location.replace('/main'); 
        } catch (error) {
          console.log('d');
          console.log(error);
        }
      }
      else {
        alert(i18next.t('SignIn.Wrong'));
      }
    })
    .catch((error) => {
      console.log(error);
      alert(i18next.t('SignIn.Error'));
    })
  }
  render(){
    return(
      <div className='SignIn'>
        <div className="limiter">
          <div className="container-login100">
            <div className="wrap-login100">
              <form className="login100-form validate-form" onSubmit={this.loginClickHandler}>
                <span className="login100-form-title">
                  {i18next.t('SignIn.Member Login')}
              </span>
                <div className="wrap-input100 validate-input">
                  <input className="input100" type="text" name="id" placeholder="ID" value={this.state.id} onChange={this.loginHandler} />
                  <span className="focus-input100" />
                  <span className="symbol-input100">
                    <i className="fa fa-envelope" aria-hidden="true" />
                  </span>
                </div>
                <div className="wrap-input100 validate-input" data-validate="Password is required">
                  <input className="input100" type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.loginHandler}/>
                  <span className="focus-input100" />
                  <span className="symbol-input100">
                    <i className="fa fa-lock" aria-hidden="true" />
                  </span>
                </div>
                <div className="container-login100-form-btn">
                  <button className="login100-form-btn" type='submit'>
                  {i18next.t('SignIn.Signin')}
                  </button>
                </div>
                <div className="container-login100-form-btn">
                  <Link to={{
                    pathname: '/register'
                  }}><div className="register-button">
                      {i18next.t('SignIn.Create your Account')}
                    {/* <i className="fa fa-long-arrow-right m-l-5" aria-hidden="true" /> */}
                    </div></Link>
                </div>
                <div className="text-center p-t-12">
                  <span className="txt1">
                  {/* {i18next.t('SignIn.Forgot')} */}
                </span>
                  <Link to={{
                    pathname: `/find`,
                  }}><p className="txt2">{i18next.t('SignIn.Username / Password?')}</p></Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withTranslation()(SignIn);