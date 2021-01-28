import React from 'react';
import '../css/Error.scss'

class Error extends React.Component {
  render() {
    return (
      <div id="main">      
        <p id="number">
          4<i className="fas fa-spinner fa-spin"></i>4
        </p>
       
        <p id="not_found">
          Not Found
          <br/>
          <i className="fas fa-sad-tear"></i>
        </p>
      </div>
    )
  }
}
export default Error;
