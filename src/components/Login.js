import React, { Component } from 'react';
import Modal from 'react-awesome-modal';
import SignIn from './SignIn';
import SignUp from './SignUp';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      state: 'SignIn',
      visible : false,
    };
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
  render() {
    let view;
    if(this.state.state === 'SignIn') {
      view = <SignIn set_State={this.changeState} close={this.closeModal}/>;
    }
    else if(this.state.state === 'SignUp') {
      view = <SignUp set_State={this.changeState} close={this.closeModal}/>;
    }
    return (
      <div className='login'>
        <button onClick={this.openModal}>로그인</button>
        <Modal visible={this.state.visible} width='300' height='400' effect='fadeInDown' onClickAway={this.closeModal}>
          {view}
        </Modal>
      </div>
    )
  }
}

export default Login;