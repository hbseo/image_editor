import React, {Component} from 'react';
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
    // this.documentUpdate();
  }
  componentDidUpdate(){
    // console.log('Shape UI Update');
    // this.documentUpdate();
  }
  componentWillUnmount(){
    // console.log('Shape UI Unmount');
  }

  documentUpdate = () => {

  }

  addShape = (event) => {
    this.props.addShape(event.target.getAttribute('type'), this.state.color);
  }

  addLine = (event) => {
    this.props.addLine({ color : this.state.color});
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

  handleShapeSelect = (shape) => {
    // 
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
            <button onClick={this.addLine} type="line">직선</button>
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
          <div>
            <button onClick = { this.handlePipette }>pipette</button>
          </div>
        </div>
      </div>
    );
  }
}