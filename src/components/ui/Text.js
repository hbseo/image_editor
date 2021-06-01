import switchTools from '../helper/SwitchTools'
import {convertRGB, HEXtoRGBA, } from '../helper/ConverRGB'
import React, {Component} from 'react';
import {fontList, textIcon} from '../const/consts';
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
      hexcolor : '#ffffff',
      hexbgcolor : '#ffffff',
      showfont: false,
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

  handleBGColorChange = (event) => {
    new Promise((resolve) => {
      this.setState({ bgcolor: HEXtoRGBA(event.target.value, this.state.bgcolor.a), hexbgcolor : event.target.value })
      resolve();
    })
    .then(() => {
      if(document.getElementById('textbg').checked){
        this.props.textObject("background-color", true, convertRGB(this.state.bgcolor));
      } 
    })

  }

  handleBGOpacityChange = (event) => {
    let change = this.state.bgcolor;
    change.a = event.target.value;
    this.setState({ bgcolor : change });
    if(document.getElementById('textbg').checked){
      this.props.textObject("background-color", true, convertRGB(this.state.bgcolor));
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
          <label htmlFor="add-text" className="option-title">{i18next.t('ui/text.Add Text')}</label>
          <div className="add-text">
            <button onClick={this.addText}>{i18next.t('ui/text.New Text')}</button>
          </div>
          <label htmlFor='fontfamily' className="option-title">{i18next.t('ui/text.Font')}</label>
          <div className={this.props.object.type ==='textbox' ? "font-style" : "font-style-disabled" } onClick={this.handlefontfamilybutton}>
            <button className="fontfamily-button" onClick={this.handlefontfamilybutton} style={{'fontFamily': this.props.object.fontFamily}} disabled = {this.props.object.type ==='textbox' ? false : true }>{choose}</button>
            {fontlist}
          </div>
          <div className="size-align">
            <div className={this.props.object.type ==='textbox' ? "font-size" : "font-size-disabled" } >
            <label htmlFor='fontSize' className="option-title">{i18next.t('ui/text.Font size')}</label>
              <input 
                type='number' 
                onChange={this.handlefontSizeChange} 
                text='fontSize'
                name='fontSize'
                id='fontSize'
                min='1'
                value={this.state.fontSize}
                disabled = {this.props.object.type ==='textbox' ? false : true }
              />
            </div>
            <div className="text-align">
              <label htmlFor="align" className="option-title">{i18next.t('ui/text.Align')}</label>
              <div className={this.props.object.type ==='textbox' ? "align-button" : "align-button-disabled"}>
                <label>
                  <button type='checkbox' className='align' id="left-align" onClick={this.textAction} text='left-align'></button>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
                    <path d={textIcon.alignLeft}/>
                  </svg>
                </label>
                <label>
                  <button type='checkbox' className='align' id="center-align" onClick={this.textAction} text='center-align'></button>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
                    <path d={textIcon.alignCenter}/>
                  </svg>
                </label>
                <label>
                  <button type='checkbox' className='align' id="right-align" onClick={this.textAction} text='right-align'></button>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
                    <path d={textIcon.alignRight}/>
                  </svg>
                </label>
              </div>
            </div>
          </div>

          <label htmlFor="text" className="option-title">{i18next.t('ui/text.Weight')}</label>
          <div className="font-weight">
            <div className={this.props.object.type ==='textbox' ? "bold" : "bold-disabled"}>
              <label>
                <input type='checkbox' onClick={this.textAction} text='bold' id='bold_checkbox' disabled = {this.props.object.type ==='textbox' ? false : true } />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26">
                  <path d={textIcon.bold}/>
                </svg>
              </label>
            </div>
            <div className={this.props.object.type ==='textbox' ? "italic" : "italic-disabled"}>
              <label>
              <input type='checkbox' onClick={this.textAction} text='italic' id='italic_checkbox' disabled = {this.props.object.type ==='textbox' ? false : true } />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26">
                  <path d={textIcon.italic}/>
                </svg>
              </label>
            </div>
            <div className={this.props.object.type ==='textbox' ? "underline" : "underline-disabled"}>
              <label>
              <input type='checkbox' onClick={this.textAction} text='underline' id='underline_checkbox' disabled = {this.props.object.type ==='textbox' ? false : true } />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26">
                  <path d={textIcon.underline}/>
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
            <input type="color" id="colorSource" value={this.state.hexcolor} onChange = { this.handleColorChange }/>
            <div className="cp-rangebox">
                <div>{i18next.t('ui/text.Text opacity')}: {this.state.color.a}</div>
                <input type="range" value = {this.state.color.a} min='0' max='1' step='0.01' onChange = {this.handleOpacityChange} />
            </div>
          </div>


          <label className="option-title">{i18next.t('ui/text.Text bg color')}</label>
          <div className="color-picker">
            <input type="color" id="colorSource" value={this.state.hexbgcolor} onChange = { this.handleBGColorChange }/>
            <div className="cp-rangebox">
                <div>{i18next.t('ui/text.Text opacity')}: {this.state.bgcolor.a} </div>
                <input type="range" value = {this.state.bgcolor.a} min='0' max='1' step='0.01' onChange = {this.handleBGOpacityChange} />
            </div>
          </div>

          {/* <div>
            <button onClick = { this.handlePipette }>{i18next.t('ui/text.Pipette')}</button>
          </div> */}
        </div>
      </div>
    );
  }
})