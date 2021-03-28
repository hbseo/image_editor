import React, { Component } from 'react';
import i18next from "../locale/i18n";
import { withTranslation } from "react-i18next";
import { Link } from 'react-router-dom';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_name: ''
    };
  }
  componentDidMount() {
    this.getCheck();
  }

  getCheck = () => {
    fetch('/auth/check', {
      method: 'GET'
    })
    .then((res) => res.json())
    .then((data) => {
      if(data.success) {
        this.props.loginSuccess(data.info.user_id);
      }
      else {
        this.props.loginFail();
      }
    })
    .catch(() => {
      this.props.loginFail();
    })
  }
  logoutClickHandler = () => {
    fetch('/auth/logout', {
      method: 'POST',
    })
    .then((res) => res.json())
    .then((data) => {
      alert(i18next.t('Login.Signout') + ' ' + i18next.t('Login.Success'))
      this.getCheck();
    })
    .catch(() => {
      alert(i18next.t('Login.Error'));
    })
  }
  render() {
    return (
      <div className='login'>
        {this.props.login_state ? 
        <div>
          <h5>{this.props.id} {i18next.t('Login.Welcome')}</h5>
          <button onClick={this.logoutClickHandler}>{i18next.t('Login.Signout')}</button>
          <Link to={{
            pathname: `/ChangePassword/${this.props.id}`,
          }}><button>{i18next.t('Login.ChangePW')}</button></Link>
        </div> : 
        <div>
          <Link to={{
            pathname: '/login',
          }}><button>{i18next.t('Login.Signin')}</button></Link>
          <Link to={{
            pathname: '/register',
          }}><button>{i18next.t('Login.Signup')}</button></Link>
          <Link to={{
            pathname: '/find',
          }}><button>{i18next.t('Login.FindPW')}</button></Link>
        </div>}
      </div>
    )
  }
}

export default withTranslation()(Login);