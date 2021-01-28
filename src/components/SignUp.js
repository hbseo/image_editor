import React, { Component } from 'react';
import debounce from 'lodash/debounce';
import { Link } from 'react-router-dom';
import '../css/Login/bootstrap.min.scss';
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
      idDupCheck: null
    }
    this.id_style = null;
  }
  registerHandler = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });

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
    if (this.state.idDupCheck) {
      const { id, password } = this.state;
      fetch('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, password })
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.msg === 'success') {
            alert('회원가입 성공');
            this.props.history.push('/');
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