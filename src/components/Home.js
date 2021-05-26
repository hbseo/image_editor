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
            <a className="start-button" href="/main">Start →</a>

            
          </div>
        </div>
        <div className="home-container">
          <section className = "container" id = "first-section">
            <div className="section-maindiv">
              <div className="section-title">
                <h1>Make Your Image More Beautiful</h1>
              </div>

              <div className="section-main">
                <div className = "section-text">
                  <h1>뭔가 있어보이는 설명</h1>
                  필터에 대한 거 어쩌구 저쩌구필터에 대한 거 어쩌구 저쩌구
                  필터에 대한 거 어쩌구 저쩌구필터에 대한 거 어쩌구 저쩌구
                  필터에 대한 거 어쩌구 저쩌구필터에 대한 거 어쩌구 저쩌구
                </div>
                <div className = "section-image">
                  <img id="first-img" src="/image/home1.png" alt="none"></img>
                </div>
              </div>
            </div>
          </section>

          <section className = "container" id = "second-section">
            <div className="section-maindiv">
              <div className="section-title">
                <h1>그냥 있어보이는 말</h1>
              </div>
              <div className="section-main">
                <div className = "section-image">
                  <img id="first-img" src="/image/home1.png" alt="none"></img>
                </div>
                <div className = "section-text">
                  <h1>뭔가 있어보이는 설명</h1>
                  필터에 대한 거 어쩌구 저쩌구필터에 대한 거 어쩌구 저쩌구
                  필터에 대한 거 어쩌구 저쩌구필터에 대한 거 어쩌구 저쩌구
                  필터에 대한 거 어쩌구 저쩌구필터에 대한 거 어쩌구 저쩌구
                </div>
              </div>
            </div>
          </section>

          <section className = "container" id = "third-section">
            <div className="section-maindiv">
              <div className="section-title">
                <h1>하하하하 호호호호</h1>
              </div>
              <div className="section-main-col">
                <div className = "section-image">
                  <img id="first-img" src="/image/home1.png" alt="none"></img>
                </div>
                <div className = "section-text">
                  <h1>뭔가 있어보이는 설명</h1>
                  필터에 대한 거 어쩌구 저쩌구필터에 대한 거 어쩌구 저쩌구
                  필터에 대한 거 어쩌구 저쩌구필터에 대한 거 어쩌구 저쩌구
                  필터에 대한 거 어쩌구 저쩌구필터에 대한 거 어쩌구 저쩌구
                </div>
              </div>
            </div>
          </section>
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