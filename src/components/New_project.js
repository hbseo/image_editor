import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import i18next from "../locale/i18n";
import { withTranslation } from "react-i18next";
import '../css/New_project.scss';
import debounce from 'lodash/debounce';

class New_project extends Component {

  constructor(props) {
    super(props);
    this.state = {width: 500, height: 500, input : false}
  }

  renderLink = (width, height) => {
    if (width === 0 || height === 0) {
      return <p>no link</p>
    }
    return <div className="link-container">
      <Link className="edit-link" to={{
      pathname: '/edit',
      state: {
        width: width,
        height: height,
      }
      }}>
        <div className="new-link"><i className="far fa-image"></i></div> 
      </Link>
      <div className='description'>{width}X{height}</div> 
    </div>
  }

  handleChange = (event) => {
    const {name, value} = event.target;
    new Promise((resolve) => {
      this.setState({[name]: value});
      resolve()
    })
    .then(() => {
      this.sizeCheck();
    })
  }

  sizeCheck = debounce(() => {
    if(this.state.width < 10){
      this.setState({width : 10})
    }
    if(this.state.width > 5000){
      this.setState({width : 5000})
    }
    if(this.state.height < 10){
      this.setState({height : 10})
    }
    if(this.state.height > 5000){
      this.setState({height : 5000})
    }
  }, 400)

  render() {
    return (
      <div className='New_project'>
        <div className="option-title">{i18next.t('New_Project.Select Size')}</div>
        <div className="canvas-list-div">
          <ul className='canvas-list-ul'>
            <li className="canvas-list">
                {this.renderLink(150, 150)}
            </li>
            <li className="canvas-list">
                {this.renderLink(300, 300)}
            </li>
            <li className="canvas-list">
                {this.renderLink(360, 360)}
            </li>
            <li className="canvas-list">
                {this.renderLink(512, 512)}
            </li>
            <li className="canvas-list">
                {this.renderLink(600, 600)}
            </li>
            <li className="canvas-list">
                {this.renderLink(640, 480)}
            </li>
            <li className="canvas-list">
                {this.renderLink(800, 480)}
            </li>
            <li className="canvas-list">
                {this.renderLink(800, 600)}
            </li>
            <li className="canvas-list">
                {this.renderLink(1080, 1080)}
            </li>
            <li className="canvas-list">
                {this.renderLink(1280, 720)}
            </li>
            <li className="canvas-list">
                {this.renderLink(1920, 1080)}
            </li>
            <li className="canvas-list">
                {this.renderLink(2048, 2048)}
            </li>
          </ul>
        </div>
        {/* <div className="option-title">{i18next.t('New_Project.Direct Input')}</div> */}
        <div className="new-project-input">
          <div className="direct-input-button">
            <div className="input-group">
              <label htmlFor="width">{i18next.t('New_Project.Width')}</label>
              <input type="number" name="width" value={this.state.width} onChange={this.handleChange} min="10" max="5000"/>
            </div>
            <div className="input-group">
              <label htmlFor="height">{i18next.t('New_Project.Height')}</label>
              <input type="number" name="height" value={this.state.height} onChange={this.handleChange} min="10" max="5000"/>
            </div>
          </div>
          <div className="render-button">
            {this.renderLink(this.state.width, this.state.height)}
          </div>
        </div>
      </div>
    )
  }
}

export default withTranslation()(New_project);