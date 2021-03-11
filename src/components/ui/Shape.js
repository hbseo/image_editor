import React, {Component} from 'react';
import { ChromePicker, CompactPicker } from 'react-color';
import switchTools from '../helper/SwitchTools'
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
      strokeWidth: 1,
      isStrokeChecked: false,
      strokeColor:{
        r:'0',
        g:'0',
        b:'0',
        a:'1'
      }
    }
    this.spoid = {r :0, g:0, b:0, a:1};
  }
  componentDidMount(){
    // console.log('Shape UI Mount');
    this.documentUpdate();
  }
  componentDidUpdate(){
    // console.log('Shape UI Update');
    this.documentUpdate();
  }
  componentWillUnmount(){
    // console.log('Shape UI Unmount');
  }

  documentUpdate = () => {
    const type = this.props.object.type;
    if(type === 'circle' || type === 'ellipse' || type === 'rect' || type === 'triangle') {
      switchTools('stroke', false);
      this.handleShapeSelect(this.props.object);
    }
    else {
      switchTools('stroke', true);
    }
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

  handleStrokeClick = () => {
    new Promise((resolve) => {
      this.setState({isStrokeChecked: !this.state.isStrokeChecked});
      resolve();
    })
    .then(() => {
      if(this.state.isStrokeChecked) {
        this.props.setStroke(Number(this.state.strokeWidth));
      }
      else {
        this.props.setStroke(0);
      }
    })
  }

  handleStrokeChange = (event) => {
    const{name, value} = event.target;
    new Promise((resolve) => {
      this.setState({[name]: value});
      resolve();
    })
    .then(() => {
      this.props.setStroke(Number(this.state.strokeWidth));
    })
  }

  handleStrokeColorChange = (color) => {
    this.setState({ strokeColor:color.rgb });
  }

  handleStrokeColorChangeComplete = (color) => {
    this.props.setStrokeColor(color);
  }

  handleShapeSelect = (shape) => {
    // 
  }

  render(){
    const isStrokeChecked = this.state.isStrokeChecked;
    let ret;
    if(isStrokeChecked) {
      ret = <div id="strokeWidth">
              <input type="range" className="strokeWidth stroke" name="strokeWidth" min='0' max='100' 
                step='1' value={this.state.strokeWidth} onChange={this.handleStrokeChange}/>
              <CompactPicker name="strokeColor" className="stroke" color={ this.state.strokeColor } onChange={ this.handleStrokeColorChange } onChangeComplete = { this.handleStrokeColorChangeComplete }/>
            </div>
      }
    else ret = null;
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
          <div className="stroke">
            <input type="checkbox" className="stroke" name="stroke" text="stroke" onClick={this.handleStrokeClick}/>
            <label htmlFor="stroke">stroke</label>
            {ret}
          </div>
          <div className="option-title">Color</div>
          <div className="color-picker">
            <ChromePicker name="fillColor" color={ this.state.color } onChange={ this.handleColorChange } onChangeComplete = { this.handleColorChangeComplete }/>
          </div>
          <div>
            <button onClick = { this.handlePipette }>pipette</button>
          </div>
        </div>
      </div>
    );
  }
}