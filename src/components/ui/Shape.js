import React, {Component} from 'react';
import { HEXtoRGBA } from '../helper/ConverRGB'
import i18next from "../../locale/i18n";
import { withTranslation } from "react-i18next";
import '../../css/ui/Shape.scss'

export default withTranslation()(class Shape extends Component {
  constructor(props){
    super(props);
    this.state = {
      color: {
        r: '0',
        g: '0',
        b: '0',
        a: '1'
      },
      hexcolor : '#000000'
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

  handleColorChange = (event) => {
    new Promise((resolve) => {
      let color = HEXtoRGBA(event.target.value, this.state.color.a)
      this.setState({ color : color, hexcolor : event.target.value});
      resolve(color);
    })
    .then((color) => {
      this.props.setColor({rgb : color});
    })
  }

  handleOpacityChange = (event) => {
    let change = this.state.color;
    change.a = event.target.value;
    this.setState({ color : change });
    this.props.setColor({rgb : this.state.color});
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
          {i18next.t('ui/shape.Shape')} ( {this.props.object.type} )
        </div>
        <div className="sub-shape">
          <div className="option-title">{i18next.t('ui/shape.Shape')}</div>
          <div className="shape-list">
            <button onClick={this.addShape} type="triangle">{i18next.t('ui/shape.Triangle')}</button>
            <button onClick={this.addShape} type="rectangle">{i18next.t('ui/shape.Rectangle')}</button>
            <button onClick={this.addShape} type="ellipse">{i18next.t('ui/shape.Ellipse')}</button>
            <button onClick={this.addShape} type="circle">{i18next.t('ui/shape.Circle')}</button>
          </div>
          <div className="option-title">{i18next.t('ui/shape.Adjust degree')}</div>
          <div className={this.props.object.type ==='circle' ? "circle-degree" : "circle-degree-disabled"}>
            <input 
            type="number" 
            name="endAngle" 
            min='0' 
            max='360' 
            step = '1' 
            value = {this.props.object && this.props.object.type ==='circle' ? (this.props.object.endAngle * 180 / Math.PI).toFixed(0) : 0} 
            disabled = {this.props.object.type ==='circle' ? false : true }
            onChange = {this.handleEndAngleChange}/>{i18next.t('ui/shape.Degree')}
          </div>
          <div className="option-title">{i18next.t('ui/shape.Line')}</div>
          <div className="line-list">
            <button onClick={this.addLine} type="line">{i18next.t('ui/shape.Line')}</button>
          </div>
          <div className="option-title">{i18next.t('ui/shape.Free making')}</div>
          <div className="free-making">
            <button onClick={this.props.makePolygonWithClick} type="line">{i18next.t('ui/shape.Click')}</button>
            <button onClick={this.props.makePolygonWithDrag} type="line">{i18next.t('ui/shape.Drag')}</button>
          </div>
          <div className="color-picker">            
            <input type="color" id="colorSource" value={this.state.hexcolor} onChange = { this.handleColorChange}/>
            <div className="cp-rangebox">
                <div>{i18next.t('ui/shape.Color opacity')}: {this.state.color.a}</div>
                <input type="range" value = {this.state.color.a} min='0' max='1' step='0.01' onChange = {this.handleOpacityChange} />
            </div>
          </div>
          {/* <div>
            <button onClick = { this.handlePipette }>{i18next.t('ui/shape.Pipette')}</button>
          </div> */}
        </div>
      </div>
    );
  }
})