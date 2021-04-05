import switchTools from '../helper/SwitchTools'
import {convertRGB, HEXtoRGB} from '../helper/ConverRGB'
import React, {Component} from 'react';
import {fontList} from '../const/consts';
import { ChromePicker } from 'react-color';
import i18next from "../../locale/i18n";
import { withTranslation } from "react-i18next";
import '../../css/ui/Text.scss';

export default withTranslation()(class Text extends Component{
  constructor(props){
    super(props);
    this.state = { 
      fontSize : 40 ,
      font : 'Arial',
      color: {
        r: '0',
        g: '0',
        b: '0',
        a: '1'
      },
      bgcolor : {
        r: '255',
        g: '255',
        b: '255',
        a: '1'
      },
      showfont: false,
      testcolor : "#ffffff"
    };
    this.isPressed = false;
  }

  componentDidMount(){
    // console.log('Text UI Mount');
    document.addEventListener('mousedown', this.onFontSizemousedownEvent);
    document.addEventListener('mouseup', this.onFontSizemouseupEvent);
    this.documentUpdate();
  }
  componentDidUpdate(){
    // console.log('Text UI Update');
    this.documentUpdate();
  }
  componentWillUnmount(){
    // console.log('Text UI Unmount');
    document.removeEventListener('mousedown', this.onShowFontEvent);
    document.removeEventListener('mousedown', this.onFontSizemousedownEvent);
    document.removeEventListener('mouseup', this.onFontSizemouseupEvent);
  }

  documentUpdate = () => {
    if(this.props.object.type === 'textbox'){
      switchTools('text', false)
      this.textSelection(this.props.object);
    }
    else{
      switchTools('text', true)
    }
  }

  textSelection = (text) => {
    if(text.fontStyle === "italic"){
      document.getElementById('italic_checkbox').checked = true;
    }
    else{
      document.getElementById('italic_checkbox').checked = false;
    }
    if(text.fontWeight === "bold"){
      document.getElementById('bold_checkbox').checked = true;
    }
    else{
      document.getElementById('bold_checkbox').checked = false;
    }
    if(text.textBackgroundColor){
      document.getElementById('textbg').checked = true;
    }
    else{
      document.getElementById('textbg').checked = false;
    }
    document.getElementById('fontSize').value = text.fontSize;
  }

  handlefontSizeChange = (event) => {
    const fontSize = event.target.value;
    let textOption = event.target.getAttribute('text');
    this.setState({fontSize : fontSize});
    this.props.textObject(textOption, true, fontSize);
  }
  
  fontListUp = () => {
    let i = 0;
    return fontList.map(font => (<li key={i++} className="font-li" value={font} style={{'fontFamily':font, 'cursor':'pointer'}} onClick={(e) => this.handlefontlistClicked(font, e)}>{font}</li>));
  }

  handlefontlistClicked = (value) => {
    this.setState({font: value, showfont: false});
    this.props.textObject('fontfamily', true, value);
  }

  handlefontSizeButton = (event) => {
    let textOption = event.target.getAttribute('text');
    let level = event.target.getAttribute("updown") === 't' ? 1 : -1;
    new Promise((resolve) => {
      this.props.textObject(textOption, true, this.state.fontSize + level);
      resolve();
    })
    .then(() => {
      this.setState({fontSize : this.state.fontSize + level});
    })
  }

  onFontSizemousedownEvent = (event) => {
    if(event.target.className === "fontSizeBtn") {
      this.isPressed =  true;
      this.handlefontSizeInterval(event);
    }
  }

  onFontSizemouseupEvent = (event) => {
    if(event.target.className === "fontSizeBtn") {
      this.isPressed =  false;
    }
  }

  handlefontSizeInterval = (event) => {
    if(this.isPressed) {
      this.handlefontSizeButton(event);
      setTimeout(() => {
        this.handlefontSizeInterval(event);
      },100)
    }
  }

  addText = () => {
    this.props.addText({size : this.state.fontSize, color : convertRGB(this.state.color), font : this.state.font});
  }

  textAction = (event) => {
    let textOption = event.target.getAttribute('text');
    if(textOption === 'fontfamily') { this.setState({ font : event.target.value }); }
    this.props.textObject(textOption, event.target.checked, event.target.value);
  }

  textActionColor = (event) => {
    let textOption = event.target.getAttribute('text');
    this.props.textObject(textOption, event.target.checked, convertRGB(this.state.bgcolor));
  }

  setColor = (color) => {
    this.setState({ color: color })
  }

  handlePipette = () => {
    this.props.pipette.enablePipette(this.setColor); 
  }

  handleColorChange = (color) => {
    this.setState({ color: color.rgb })
  }

  handleColorChangeComplete = (color) => {
    this.props.setColor(color);
  }

  handleBGColorChange = (color) => {
    this.setState({ bgcolor: color.rgb })
  }

  handleBGColorChangeComplete = (color) => {
    if(document.getElementById('textbg').checked){
      this.props.textObject("background-color", true, convertRGB(this.state.bgcolor));
    } 
    else {
      this.setState({ bgcolor: color.rgb })
    }
  }

  handlefontfamilybutton = () => {
    this.setState({showfont: !this.state.showfont});
    document.addEventListener('mousedown', this.onShowFontEvent);
  }

  onShowFontEvent = (event) => {
    if(event.target.className !== 'font-style' && event.target.className !== 'font-ul' && event.target.className !== 'fontfamily-button' && event.target.className !== 'font-li'){
      this.setState({showfont: false});
    }
    document.removeEventListener('mousedown', this.onShowFontEvent);
  }

  colortest = (event) => {
    this.setState({ color : HEXtoRGB(event.target.value), testcolor : event.target.value});
    this.props.setColor({rgb : HEXtoRGB(event.target.value)});
  } 

  render(){
    let fontlist = null;
    if(this.state.showfont) {
      fontlist =
      <ul className="font-ul">
        {this.fontListUp()}
      </ul>
    }
    let choose = this.props.object.fontFamily || i18next.t('ui/text.Font family');
    return (
      <div className="sub">
        <div className="sub-title">
            {i18next.t('ui/text.Text')} ( {this.props.object.type} )
        </div>
        <div className="sub-textmenu">
          <div className="add-text">
            <button onClick={this.addText}>{i18next.t('ui/text.New Text')}</button>
          </div>
          <label htmlFor='fontfamily' className="option-title">{i18next.t('ui/text.Font')}</label>
          <div className="font-style" onClick={this.handlefontfamilybutton}>
            <button className="fontfamily-button" onClick={this.handlefontfamilybutton} style={{'fontFamily': this.props.object.fontFamily}}>{choose}</button>
            {fontlist}
          </div>
          <div className="size-align">
            <div className="font-size">
            <label htmlFor='fontSize' className="option-title">{i18next.t('ui/text.Font size')}</label>
              <input 
                type='number' 
                onChange={this.handlefontSizeChange} 
                text='fontSize'
                name='fontSize'
                id='fontSize'
                min='1'
                value={this.state.fontSize} 
              />
            </div>
            <div className="text-align">
              <label htmlFor="align" className="option-title">{i18next.t('ui/text.Align')}</label>
              <div className="align-button">
                <button type='checkbox' className='align' id="left-align" onClick={this.textAction} text='left-align'></button>
                <button type='checkbox' className='align' id="center-align" onClick={this.textAction} text='center-align'></button>
                <button type='checkbox' className='align' id="right-align" onClick={this.textAction} text='right-align' ></button>
              </div>
            </div>
          </div>

          <label htmlFor="text" className="option-title">{i18next.t('ui/text.Weight')}</label>
          <div className="font-weight">
            <div className="bold">
              <label>
                <input type='checkbox' onClick={this.textAction} text='bold' id='bold_checkbox' disabled = {this.props.object.type ==='textbox' ? false : true } />
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26">
                  <path d="M22.941,18.046c0,1.116-0.234,2.06-0.706,2.828c-0.47,0.772-1.144,1.378-2.022,1.825 c-0.932,0.473-2.003,0.811-3.217,1.008C15.781,23.902,15.352,24,13.708,24H2v-1.784c0.32-0.028,2.031-0.421,2.031-1.953V6.053 C4.031,4.197,2.32,3.979,2,3.929V2h11.953c3.008,0,3.639,0.414,4.973,1.239c1.334,0.829,2,2.048,2,3.66 c0,3.087-2.469,4.929-3.275,5.116v0.294C18.457,12.392,22.941,13.26,22.941,18.046z M15.434,7.824c0-0.911-0.344-1.623-1.031-2.132 c-0.687-0.515-1.488-0.769-2.862-0.769c-0.196,0-0.452,0.007-0.766,0.018c-0.316,0.012-0.588,0.022-0.815,0.029v6.102h0.806 c1.675,0,2.68-0.293,3.476-0.877C15.035,9.612,15.434,8.823,15.434,7.824z M16.248,17.475c0-1.165-0.435-2.061-1.309-2.682 c-0.871-0.623-1.903-0.934-3.539-0.934c-0.188,0-0.438,0.006-0.75,0.018c-0.311,0.014-0.542,0.022-0.691,0.029v7.174 c0,0,1.643,0,2.307,0c1.18,0,2.137-0.314,2.876-0.945C15.879,19.505,16.248,18.617,16.248,17.475z"/>
                </svg>
              </label>
            </div>
            <div className="italic">
              <label>
              <input type='checkbox' onClick={this.textAction} text='italic' id='italic_checkbox' disabled = {this.props.object.type ==='textbox' ? false : true } />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26" enable-background="new 0 0 26 26">
                  <path d="M16.4,24H4.2l0.5-1.9C5,22.1,5.5,22,6,22c0.6,0,0.9-0.1,1.2-0.2c0.4-0.2,0.7-0.4,0.9-0.6c0.2-0.3,0.4-0.6,0.5-1l3.6-14.1 c0.1-0.4,0.1-0.7,0-0.9c-0.1-0.3-0.3-0.5-0.6-0.7c-0.2-0.1-0.6-0.2-1-0.3C10.1,4.1,9.6,4,9.3,4l0.5-2H22l-0.5,2 c-0.3,0-1.1,0.1-1.6,0.1c-0.5,0.1-0.9,0.1-1.2,0.2c-0.4,0.1-0.8,0.3-1,0.6c-0.2,0.3-0.4,0.6-0.4,1l-3.6,14.1c-0.1,0.4-0.1,0.7,0,1 c0.1,0.3,0.3,0.5,0.6,0.6c0.2,0.1,0.5,0.2,1,0.3c0.5,0.1,1.3,0.1,1.6,0.2L16.4,24z"/>
                </svg>
              </label>
            </div>
          </div>

          <div className="option-title">{i18next.t('ui/text.Text background')}</div>
          <div className="text-bg">
            <input type='checkbox' onClick={this.textActionColor} id="textbg" text="background-color" disabled = {this.props.object.type ==='textbox' ? false : true }/>
            <label htmlFor="textbg">{i18next.t('ui/text.Active')}</label>
          </div>

          <label className="option-title">{i18next.t('ui/text.Text color')}</label>
          <div className="color-picker">
            <input type="color" id="colorSource" value={this.state.testcolor} onChange = { this.colortest}/>
            <ChromePicker color={ this.state.color } onChange={ this.handleColorChange } onChangeComplete = { this.handleColorChangeComplete }/>
          </div>

          <label className="option-title">{i18next.t('ui/text.Text bg color')}</label>
          <div className="color-picker">
            <ChromePicker color={ this.state.bgcolor } onChange={ this.handleBGColorChange } onChangeComplete = { this.handleBGColorChangeComplete }/>
          </div>

          <div>
            <button onClick = { this.handlePipette }>{i18next.t('ui/text.Pipette')}</button>
          </div>
        </div>
      </div>
    );
  }
})