import React, { Component } from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      state: 'SignIn',
      visible : false,
      user_name: ''
    };
  }
  componentDidMount() {
    this.getCheck();
  }
  openModal = () => {
    this.setState({visible: true});
  }
  closeModal = () => {
    this.setState({state: 'SignIn', visible: false});
  }
  changeState = (name) => {
    this.setState({state: name});
  }
  getCheck = () => {
    fetch('/auth/check', {
      method: 'GET'
    })
    .then((res) => res.json())
    .then((data) => {
      if(data.success) {
        this.setState({state: 'done', user_name: data.info.user_id});
      }
      else {
        this.setState({state: 'SignIn'});
      }
    })
  }
  logoutClickHandler = () => {
    fetch('/auth/logout', {
      method: 'POST',
    })
    .then((res) => res.json())
    .then((data) => {
      this.getCheck();
    })
  }
  render() {
    let view;
    if(this.state.state === 'SignIn') {
      view = <SignIn set_State={this.changeState} close={this.closeModal} check={this.getCheck}/>;
    }
    else if(this.state.state === 'SignUp') {
      view = <SignUp set_State={this.changeState} close={this.closeModal}/>;
    }
    return (
      <div className='login'>
        {this.state.state === 'done' ? 
        <div>
          <h5>{this.state.user_name}님 환영합니다</h5>
          <button onClick={this.logoutClickHandler}>로그아웃</button>
        </div> : 
        <div>
          <button onClick={this.openModal}>로그인</button>
          {this.state.visible ? 
          view :
          null
          }
        </div>}
      </div>
    )
  }
}

export default Login;