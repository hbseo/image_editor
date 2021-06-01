import React, {Component} from 'react';
import {convertRGB, HEXtoRGBA } from '../helper/ConverRGB';
import i18next from "../../locale/i18n";
import SwitchTools from '../helper/SwitchTools';
import { withTranslation } from "react-i18next";
import { ObjectIcon } from '../const/consts';
import '../../css/ui/Effect.scss';

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
      SwitchTools('shadow', false)
      document.getElementById('shadow_toggle').disabled = false;
    }
    else{
      SwitchTools('shadow', true)
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
          <div className="shadow-box">
            <div className="option-title">{i18next.t('ui/effect.Blur')}</div>
            <div className="shadow-checkbox">
              <div>
                <label className="mycheckbox path">
                  <input id = "shadow_toggle" type="checkbox" onClick = {this.toggleShadow}></input>
                    <svg viewBox="0 0 21 21">
                      <path d={ObjectIcon.checkbox}></path>
                    </svg>
                </label>
                On/Off
              </div>
              <div className="blur-box">
                <div className="blur-box-title">
                  {i18next.t('ui/effect.Blur strength')}
                </div>
                <div className="blur-box-input">
                  <input
                  type='range'
                  className='shadow'
                  id='shadow'
                  min='0'
                  max='10'
                  name='blur'
                  step='0.1'
                  value={this.state.blur}
                  onChange={this.handleShadowChange}/>
                  <div>
                    {this.state.blur}
                  </div>
                </div>
              </div>
            </div>
            <div className="shadow-offset">
              {i18next.t('ui/effect.OffsetX')}
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
              {i18next.t('ui/effect.OffsetY')}
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
            </div>
          </div>
          <div className="shadow-color">
            <div className="option-title">{i18next.t('ui/effect.ShadowColor')}</div>
            <div className="color-picker">
                <input type="color" id="colorSource" value={this.state.hexcolor} onChange = { this.handleColorChange }/>
                <div className="cp-rangebox">
                    <div>{i18next.t('ui/effect.Color opacity')}: {this.state.color.a}</div>
                <input type="range" value = {this.state.color.a} min='0' max='1' step='0.01' onChange = {this.handleOpacityChange} />
            </div>
          </div>
          </div>         
          <div className="stroke">
            <label className="option-title" htmlFor="stroke">{i18next.t('ui/effect.Stroke')} </label>
            <div className="stroke-input">
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
              <div>
                {this.props.object.strokeWidth ? this.props.object.strokeWidth : 0}
              </div>
            </div>

          </div>          
          <div className="stroke-color">     
            <div className="option-title">{i18next.t('ui/effect.StrokeColor')}</div>
            <div className="color-picker">
              <input type="color" id="colorSource" value={this.state.hexstrokeColor} onChange = { this.handleStrokeColorChange}/>
              <div className="cp-rangebox">
                <div>{i18next.t('ui/effect.Color opacity')}: {this.state.color.a}</div>
                <input type="range" id="stroke-range" value = {this.state.strokeColor.a} min='0' max='1' step='0.01' onChange = {this.handleStrokeOpacityChange} />
              </div>
            </div>
          </div>
          {/* <div>
            <button onClick = { this.handlePipette }>{i18next.t('ui/effect.Pipette')}</button>
          </div> */}
        </div>
      </div>
    );
  }
})