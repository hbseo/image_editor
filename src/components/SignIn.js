import React, { Component } from 'react';
import '../css/SignIn.scss';

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
  loginClickHandler = () => {
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
        this.props.close();
        this.props.check();
      }
      else {
        alert('아이디 또는 비밀번호 잘못 입력했습니다.');
      }
    })
    .catch(() => {
      alert('error');
    })
  }
  toggle = () => {
    this.props.set_State('SignUp');
  }
  render(){
    return(
      <div className='modal'>
        <div className='loginModal'>
          <span className='close' onClick={this.props.close}>&times;</span>
          <div className='modalContents'>
            <input
              name='id'
              className='loginId'
              type='text'
              placeholder='ID'
              onChange={this.loginHandler}
            />
            <input
              name='password'
              className='loginPw'
              type='password'
              placeholder='PASSWORD'
              onChange={this.loginHandler}
            />
            <button className='loginBtn' onClick={this.loginClickHandler}>로그인</button>
            <div className='loginEnd'>
              <div className='registerLink'>회원가입 ㄱㄱ
                <b onClick={this.toggle}>SignUp</b>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default SignIn;