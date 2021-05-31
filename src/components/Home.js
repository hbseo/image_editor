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
                <h1>Image Edit</h1>
              </div>

              <div className="section-main">
                <div className = "section-text">
                  <h1>Simple and Powerful</h1>
                  If you need or want a Simple image editing, A big, heavy editor is unnecessary.
                  Our Editor is Simple and Fast. Try Cropping Images, Adding a Letter, etc.
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
                <h1>Make Your Image More Beautiful</h1>
              </div>
              <div className="section-main">
                <div className = "section-image">
                  <img id="first-img" src="/image/home2.png" alt="none"></img>
                </div>
                <div className = "section-text">
                  <h1>Image Filter</h1>
                  Apply the effect to the Image with a simple button click.
                  Brightness, Contrast, Blur, etc.
                  <br/>
                  FRACT provides 20+ filters.
                </div>
              </div>
            </div>
          </section>

          <section className = "container" id = "third-section">
            <div className="section-maindiv">
              <div className="section-title">
                <h1>Save and Load</h1>
              </div>
              <div className="section-main-col">
                <div className = "section-image">
                  <img id="first-img" src="/image/home3.png" alt="none"></img>
                </div>
                <div className = "section-text">
                  <h1>Save a Image or Your Work</h1>
                  Save the image or your work at any time you want. 
                  If you don't want to sign up, You can export your work to a file.
                  Once you sign up, You can save your work on a server.
                </div>
              </div>
            </div>
          </section>

          <section className = "container" id = "fourth-section">
            <div className="section-maindiv">
              <div className="section-title">
                <h1>No SignUp, No Signin </h1>
              </div>

              <div className="section-main">
                <div className = "section-text">
                  <h1>Without Login, You can use all features</h1>
                  The Only thing that needs to be sign in is to be saved on our Server.
                </div>
                <div className = "section-image">
                  <img id="first-img" src="/image/home4.png" alt="none"></img>
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