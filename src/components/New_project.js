import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../css/New_project.scss';

class New_project extends Component {

  constructor(props) {
    super(props);
    this.state = {width: 5, height: 5}
  }

  renderLink = (width, height) => {
    if (width === 0 || height === 0) {
      return <p>no link</p>
    }
    return <div className="link-container">
      <Link to={{
      pathname: '/edit',
      state: {
        width: width,
        height: height,
      }
      }}>
        <div className="new-link"></div> 
      </Link>
      <div className='description'>{width}X{height}</div> 
    </div>
  }

  handleChange = (event) => {
    const {name, value} = event.target;
    this.setState({[name]: value});
  }

  render() {
    return (
      <div className='New_project'>
        <div className="option-title">Select Size</div>
        <ul className='canvas-list-ul'>
          <li className="canvas-list">
              {this.renderLink(800, 600)}
          </li>
          <li className="canvas-list">
              {this.renderLink(360, 360)}
          </li>
          <li className="canvas-list">
              {this.renderLink(1280, 720)}
          </li>
          <li className="canvas-list">
              {this.renderLink(1920, 1080)}
          </li>
          <li className="canvas-list">
              {this.renderLink(512, 512)}
          </li>
          <li className="canvas-list">
              {this.renderLink(1080, 1080)}
          </li>
          <li className="canvas-list">
              {this.renderLink(2048, 2048)}
          </li>
          <li className="canvas-list">
              {this.renderLink(600, 600)}
          </li>
        </ul>
        <div className="option-title">Direct Input</div>
        <div className="new-project-input">
          <div className="direct-input-button">
            <div className="input-group">
              <input type="number" name="width" value={this.state.width} onChange={this.handleChange} min="5" />
              <label htmlFor="width">Width:</label>
            </div>
            <div className="input-group">
              <input type="number" name="height" value={this.state.height} onChange={this.handleChange} min="5" />
              <label htmlFor="height">Height:</label>
            </div>
          </div>
          <span>{this.renderLink(this.state.width, this.state.height)}</span>
        </div>
      </div>
    )
  }
}

export default New_project;