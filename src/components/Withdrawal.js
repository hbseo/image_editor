import React, { Component } from 'react';
import '../css/Withdrawal.scss';
import i18next from "../locale/i18n";
import { withTranslation } from "react-i18next";

class Withdrawal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: ''
    }
  }
  inputHandler = (e) => {
    const{name, value} = e.target;
    this.setState({[name]: value});
  }
  withdrawalHandler = (e) => {
    e.preventDefault();
    const {password} = this.state;
    const id = this.props.id;
    fetch('/auth/withdraw', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id, password})
    })
    .then((res) => res.json())
    .then((data) => {
      if(data.msg === 'success') {
        alert("성공적으로 탈퇴되었습니다.");
        this.props.close();
        window.location.replace('/');
      }
      else {
        alert("비밀번호가 틀렸습니다.");
      }
    })
    .catch((error) => {
      console.log(error);
      alert("오류 발생;")
    })
  }
  render(){
    return(
      <div className='modal'>
        <div className='withdrawal'>
          <p>&#183;정말로 회원 탈퇴 하시겠습니까?<br/>&#183;탈퇴하시려면 비밀번호를 입력해 주세요.</p>
          <input 
            type="password" 
            name="password" 
            value={this.state.password} 
            onChange={this.inputHandler}
            maxLength="20"></input>
          <button className="confirm" onClick={this.withdrawalHandler}>확인</button>
          <button className="cancel" onClick={this.props.close}>취소</button>
        </div>
      </div>
    )
  }
}

export default withTranslation()(Withdrawal);