import React, { Component } from 'react';
import Test from './components/Test'
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      test:{name:'Hi'}
    }
  }
  render() {
    return (
      <div className="App">
        <Test
          name={this.state.test.name}>
        </Test>
      </div>
    );
  }

}

export default App;
