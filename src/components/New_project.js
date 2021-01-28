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
    return <div><Link to={{
      pathname: '/edit',
      state: {
        width: width,
        height: height,
      }
    }}><img className="canvas-icon" src='./image/photo.svg'></img></Link>
      <p className='description'>{width}X{height}</p></div>
  }

  handleChange = (event) => {
    const {name, value} = event.target;
    this.setState({[name]: value});
  }

  render() {
    return (
      <div className='New_project'>
        <ul className='canvas-list-ul'>
          <li className="canvas-list">
            <div id="select-canvas-size">
              {this.renderLink(800, 600)}
            </div>
          </li>
          <li className="canvas-list">
            <div id="select-canvas-size">
              {this.renderLink(360, 360)}
            </div>
          </li>
          <li className="canvas-list">
            <div id="select-canvas-size">
              {this.renderLink(1280, 720)}
            </div>
          </li>
          <li className="canvas-list">
            <div id="select-canvas-size">
              {this.renderLink(1920, 1080)}
            </div>
          </li>
          <li className="canvas-list">
            <div id="select-canvas-size">
              {this.renderLink(512, 512)}
            </div>
          </li>
          <li className="canvas-list">
            <div id="select-canvas-size">
              {this.renderLink(1080, 1080)}
            </div>
          </li>
          <li className="canvas-list">
            <div id="select-canvas-size">
              {this.renderLink(2048, 2048)}
            </div>
          </li>
          <li className="canvas-list">
            <div id="select-canvas-size">
              {this.renderLink(600, 600)}
            </div>
          </li>
        </ul>
        <div>
          <input type="number" name="width" value={this.state.width} onChange={this.handleChange} min="5" />
          <input type="number" name="height" value={this.state.height} onChange={this.handleChange} min="5" />
          <span>{this.renderLink(this.state.width, this.state.height)}</span>
        </div>
      </div>
    )
  }
}

export default New_project;