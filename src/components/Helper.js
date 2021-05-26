import React, { Component } from 'react';
import { withTranslation } from "react-i18next";
import { Link } from 'react-router-dom';
import '../css/Helper.scss';

class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      tab : 0
    }

  }

  render(){
    return(
      <div className="helper-div">
        <div className="top-div">
          How to Use
        </div>
        <div className="container">
          <div className="side-nav">
            <ul>
              <li><Link to= "/helper/1">Filter</Link></li>
              <li><Link to= "/helper/2">Cut</Link></li>  
            </ul>
          </div>
          <div className="main">

          </div>
        </div>
        
        <footer>
          <ul>
            <li><a href="https://github.com/hbseo/image_editor">Github</a></li>
            <li><a href="https://trello.com/b/INAP59Dv/image-editor">Trello</a></li>
            <li><a href="/helper">Helper</a></li>
            <li><a href="https://www.hanyang.ac.kr/web/eng/erica-campus1">Hanyang Erica</a></li>
          </ul>
          <p>Hanyang</p>
        </footer>        
      </div>
    )
  }
}
export default withTranslation()(Home);