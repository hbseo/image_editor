import React, {Component} from 'react';
import { SketchPicker } from 'react-color';
import {convertRGB, HEXtoRGB} from '../helper/ConverRGB'
import '../../css/ui/Draw.scss';
import pencilBrush from '../../css/img/brush/pencilBrush.JPG';
import circleBrush from '../../css/img/brush/circleBrush.JPG';
import patternBrush from '../../css/img/brush/patternBrush.JPG';
import sprayPatternBrush from '../../css/img/brush/sprayPatternBrush.JPG';
import vLinePatternBrush from '../../css/img/brush/vLinePatternBrush.JPG';
import hLinePatternBrush from '../../css/img/brush/hLinePatternBrush.JPG';
import squarePatternBrush from '../../css/img/brush/squarePatternBrush.JPG';
import diamondPatternBrush from '../../css/img/brush/diamondPatternBrush.JPG';

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
      showbrush: false,
      brush_now: 'pencilBrush'
    };
    this.brush = ['pencilBrush', 'circleBrush', 'patternBrush', 'sprayBrush', 'vLinePatternBrush', 'hLinePatternBrush', 'squarePatternBrush', 'diamondPatternBrush'];
    this.img = [pencilBrush, circleBrush, patternBrush, sprayPatternBrush, vLinePatternBrush, hLinePatternBrush, squarePatternBrush, diamondPatternBrush];
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
    this.props.changeDrawingColor(convertRGB(this.state.color));
  }

  handleDrawingWidth = (event) => {
    const value = event.target.value;
    this.setState( {lineWidth: value} );
    this.props.changeDrawingWidth(parseInt(this.state.lineWidth, 10));
  }

  handleDrawingBrush = (brush) => {
    this.setState({brush_now: brush,showbrush: false});
    this.props.changeDrawingBrush(this.brush.indexOf(brush), convertRGB(this.state.color) , this.state.lineWidth);
  }

  brushListUp = () => {
    let i = 0;
    return this.brush.map(br => (
      <img className="brush_img" src={this.img[i++]} alt={br} onClick={(e) => this.handleDrawingBrush(br, e)}></img>
    ))
  }

  handlebrushbutton = () => {
    this.setState({showbrush: !this.state.showbrush});
  }

  render(){
    return (
      <div className="sub">
        <div className="sub-title">
            Draw ( {this.props.object.type} )
        </div>
        <div className="sub-filters">
          <div className="option-title">Brush type</div> 
          <div className="select-brush">
            <div>
              <button onClick={this.handlebrushbutton}><img src={this.img[this.brush.indexOf(this.state.brush_now)]} alt={this.state.brush_now}></img></button>
              {this.state.showbrush ? 
                <ul className="brush_ul">
                  {this.brushListUp()}
                </ul>
                : null
              }
            </div>
          </div>
          <div className="option-title">Width</div>
          <div className="select-width">
            <input type='range' className='drawing' id='width' min='0' max='60' name='width' step='1' value={this.state.lineWidth} onChange={this.handleDrawingWidth}/>
          </div>
          <div className="option-title">Line Color</div>
          <div className="color-picker">
            <div>
              <SketchPicker color={ this.state.color } onChange = {this.handleColorChange} onChangeComplete={this.handleColorChangeComplete} />
            </div>
          </div>
        </div>
      </div>
      
    );
  }
}