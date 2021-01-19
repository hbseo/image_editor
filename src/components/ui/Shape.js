import React, {Component} from 'react';
// import './Text.scss'
export default class Shape extends Component {
  constructor(props){
    super(props);
  }
  componentDidMount(){
    console.log('Shape UI Mount');
  }
  componentDidUpdate(){
    console.log('Shape UI Update');
  }
  componentWillUnmount(){
    console.log('Shape UI Unmount');
  }

  addShape = (event) => {
    console.log(event.target.getAttribute('type'))
    this.props.addShape(event.target.getAttribute('type'));
  }

  handleEndAngleChange = (event) => {
    this.props.setEndAngle(event.target.value)
  }

  render(){
    return (
      <div className="sub">
        <div className="sub-title">
            Shape ( {this.props.object.type} )
        </div>
        <div className="sub-filters">
          <div>
            <button onClick={this.addShape} type="triangle">삼각형</button>
          </div>
          <div>
            <button onClick={this.addShape} type="rectangle">직사각형</button>
          </div>
          <div>
            <button onClick={this.addShape} type="ellipse">타원</button>
          </div>
          <div>
            <button onClick={this.addShape} type="circle">원</button>
          </div>
          <div>
            <button onClick={this.props.addLine} type="line">직선</button>
          </div>
          <div>
            <button onClick={this.props.makePolygonWithClick} type="line">클릭으로 만들기</button>
          </div>
          <div>
            <button onClick={this.props.makePolygonWithDrag} type="line">드래그로 만들기</button>
          </div>
          { this.props.object.type === "circle" ? 
            <div>
              <input type="number" name="endAngle" min='0' max='360' step = '0' value = {this.props.object.endAngle * 180 / Math.PI} onChange = {this.handleEndAngleChange}/>degree
            </div> : <div></div>
          }
        </div>
      </div>
    );
  }
}