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
    let rgb = "rgb(" + this.state.color['r'] + ", " + this.state.color['g'] + ", " + this.state.color['b'] + ")"
    this.props.changeDrawingColor(rgb);
  }

  handleDrawingWidth = (event) => {
    const value = event.target.value;
    this.setState( {lineWidth: value} );
    this.props.changeDrawingWidth(parseInt(this.state.lineWidth, 10));
  }

  render(){
    return (
      <div className="sub">
        <div className="sub-title">
            Draw ( {this.props.object.type} )
        </div>
        <div className="sub-filters">
          <div> 
            <label>Width</label><input type='range' className='drawing' id='width' min='0' max='60' name='width' step='1' value={this.state.lineWidth} onChange={this.handleDrawingWidth}/>
          </div>
        </div>
        <div>
          <label>Line Color</label>
          <SketchPicker color={ this.state.color } onChange = {this.handleColorChange} onChangeComplete={this.handleColorChangeComplete} />
        </div>
      </div>
      
    );
  }
}