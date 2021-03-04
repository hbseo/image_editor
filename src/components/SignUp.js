import React, { Component } from 'react';
import debounce from 'lodash/debounce';
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
      idDupCheck: null
    }
    this.id_style = null;
    this.choose = null;
  }
  registerHandler = (e) => {
    const { name, value } = e.target;
    if(name === 'choose') {
      this.choose = value;
      document.getElementById("options-view-button").checked = false;
    }
    else {
      this.setState({ [name]: value });
    }
    if(name === 'id') {
      this.registerDupHandler(value);
    }
  }
  validatePassword = () => {
    if(this.state.password === '' || this.state.passwordConfirm === '') {
      return false;
    }
    return this.state.password === this.state.passwordConfirm;
  }

  registerClickHandler = (e) => {
    e.preventDefault();
    if(!this.validatePassword()) {
      alert('아이디 중복 또는 옮바르지 않은 비밀번호');
      return;
    }
    if(this.choose === null) {
      alert('질문을 선택해 주세요.');
      return;
    }
    if(this.state.answer === '') {
      alert('답변을 작성해 주세요.');
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
            alert('회원가입 성공');
            window.location.replace('/'); 
          }
          else {
            alert('회원가입 실패');
          }
        })
        .catch((error) => {
          console.log(error);
          alert('error');
        })
    }
    else {
      alert('아이디 중복 또는 옮바르지 않은 비밀번호');
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
    this.id_style = null;
    if(this.state.id !== '') {
      if(this.state.idDupCheck !== null && !this.state.idDupCheck) {
        duptag = <div>아이디 중복</div>
        this.id_style = {border: '5px solid red'}
      }
    }
    return (
      <div className='SignUp'>
        <div className="limiter">
          <div className="container-login100">
            <div className="wrap-login100">
              <div className="login100-pic js-tilt" data-tilt>
                <img src='https://t1.daumcdn.net/cfile/tistory/998019475A445E7A2F' alt="IMG" />
              </div>
              <form className="login100-form validate-form" onSubmit={this.registerClickHandler}>
                <span className="login100-form-title">
                  Member Register
              </span>
                <div className="wrap-input100 validate-input" data-validate='ID is required'>
                  <input className="input100" type="text" name="id" placeholder="ID" value={this.state.id} onChange={this.registerHandler} style={this.id_style} />
                  <span className="focus-input100" />
                  <span className="symbol-input100">
                    <i className="fa fa-envelope" aria-hidden="true" />
                  </span>
                </div>
                <div className="wrap-input100 validate-input" data-validate="Password is required">
                  <input className="input100" type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.registerHandler}/>
                  <span className="focus-input100" />
                  <span className="symbol-input100">
                    <i className="fa fa-lock" aria-hidden="true" />
                  </span>
                </div>
                <div className="wrap-input100 validate-input" data-validate="Password is required">
                  <input className="input100" type="password" name="passwordConfirm" placeholder="Password Confirm" vlaue={this.state.passwordConfirm} onChange={this.registerHandler} />
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
                        <span>원하는 질문을 선택하세요.</span>
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
                        <span className="label">가장 기억에 남는 추억의 장소</span>
                        <span className="opt-val">가장 기억에 남는 추억의 장소</span>
                      </div>
                      <div className="option">
                        <input className="s-c top" type="radio" name="choose" defaultValue="2"  onChange={this.registerHandler}/>
                        <input className="s-c bottom" type="radio" name="choose" defaultValue="2"  onChange={this.registerHandler}/>
                        <span className="label">다시 태어나면 되고 싶은 것</span>
                        <span className="opt-val">다시 태어나면 되고 싶은 것</span>
                      </div>
                      <div className="option">
                        <input className="s-c top" type="radio" name="choose" defaultValue="3" onChange={this.registerHandler} />
                        <input className="s-c bottom" type="radio" name="choose" defaultValue="3"  onChange={this.registerHandler}/>
                        <span className="label">나의 보물 제1호</span>
                        <span className="opt-val">나의 보물 제1호</span>
                      </div>
                      <div className="option">
                        <input className="s-c top" type="radio" name="choose" defaultValue="4"  onChange={this.registerHandler}/>
                        <input className="s-c bottom" type="radio" name="choose" defaultValue="4"  onChange={this.registerHandler}/>
                        <span className="label">나의 좌우명</span>
                        <span className="opt-val">나의 좌우명</span>
                      </div>
                      <div className="option">
                        <input className="s-c top" type="radio" name="choose" defaultValue="5" onChange={this.registerHandler} />
                        <input className="s-c bottom" type="radio" name="choose" defaultValue="5"  onChange={this.registerHandler}/>
                        <span className="label">내가 존경하는 인물</span>
                        <span className="opt-val">내가 존경하는 인물</span>
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
                {duptag}
                <div className="container-login100-form-btn">
                  <button className="login100-form-btn" type='submit'>
                    Register
                </button>
                </div>
                <div className="text-center p-t-136">
                  <Link to={{
                    pathname: '/login',
                  }}><div className="txt2 was-a">
                      Login your Account
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

export default SignUp;