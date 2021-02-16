import React, {Component} from 'react';
import { ChromePicker } from 'react-color';
import '../../css/ui/Shape.scss'

export default class Shape extends Component {
  constructor(props){
    super(props);
    this.state = {
      color: {
        r: '0',
        g: '0',
        b: '0',
        a: '1'
      },
    }
    this.spoid = {r :0, g:0, b:0, a:1};
  }
  componentDidMount(){
    // console.log('Shape UI Mount');
  }
  componentDidUpdate(){
    // console.log('Shape UI Update');
  }
  componentWillUnmount(){
    // console.log('Shape UI Unmount');
  }

  addShape = (event) => {
    this.props.addShape(event.target.getAttribute('type'), this.state.color);
  }

  handleEndAngleChange = (event) => {
    this.props.setEndAngle(event.target.value)
  }

  handleColorChange = (color) => {
    this.setState({ color: color.rgb })
  }

  handleColorChangeComplete = (color) => {
    this.props.setColor(color);
  }

  setColor = (color) => {
    this.setState({ color: color })
  }

  handlePipette = () => {
    this.props.pipette.enablePipette(this.setColor); 
  }

  render(){
    return (
      <div className="sub">
        <div className="sub-title">
            Shape ( {this.props.object.type} )
        </div>
        <div className="sub-shape">
          <div className="option-title">Shape</div>
          <div className="shape-list">
            <button onClick={this.addShape} type="triangle">삼각형</button>
            <button onClick={this.addShape} type="rectangle">직사각형</button>
            <button onClick={this.addShape} type="ellipse">타원</button>
            <button onClick={this.addShape} type="circle">원</button>
          </div>
          <div className="option-title">Line</div>
          <div className="line-list">
            <button onClick={this.props.addLine} type="line">직선</button>
          </div>
          <div className="option-title">Free making</div>
          <div className="free-making">
            <button onClick={this.props.makePolygonWithClick} type="line">Click</button>
            <button onClick={this.props.makePolygonWithDrag} type="line">Drag</button>
          </div>
          { this.props.object.type === "circle" ? 
            <div>
              <input type="number" name="endAngle" min='0' max='360' step = '0' value = {this.props.object.endAngle * 180 / Math.PI} onChange = {this.handleEndAngleChange}/>degree
            </div> : <div></div>
          }
          <div className="option-title">Color</div>
          <div className="color-picker">
            <ChromePicker color={ this.state.color } onChange={ this.handleColorChange } onChangeComplete = { this.handleColorChangeComplete }/>
          </div>
          <div>
            <button onClick = { this.handlePipette }>pipette</button>
          </div>
        </div>
      </div>
    );
  }
}