import React, {Component} from 'react';
import {convertRGB, HEXtoRGBA } from '../helper/ConverRGB'
import i18next from "../../locale/i18n";
import { withTranslation } from "react-i18next";
import '../../css/ui/Draw.scss';
import pencilBrush from '../../css/img/brush/pencilBrush.png';
import circleBrush from '../../css/img/brush/circleBrush.png';
import patternBrush from '../../css/img/brush/patternBrush.png';
import sprayPatternBrush from '../../css/img/brush/sprayPatternBrush.png';
import vLinePatternBrush from '../../css/img/brush/vLinePatternBrush.png';
import hLinePatternBrush from '../../css/img/brush/hLinePatternBrush.png';
import squarePatternBrush from '../../css/img/brush/squarePatternBrush.png';
import diamondPatternBrush from '../../css/img/brush/diamondPatternBrush.png';

export default withTranslation()(class Draw extends Component{
  constructor(props){
    super(props);
    this.state = { 
      color: {
        r: '0',
        g: '0',
        b: '0',
        a: '1',
      },
      mode : false,
      hexcolor : "#000000",
      lineWidth : 10,
      showbrush: false,
      brush_now: 'pencilBrush'
    };
    this.brush = ['pencilBrush', 'circleBrush', 'patternBrush', 'sprayBrush', 'vLinePatternBrush', 'hLinePatternBrush', 'squarePatternBrush', 'diamondPatternBrush'];
    this.img = [pencilBrush, circleBrush, patternBrush, sprayPatternBrush, vLinePatternBrush, hLinePatternBrush, squarePatternBrush, diamondPatternBrush];
  }

  componentDidMount(){
    console.log('Draw UI Mount');
  }
  componentDidUpdate(){
    console.log('Draw UI Update');
  }
  componentWillUnmount(){
    console.log('Draw UI Unmount');
    this.props.closeDrawing();
  }

  handleColorChange = (event) => {
    new Promise((resolve) => {
      this.setState({ color : HEXtoRGBA(event.target.value, this.state.color.a), hexcolor : event.target.value});
      resolve();
    })
    .then(() => {
      this.props.changeDrawingColor(convertRGB(this.state.color));
    })
  }

  handleOpacityChange = (event) => {
    let change = this.state.color;
    change.a = event.target.value;
    this.setState({ color : change });
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
      <img className="brush_img" src={this.img[i++]} key = {i} alt={br} onClick={(e) => this.handleDrawingBrush(br, e)}></img>
    ))
  }

  handlebrushbutton = () => {
    this.setState({showbrush: !this.state.showbrush});
  }

  openDrawing = () => {
    this.props.openDrawing(this.state.lineWidth)
    this.setState({mode : true});
  }

  closeDrawing = () => {
    this.setState({mode : false});
    this.props.closeDrawing();
  }

  render(){
    return (
      <div className="sub">
        <div className="sub-title">
          {i18next.t('ui/draw.Draw')} ( {this.props.object.type} )
        </div>
        <div className="sub-draw">

          <div className="option-title">{i18next.t('ui/draw.Draw Mode')}</div>
          <div className="mode-select">
            <button className={this.state.mode ? "selected-button" : "unselected-button" } onClick={this.openDrawing}>Draw</button>
            <button className={this.state.mode ? "unselected-button" : "selected-button" } onClick={this.closeDrawing}>Select</button>
          </div>

          <div className="option-title">{i18next.t('ui/draw.Brush type')}</div> 
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
            <div className="brush-title">
              {this.state.brush_now}
            </div>
          </div>
          <div className="option-title">{i18next.t('ui/draw.Width')}</div>
          <div className="select-width">
            <input type='range' className='drawing' id='width' min='1' max='100' name='width' step='1' value={this.state.lineWidth} onChange={this.handleDrawingWidth}/>
            <div>{this.state.lineWidth}</div>
          </div>
          <div className="option-title">{i18next.t('ui/draw.Line Color')}</div>
          <div className="color-picker">
            <input type="color" id="colorSource" value={this.state.hexcolor} onChange = { this.handleColorChange }/>
            <div className="cp-rangebox">
                <div>{i18next.t('ui/draw.Color opacity')}: {this.state.color.a}</div>
                <input type="range" value = {this.state.color.a} min='0' max='1' step='0.01' onChange = {this.handleOpacityChange} />
            </div>
          </div>
        </div>
      </div>
      
    );
  }
})