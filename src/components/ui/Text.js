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
          <label htmlFor='fontSize' className="option-title">{i18next.t('ui/text.Font size')}</label>
          <div className="font-size">
            <input 
              type='number' 
              onChange={this.handlefontSizeChange} 
              text='fontSize'
              name='fontSize'
              id='fontSize'
              min='1'
              value={this.state.fontSize} 
            />
            <div className="u-d">
              <button onClick={this.handlefontSizeButton} className="fontSizeBtn" text='fontSize' name='fontSize' id='fontSize' updown="t">UP</button>
              <button onClick={this.handlefontSizeButton} className="fontSizeBtn" text='fontSize' name='fontSize' id='fontSize' updown="f">Down </button>
            </div>
          </div>

          <label htmlFor="align" className="option-title">{i18next.t('ui/text.Align')}</label>
          <div className="text-align">
            <div className="align-button">
              <button type='checkbox' className='align' id="left-align" onClick={this.textAction} text='left-align'></button>
              <button type='checkbox' className='align' id="center-align" onClick={this.textAction} text='center-align'></button>
              <button type='checkbox' className='align' id="right-align" onClick={this.textAction} text='right-align' ></button>
            </div>
          </div>

          <label htmlFor="text" className="option-title">{i18next.t('ui/text.Weight')}</label>
          <div className="font-weight">
            <div className="bold">
              <input type='checkbox' onClick={this.textAction} text='bold' id='bold_checkbox' />
              <label htmlFor="bold_checkbox">{i18next.t('ui/text.Bold')}</label>
            </div>
            <div className="italic">
              <input type='checkbox' onClick={this.textAction} text='italic' id='italic_checkbox' />
              <label htmlFor="italic_checkbox">{i18next.t('ui/text.Italic')}</label>
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