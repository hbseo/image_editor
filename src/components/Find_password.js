import React, { Component } from 'react';

class Find_password extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      answer: ''
    }
    this.question = null;
  }
  findHandler = (e) => {
    const { name, value } = e.target;
    if (name === 'question') {
      this.question = value;
      document.getElementById("options-view-button").checked = false;
    }
    else {
      this.setState({ [name]: value });
    }
  }
  findClickHandler = (e) => {
    e.preventDefault();
    if(this.state.id === '') {
      alert('아이디를 입력해 주세요.');
      return;
    }
    if(this.state.answer === '') {
      alert('답변을 입력해 주세요.');
      return;
    }
    if(this.question === null) {
      alert('질문을 선택해 주세요.');
      return;
    }
    const {id, answer} = this.state;
    const question = this.question;
    fetch('/auth/findPassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id, question, answer})
    })
    .then((res) => res.json())
    .then((data) => {
      if(data.msg === 'success') {
        alert('임시 비밀번호: '+data.password);
        window.location.replace('/');
      }
      else{
        alert('잘못된 입력');
      }
    })
    .catch((error) => {
      console.log(error);
      alert('error: '+error);
    })
  }
  render() {
    return (
      <div className="Find_password">
        <div className="limiter">
          <div className="container-login100">
            <div className="wrap-login100">
              <form className="login100-form validate-form">
                <span className="login100-form-title">
                  비밀번호 찾기
              </span>
                <div className="wrap-input100 validate-input" data-validate="ID is required">
                  <input className="input100" type="text" name="id" placeholder="ID" value={this.state.id} onChange={this.findHandler} />
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
                        <input className="s-c top" type="radio" name="question" defaultValue="1" onChange={this.findHandler} />
                        <input className="s-c bottom" type="radio" name="question" defaultValue="1" onChange={this.findHandler} />
                        <span className="label">가장 기억에 남는 추억의 장소</span>
                        <span className="opt-val">가장 기억에 남는 추억의 장소</span>
                      </div>
                      <div className="option">
                        <input className="s-c top" type="radio" name="question" defaultValue="2" onChange={this.findHandler} />
                        <input className="s-c bottom" type="radio" name="question" defaultValue="2" onChange={this.findHandler} />
                        <span className="label">다시 태어나면 되고 싶은 것</span>
                        <span className="opt-val">다시 태어나면 되고 싶은 것</span>
                      </div>
                      <div className="option">
                        <input className="s-c top" type="radio" name="question" defaultValue="3" onChange={this.findHandler} />
                        <input className="s-c bottom" type="radio" name="question" defaultValue="3" onChange={this.findHandler} />
                        <span className="label">나의 보물 제1호</span>
                        <span className="opt-val">나의 보물 제1호</span>
                      </div>
                      <div className="option">
                        <input className="s-c top" type="radio" name="question" defaultValue="4" onChange={this.findHandler} />
                        <input className="s-c bottom" type="radio" name="question" defaultValue="4" onChange={this.findHandler} />
                        <span className="label">나의 좌우명</span>
                        <span className="opt-val">나의 좌우명</span>
                      </div>
                      <div className="option">
                        <input className="s-c top" type="radio" name="question" defaultValue="5" onChange={this.findHandler} />
                        <input className="s-c bottom" type="radio" name="question" defaultValue="5" onChange={this.findHandler} />
                        <span className="label">내가 존경하는 인물</span>
                        <span className="opt-val">내가 존경하는 인물</span>
                      </div>
                      <div id="option-bg" />
                    </div>
                  </div>
                </div>
                <div className="wrap-input100 validate-input" data-validate="Asnwer is required">
                  <input className="input100" type="text" name="answer" placeholder="Answer" value={this.state.answer} onChange={this.findHandler} />
                  <span className="focus-input100" />
                  <span className="symbol-input100">
                    <i className="fa fa-lock" aria-hidden="true" />
                  </span>
                </div>
                <div className="container-login100-form-btn">
                  <button className="login100-form-btn" id="confirm" onClick={this.findClickHandler}>
                    확인
                </button>
                </div>
                <div className="container-login100-form-btn">
                  <button className="login100-form-btn" id="cancel" onClick={() => this.props.history.push('/')}>
                    취소
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

export default Find_password;