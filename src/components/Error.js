import React from 'react';
import './Error.css'

class Error extends React.Component {
  render() {
    return (
      <div id="main">      
        <p id="msg">
          <i class="fas fa-sad-tear"></i>
          404 Not FOUND
        </p>
      </div>
    )
  }
}
export default Error;
