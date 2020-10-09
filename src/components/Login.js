
import React from 'react';


class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      id: '',
      password: '',
      email: '',
      token: '',
      login_fail: true,
      login: false,
    };
    this.getCheck = this.getCheck.bind(this);
    this.postRegister = this.postRegister.bind(this);

    // this.getCheck()

  }

  componentDidMount() {

  }

  handleChange = (event) => {
    let change_state = {};
    change_state[event.target.name] = event.target.value;
    console.log(event.target.name, event.target.value, change_state);
    this.setState(change_state);
  }

  handleSubmit = (event) => {
    // fetch()
    event.preventDefault();
    this.postRegister_origin();
  }

  postRegister_origin() {
    console.log('post register');
    fetch('/register', {
      method: 'post',
      dataType: 'json',
      body: JSON.stringify({ id: this.state.id, password: this.state.password, email: this.state.email }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      // .then(res=>console.log(res))
      // .then(data => console.log(data))
      .then(data => this.setState({ idlist: JSON.stringify(data) }))
      .catch((error) => {
        console.log("error : ", error);
      });
  }

  postLogin() {
    fetch('/api/auth/login', {
      method: 'post',
      dataType: 'json',
      body: JSON.stringify({ id: this.state.id, password: this.state.password }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      // .then(data=>console.log(data))
      .then(data => this.setState({ token: data.token, login_fail: !data.state, login: data.state }))
      .then(data => this.getCheck())
      // .then(console.log('hahaha',this.state.token))
      // .then(data => console.log('whyrano', this.state.token, data))
      .catch((error) => {
        console.log("ff : ", error);
      });
    // console.log('whyrano2', this.state.token)
  }


  getCheck() {
    let tk = this.state.token;
    fetch('/api/auth/check', {
      method: 'get',
      headers: {
        'x-access-token': tk
      }
    })
      .then(res => res.json())
      .then(data => this.setState({ login: data.success, login_fail: !data.success }))
      .catch((error) => {
        console.log("check : ", error);
      });
  }

  postRegister() {
    fetch('/api/auth/register', {
      method: 'post',
      dataType: 'json',
      body: JSON.stringify({ id: this.state.id, password: this.state.password, email: this.state.email }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(res => console.log(res.json()))
  }

  handleLogin = (event) => {
    // fetch()
    event.preventDefault();
    this.postLogin()
  }



  render() {
    const login_fail = this.state.login_fail;
    let count = this.state.check_count
    let test_style;
    let login_state;
    const login_check = this.state.login;
    let check;
    if (login_check) {
      check = <p> 로그인 체크 ok</p>
      test_style = styles.login
    }
    else {
      check = <p> 로그인 nono</p>
      test_style = styles.nologin
    }

    if (!login_fail) {
      login_state = <p>로그인 되었다</p>
    }
    else {
      login_state = <p>로그인 안되어있다</p>
    }

    console.log('login_check', login_check, test_style)


    return (
      <div style={login_check ? styles.login : styles.nologin}>
        <h1>login</h1>

        <form onSubmit={this.handleSubmit}>
          <p>register</p>
           id : <input name="id" value={this.state.id} onChange={this.handleChange} />
           pw : <input name="password" value={this.state.password} onChange={this.handleChange} />
           email : <input name="email" value={this.state.email} onChange={this.handleChange} />

          <input type="submit" value="Submit" disabled />
          {this.state.search}
        </form>

        <hr />


        <form onSubmit={this.handleLogin}>
          <p>login</p>
           id : <input name="id" value={this.state.id} onChange={this.handleChange} />
           pw : <input name="password" value={this.state.password} onChange={this.handleChange} />
           email : <input name="email" value={this.state.email} onChange={this.handleChange} />

          <input type="submit" value="Submit" />
          {login_state}

        </form>

        <hr />

        <button onClick={this.getCheck}>로그인 되어있니?</button>
        {check}
        <p>{count}</p>

        <hr />
        <button onClick={this.postRegister}>register</button>

      </div>
    )
  }
}

const styles = {

  login: {
    color: '#ff0e0f',
    backgroundColor: '#ffc107',
  },
  nologin: {
    color: '#1700eb',
    backgroundColor: '#c5f4c5',
  }

}

export default Login;
