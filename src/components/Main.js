import React, { Component } from 'react';
import Project from './Project';
import Login from './Login';
import Newproject from './New_project';
import LoadImage from './LoadImage';
import '../css/Main.scss';
import { withTranslation } from "react-i18next";
import i18next from "../locale/i18n";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab : 0,
      login_state: false,
      id : ''
    }
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
    this.setState({login_state: false});
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
          <div className='sidenav'>
            <button onClick={this.changeTab} tab='0'>{t('Main.New Project')}</button>
            <button className='dropdown-btn'>{t('Main.Load Image')}</button>
            <div className='dropdown-container'>
              <button onClick={this.changeTab} tab='1'>{t('Main.Upload File')}</button>
              <button onClick={this.changeTab} tab='2'>{t('Main.More Image')}</button>
              <button onClick={this.changeTab} tab='3'>{t('Main.SignIn')}</button>
            </div>
            {this.state.login_state ? 
            <div className='dropdown-btn'>
              <button onClick={this.changeTab} tab='4'>{t('Main.Project')}</button>
            </div> : null
            }
          </div>
          <div className='inner'>
            {tab[this.state.tab]}
          </div>
        </div>
        <div className='right'>
            <button className='rightbtn'>{t('Main.More')}</button>
            <div className='right-dropdown'>
              <button>{t('Main.Signin')}</button>
              <button>{t('Main.Setting')}</button>
              <button onClick = {this.changeToEnglish}>English</button>
              <button onClick = {this.changeToKorean}>한글</button>
            </div>
          </div>
      </div>
    )
  }
}
export default withTranslation()(Main);

