import React, {Component} from 'react';
export default class Rotation extends Component{
  constructor(props){
    super(props);
    this.state = {angle : 0}
  }

  componentDidMount(){
    console.log('Rotation UI Mount');
  }
  componentDidUpdate(){
    console.log('Rotation UI Update');
  }
  componentWillUnmount(){
    console.log('Rotation UI Unmount');
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

  render(){
    return (
      <div className="sub">
        <div className="sub-title">
            Rotation ( {this.props.object.type} : {this.props.object.angle})
        </div>
        <div className="sub-filters">
          <div>
            <button onClick={this.setAngle} angle='0' > 각도 0</button>
          </div>
          <div>
            <button onClick={this.setAngle} angle='90' > 각도 90</button>
          </div>
          <div>
            <button onClick={this.setAngle} angle='180' > 각도 180</button>
          </div>
          <div>
            <button onClick={this.setAngle} angle='270' > 각도 270</button>
          </div>
          <div>
            <button onClick={this.rotateObject} angle='30' > 시계방향 30</button>
          </div>
          <div>
            <button onClick={this.rotateObject} angle='-30' > 반시계방향 30</button>
          </div>
          <div>
            <input
              type='number'
              name='angle'
              min='-360'
              max='360'
              step='1'
              value={this.props.object.type !== 'not active' ? this.props.object.angle : 0}
              onChange={this.handleAngleChange}
            />
          </div>
        </div>
      </div>
    );
  }

}