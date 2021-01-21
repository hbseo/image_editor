import React, { Component } from 'react';
import './SignUp.scss';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      password: '',
      idDup: false
    }
  }
  registerHandler = (e) => {
    const {name, value} = e.target;
    this.setState({[name]: value});
  }
  registerClickHandler = () => {
    if(this.state.idDup) {
      const {id, password} = this.state;
      fetch('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({id, password})
      })
      .then((res) => res.json())
      .then((data) => {
        if(data.msg === 'success') {
          alert('회원가입 성공');
        }
        else {
          alert('회원가입 실패');
        }
        this.props.close();
      })
      .catch(() => {
        alert('error');
      })
    }
    else {
      alert('아이디 중복확인 필요');
    }
  }
  registerDupHandler = () => {
    const id = this.state.id;
    fetch('/auth/dupCheck', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id})
    })
    .then((res) => res.json())
    .then((data) => {
      if(data.msg === 'exist') {
        alert('아이디 중복');
      }
      else {
        this.setState({idDup: true});
        document.getElementById('dupCheck').disabled = true;
        document.getElementById('registerId').disabled = true;
        alert('사용가능')
      }
    })
    .catch(() => {
      alert('error');
    })
  }

  toggle = () => {
    this.props.set_State('SignIn');
  }
  render(){
    const {close} = this.props;
    return(
      <div className='modal'>
        <div className='registerModal'>
          <span className='close' onClick={close}>&times;</span>
          <div className='modalContents'>
            <input
              name='id'
              className='registerId'
              id='registerId'
              type='text'
              placeholder='ID'
              onChange={this.registerHandler}
            />
            <input
              name='password'
              className='registerPw'
              type='password'
              placeholder='PASSWORD'
              onChange={this.registerHandler}
            />
            <button className='registerBtn' id='dupCheck' onClick={this.registerDupHandler}>중복확인</button>
            <button className='registerBtn' onClick={this.registerClickHandler}>회원가입</button>
            <div className='registerEnd'>
              <div className='registerLink'>로그인 ㄱㄱ
                <b onClick={this.toggle}>SignIn</b>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default SignUp;