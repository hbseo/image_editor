import React, {Component} from 'react';
import i18next from "../../locale/i18n";
import { withTranslation } from "react-i18next";
import { RotationIcon } from '../const/consts'
import '../../css/ui/Rotation.scss';

export default withTranslation()(class Rotation extends Component{
  constructor(props){
    super(props);
    this.state = {angle : 0}
  }

  componentDidMount(){
    // console.log('Rotation UI Mount');
  }
  componentDidUpdate(){
    // console.log('Rotation UI Update');
  }
  componentWillUnmount(){
    // console.log('Rotation UI Unmount');
  }

  handleAngleChange = (event) => {
    this.props.setObjectAngle(event.target.value);
  }

  rotateObject = (event) => {
    var angle = event.target.getAttribute('angle');
    this.props.rotateObjectAngle(Number(angle));
  }

  setAngle = (event) => {
    var changeAngle = event.target.getAttribute('angle');
    this.props.setObjectAngle(Number(changeAngle));
  }

  angleValue = () => {
    if(this.props.object.type !== 'not active'){
      return this.props.object.angle;
    }
    else if(this.props.getBackgroundImage()){
      // console.log(this.props.getBackgroundImage().angle)
      return this.props.getBackgroundImage().angle
    }
    else{
      return 0
    }
  }

  render(){
    return (
      <div className="sub">
        <div className="sub-title">
          {i18next.t('ui/rotation.Rotation')} ( {this.props.object.type} : {this.props.object.angle})
        </div>
        <div className="sub-rotatemenu">
          <div className="rotate-degree">
            <div className="option-title">
              {i18next.t('ui/rotation.Set angle')}
            </div>
            <div className="degree-button">
              <button onClick={this.setAngle} angle='0' >0</button>
              <button onClick={this.setAngle} angle='90' >90</button>
              <button onClick={this.setAngle} angle='180' >180</button>
              <button onClick={this.setAngle} angle='270' >270</button>
            </div>
          </div>
          <div className="rotate-clock">
            <div className="option-title">
              {i18next.t('ui/rotation.Rotate 30')}
            </div>
            <div className="clock-button">
              <div>
                <button id="clockwise" onClick={this.rotateObject} angle='-30'>
                  <svg className="rotation-svg" id="left-icon" version="1.1" viewBox="0 0 486.805 486.805" onClick={this.rotateObject} angle='-30'>
                    <path d = {RotationIcon.left} />
                  </svg>
                </button>
              </div>
              <div>
                <button id="c-clockwise" onClick={this.rotateObject} angle='30'>
                  <svg className="rotation-svg" version="1.1" viewBox="0 0 80 80 " onClick={this.rotateObject} angle='30'>
                    <path d = {RotationIcon.right} />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="rotate-input">
            <label htmlFor="angle" className="option-title">{i18next.t('ui/rotation.Direct Input')}</label>
            <input
              type='number'
              name='angle'
              min='-360'
              max='360'
              step='1'
              placeholder='0'
              value={this.angleValue()}
              onChange={this.handleAngleChange}
            />
          </div>
        </div>
      </div>
    );
  }
})