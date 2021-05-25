import React, { Component } from 'react';
import { withTranslation } from "react-i18next";
import '../css/Home.scss';

class Home extends Component {
  render(){
    return(
      <div className="home-div">
        <div className="home-top-div">
          <div className="home-top-div-name">
            <h1>FRACT</h1>
          </div>
          <div className="home-top-div-start">
            <button>
              <a href="/main">START</a>
            </button>
          </div>
        </div>
        <div className="home-container">
          <section id = "test1">
            <div className="test1-test">
              <div id="test1-title">
                <h1>Make Your Image More Beautiful</h1>
              </div>
              <img src="/image/home1.png" alt="none"></img>
            </div>
            
          </section>
          <section id = "test2">bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb</section>
          <section id = "test3">cccccccccccccccccccccccccccccccccccc</section>
        </div>        
      </div>
    )
  }
}
export default withTranslation()(Home);