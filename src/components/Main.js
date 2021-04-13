import React, { Component } from 'react';
import Project from './Project';
import Login from './Login';
import Newproject from './New_project';
import LoadImage from './LoadImage';
import Withdrawal from './Withdrawal';
import '../css/Main.scss';
import checkUserLanguage from './helper/CheckLang';
import Loading from './ui/Loading';
import { withTranslation } from "react-i18next";
import { Link } from 'react-router-dom';
import i18next from "../locale/i18n";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab : 0,
      login_state: false,
      id : '',
      withdrawalModal: false
    }
    i18next.changeLanguage(checkUserLanguage());
  }

  componentDidMount(){
    this.getCheck();
  }

  changeTab = (event) => {
    this.setState({tab : parseInt(event.target.getAttribute('tab'), 10)});
  }

  loginSuccess = (id) => {
    this.setState({id : id, login_state: true});
  }

  loginFail = () => {
    let tab = this.state.tab === 4 ? 0 : this.state.tab
    this.setState({login_state: false, tab : tab});
  }

  getCheck = () => {
    fetch('/auth/check', {
      method: 'GET'
    })
    .then((res) => res.json())
    .then((data) => {
      if(data.success) {
        this.loginSuccess(data.info.user_id);
      }
      else {
        this.loginFail();
      }
    })
    .catch(() => {
      this.loginFail();
    })
  }

  logoutClickHandler = () => {
    fetch('/auth/logout', {
      method: 'POST',
    })
    .then((res) => res.json())
    .then((data) => {
      alert(i18next.t('Main.Signout') + ' ' + i18next.t('Main.Success'))
      this.getCheck();
    })
    .catch(() => {
      alert(i18next.t('Main.Error'));
    })
  }

  withdrawalModalHandler = () => {
    this.setState({withdrawalModal: !this.state.withdrawalModal});
  }

  withdrawalHandler = () => {

  }

  checkUserLanguage = () => {
    if(navigator){
      let lang = navigator.language || navigator.userLanguage;
      switch(lang){
        case 'ko-KR':
          i18next.changeLanguage('ko');
          break;
        default:
          i18next.changeLanguage('en');
          break;
      }
    }
  }

  changeToKorean = () => {
    i18next.changeLanguage('ko')
  }

  changeToEnglish = () => {
    i18next.changeLanguage('en')
  }

  render() {
    const tab = {
      0: <Newproject/>,
      1: <LoadImage tab = '1'/>,
      2: <LoadImage tab = '2'/>,
      3: <Login tab = '3' login_state = {this.state.login_state} loginSuccess = {this.loginSuccess} loginFail = {this.loginFail} id = {this.state.id} />,
      4: <Project id ={this.state.id} login = {this.state.login_state}/>
    }
    const {t} = this.props;
    // const { t } = useTranslation(['translation', 'common']);
    return (
      <div>
        <div className='Main'>
          <div className='topnav'>
            <p className="site-title-p">Image Editor</p>
          </div>
          <div className="main-box">
            <div className='sidenav'>
              <div className="site-title">
                <p className="site-title-p">image-editor</p>
              </div>
              <button className = "sidenav-button" onClick={this.changeTab} tab='0'>{t('Main.New Project')}</button>
              <button className = "sidenav-button" onClick={this.changeTab} tab='2'>{t('Main.More Image')}</button>
              <LoadImage tab = '1'/>
              {this.state.login_state ? 
              <div>
                <div className='dropdown-btn3'>
                  <button onClick={this.changeTab} tab='4'>{t('Main.Project')}</button>
                </div> 
                <div className='sidenav-user'>
                  {this.state.id}
                </div>
              </div> : null
              }
            </div>
            <div className='inner'>
              {tab[this.state.tab]}
            </div>
          </div>
        </div>
        <div className='right'>
          <button className='rightbtn'><i className="fas fa-bars"></i></button>
          {this.state.login_state ? 
          <div className='right-dropdown'>
            <button onClick={this.logoutClickHandler}>{i18next.t('Main.Signout')}</button>
            <Link to={{
              pathname: `/ChangePassword/${this.state.id}`,
            }}><button>{i18next.t('Login.ChangePW')}</button></Link>
            {/* <button>{i18next.t('Main.Delete account')}</button> */}
            <button onClick={this.withdrawalModalHandler}>{i18next.t('Main.Delete account')}</button>
            <button onClick = {this.changeToEnglish}>English</button>
            <button onClick = {this.changeToKorean}>한글</button>
          </div> :
          <div className='right-dropdown'>
            <Link to={{
              pathname: '/login',
            }}><button>{i18next.t('Main.Signin')}</button></Link>
            <Link to={{
              pathname: '/register',
            }}><button>{i18next.t('Main.Signup')}</button></Link>
            <button onClick = {this.changeToEnglish}>English</button>
            <button onClick = {this.changeToKorean}>한글</button>
          </div> }
        </div>
        {this.state.withdrawalModal ?
          <Withdrawal id={this.state.id} close={this.withdrawalModalHandler}></Withdrawal>:
          null
        }
      </div>
    )
  }
}
export default withTranslation()(Main);

