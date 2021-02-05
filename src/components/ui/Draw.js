import React, {Component} from 'react';
import { SketchPicker } from 'react-color';

export default class Draw extends Component{
  constructor(props){
    super(props);
    this.state = { 
      color: {
        r: '255',
        g: '255',
        b: '255',
        a: '1',
      },
      lineWidth : 10,
    };
    this.brush = ['pencilBrush', 'circleBrush', 'patternBrush', 'sprayBrush', 'vLinePatternBrush', 'hLinePatternBrush', 'squarePatternBrush', 'diamondPatternBrush'];
  }

  componentDidMount(){
    console.log('Draw UI Mount');
    this.props.openDrawing();
  }
  componentDidUpdate(){
    console.log('Draw UI Update');
  }
  componentWillUnmount(){
    console.log('Draw UI Unmount');
    this.props.closeDrawing();
  }

  handleColorChange = (color) => {
    this.setState({ color: color.rgb})
  }

  handleColorChangeComplete = (color) => {
    this.setState({ color: color.rgb})
    let rgb = "rgb(" + this.state.color['r'] + ", " + this.state.color['g'] + ", " + this.state.color['b'] + ", " + this.state.color['a'] +")"
    this.props.changeDrawingColor(rgb);
  }

  handleDrawingWidth = (event) => {
    const value = event.target.value;
    this.setState( {lineWidth: value} );
    this.props.changeDrawingWidth(parseInt(this.state.lineWidth, 10));
  }

  handleDrawingBrush = (event) => {
    let rgb = "rgb(" + this.state.color['r'] + ", " + this.state.color['g'] + ", " + this.state.color['b'] + ", " + this.state.color['a'] +")"
    this.props.changeDrawingBrush(event.target.value, rgb, this.state.lineWidth);
  }

  brushListUp = () => {
    let i = 0;
    return this.brush.map(br => (<option key={i++} value={i}>{br}</option>));
  }

  render(){
    return (
      <div className="sub">
        <div className="sub-title">
            Draw ( {this.props.object.type} )
        </div>
        <div className="sub-filters">
          <div className="select-brush">
            <div className="option-title">Brush type</div>
            <div>
              <select className='text' name='brush' text='brush' onChange={this.handleDrawingBrush}>
                {this.brushListUp()}
              </select>
            </div>
          </div>
          <div className="select-width"> 
            <div className="option-title">Width</div>
            <input type='range' className='drawing' id='width' min='0' max='60' name='width' step='1' value={this.state.lineWidth} onChange={this.handleDrawingWidth}/>
          </div>
          <div className="color-picker">
            <div className="option-title">Line Color</div>
            <div>
              <SketchPicker color={ this.state.color } onChange = {this.handleColorChange} onChangeComplete={this.handleColorChangeComplete} />
            </div>
          </div>
        </div>
      </div>
      
    );
  }
}