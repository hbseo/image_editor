import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../css/Login/bootstrap.min.scss';
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
        alert('로그인 성공!');
        this.props.history.push('/');
      }
      else {
        alert('아이디 또는 비밀번호 잘못 입력했습니다.');
      }
    })
    .catch((error) => {
      console.log(error);
      alert('error');
    })
  }
  render(){
    return(
      <div className='SignIn'>
        <div className="limiter">
          <div className="container-login100">
            <div className="wrap-login100">
              <div className="login100-pic js-tilt" data-tilt>
                <img src='https://t1.daumcdn.net/cfile/tistory/998019475A445E7A2F' alt="IMG" />
              </div>
              <form className="login100-form validate-form" onSubmit={this.loginClickHandler}>
                <span className="login100-form-title">
                  Member Login
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
                    Login
                </button>
                </div>
                <div className="text-center p-t-12">
                  <span className="txt1">
                    Forgot
                </span>
                  <a className="txt2" href="#">
                    Username / Password?
                </a>
                </div>
                <div className="text-center p-t-136">
                  <Link to={{
                    pathname: '/register'
                  }}><div className="txt2 was-a">
                      Create your Account
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

export default SignIn;