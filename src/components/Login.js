import React, { Component } from 'react';
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
      alert('로그아웃 성공!');
      this.getCheck();
    })
    .catch(() => {
      alert('error');
    })
  }
  render() {
    return (
      <div className='login'>
        {this.props.login_state ? 
        <div>
          <h5>{this.props.id}님 환영합니다</h5>
          <button onClick={this.logoutClickHandler}>로그아웃</button>
          <Link to={{
            pathname: `/ChangePassword/${this.props.id}`,
          }}><button>비밀번호 변경</button></Link>
        </div> : 
        <div>
          <Link to={{
            pathname: '/login',
          }}><button>로그인</button></Link>
          <Link to={{
            pathname: '/register',
          }}><button>회원가입</button></Link>
          <Link to={{
            pathname: '/find',
          }}><button>비밀번호 찾기</button></Link>
        </div>}
      </div>
    )
  }
}

export default Login;