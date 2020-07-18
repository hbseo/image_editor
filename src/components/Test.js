import React, { Component } from 'react';

class Test extends Component {
  render() {
    return (
      <header>
        <h1>{this.props.name}</h1>
      </header>
    );
  }
}

export default Test;