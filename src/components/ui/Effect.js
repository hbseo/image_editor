import React, {Component} from 'react';
import {convertRGB, HEXtoRGBA } from '../helper/ConverRGB';
import i18next from "../../locale/i18n";
import { withTranslation } from "react-i18next";
export default withTranslation()(class Effect extends Component {
  constructor(props){
    super(props);
    this.state = {
      blur : 30, //shadow
      offsetX : 10, //shadow
      offsetY: 10, //shadow
      color: {
        r: '0',
        g: '0',
        b: '0',
        a: '1'
      },
      hexcolor : "#000000",
      strokeWidth: 5,
      strokeColor:{
        r:'0',
        g:'0',
        b:'0',
        a:'1'
      },
      hexstrokeColor : "#000000",
    }
    this.spoid = {r :0, g:0, b:0, a:1};
  }
  componentDidMount(){
    // console.log('Effect UI Mount');
    this.documentUpdate();
  }
  componentDidUpdate(){
    // console.log('Effect UI Update');
    this.documentUpdate();
  }
  componentWillUnmount(){
    // console.log('Effect UI Unmount');
  }

  documentUpdate = () => {
    if(this.props.object.type !== "not active"){
      if(this.props.object.shadow){
        document.getElementById('shadow_toggle').checked = true;
      }
      else{
        document.getElementById('shadow_toggle').checked = false;
      }
      document.getElementById('shadow_toggle').disabled = false;
    }
    else{
      document.getElementById('shadow_toggle').disabled = true;
    }

  }

  handleShadowChange = (event) => {
    let change_state = {};
    change_state[event.target.name] = event.target.value
    this.setState(change_state);
    this.props.setShadow({color : convertRGB(this.state.color), blur : this.state.blur, offsetX : this.state.offsetX, offsetY : this.state.offsetY});
  }

  toggleShadow = (event) => {
    if(event.target.checked){
      this.props.setShadow({color : convertRGB(this.state.color) , blur : this.state.blur, offsetX : this.state.offsetX, offsetY : this.state.offsetY});
    }
    else{
      this.props.removeShadow();
    }
  }


  handleColorChange = (event) => {
    new Promise((resolve) => {
      let color = HEXtoRGBA(event.target.value, this.state.color.a);
      this.setState({ color : color, hexcolor : event.target.value});
      resolve(color);
    })
    .then((color) => {
      if(document.getElementById("shadow_toggle").checked){
        this.props.setShadow({color : convertRGB(color), blur : this.state.blur, offsetX : this.state.offsetX, offsetY : this.state.offsetY});
      }
    })
  }

  handleOpacityChange = (event) => {
    let change = this.state.color;
    change.a = event.target.value;
    this.setState({ color : change });
    this.props.setShadow({color : convertRGB(change), blur : this.state.blur, offsetX : this.state.offsetX, offsetY : this.state.offsetY});
  }

  handlePipette = () => {
    this.props.pipette.enablePipette(this.setColor); 
  }

  setColor = (color) => {
    this.setState({ color: color })
  }

  handleStrokeWidthChange = (event) => {
    this.setState({ strokeWidth : Number(event.target.value)});
    this.props.setStroke({ color : convertRGB(this.state.strokeColor), width : Number(event.target.value)});
  }

  handleStrokeColorChange = (event) => {
    new Promise((resolve) => {
      let color = HEXtoRGBA(event.target.value, this.state.strokeColor.a);
      this.setState({ strokeColor : color, hexstrokeColor : event.target.value});
      resolve(color);
    })
    .then((color) => {
      this.props.setStrokeColor(color);
    })
  }

  handleStrokeOpacityChange = (event) => {
    let change = this.state.strokeColor;
    change.a = event.target.value;
    this.setState({ strokeColor : change });
    this.props.setStrokeColor(change);
  }

  render(){
    return (
      <div className="sub">
        <div className="sub-title">
          {i18next.t('ui/effect.Effect')} ( {this.props.object.type} )
        </div>
        <div className="sub-effect">
          <div>
            <input id = "shadow_toggle" type="checkbox" onClick = {this.toggleShadow}></input>
            <label htmlFor='shadow'>
              <span>{i18next.t('ui/effect.Blur')} </span>
              <input
                type='range'
                className='shadow'
                id='shadow'
                min='1'
                max='100'
                name='blur'
                step='1'
                value={this.state.blur}
                onChange={this.handleShadowChange}/>
              <span>{i18next.t('ui/effect.OffsetY')} </span>
              <input
                type='range'
                className='shadow'
                id='shadow'
                min='-100'
                max='100'
                name='offsetY'
                step='1'
                value={this.state.offsetY}
                onChange={this.handleShadowChange}/>
              <span>{i18next.t('ui/effect.OffsetX')} </span>
              <input
                type='range'
                className='shadow'
                id='shadow'
                min='-100'
                max='100'
                name='offsetX'
                step='1'
                value={this.state.offsetX}
                onChange={this.handleShadowChange}/>
            </label>

            <div className="color-picker">            
              <input type="color" id="colorSource" value={this.state.hexcolor} onChange = { this.handleColorChange}/>
              <input type="range" value = {this.state.color.a} min='0' max='1' step='0.01' onChange = {this.handleOpacityChange} />
            </div>
            
            <div className="stroke">
              <label htmlFor="stroke">{i18next.t('ui/effect.Stroke')} </label>
              <input
                type='range'
                className='stroke'
                name='stroke'
                min='0'
                max='100'
                step='1'
                value={ this.props.object.strokeWidth ? this.props.object.strokeWidth : 0}
                disabled = { (this.props.object.type === 'group' || this.props.object.type === 'activeSelection' || this.props.object.type === 'not active' || this.props.object.type === 'line' ) ? true : false }
                onChange={this.handleStrokeWidthChange}
              />
            </div>

            
            
            <div className="option-title">{i18next.t('ui/effect.StrokeColor')} </div>
            
            <div className="color-picker">            
              <input type="color" id="colorSource" value={this.state.hexstrokeColor} onChange = { this.handleStrokeColorChange}/>
              <input type="range" value = {this.state.strokeColor.a} min='0' max='1' step='0.01' onChange = {this.handleStrokeOpacityChange} />
            </div>
            
            <div>
              <button onClick = { this.handlePipette }>{i18next.t('ui/effect.Pipette')}</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
})