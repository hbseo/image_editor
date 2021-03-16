import switchTools from '../helper/SwitchTools'
import React, {Component} from 'react';
import {fontList} from '../const/consts';
import { ChromePicker } from 'react-color';
import '../../css/ui/Text.scss'

export default class Text extends Component{
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
    };
  }

  componentDidMount(){
    // console.log('Text UI Mount');
    this.documentUpdate();
  }
  componentDidUpdate(){
    // console.log('Text UI Update');
    this.documentUpdate();
  }
  componentWillUnmount(){
    // console.log('Text UI Unmount');
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

  setColor = (color) => {
    this.setState({ color: color })
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
    return fontList.map(font => (<li key={i++} value={font}>{font}</li>));
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

  addText = () => {
    this.props.addText({size : this.state.fontSize, color : `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`, font : this.state.font});
  }

  textAction = (event) => {
    let textOption = event.target.getAttribute('text');
    if(textOption === 'fontfamily') { this.setState({ font : event.target.value }); }
    this.props.textObject(textOption, event.target.checked, event.target.value);
  }

  textActionColor = (event) => {
    let textOption = event.target.getAttribute('text');
    this.props.textObject(textOption, event.target.checked, `rgba(${ this.state.bgcolor.r }, ${ this.state.bgcolor.g }, ${ this.state.bgcolor.b }, ${ this.state.bgcolor.a })`);
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
      this.props.textObject("background-color", true, `rgba(${ color.rgb.r }, ${ color.rgb.g }, ${ color.rgb.b }, ${ color.rgb.a })`);
    } 
    else {
      this.setState({ bgcolor: color.rgb })
    }
  }

  handlefontfamilyClicked = () => {
    
  }

  render(){
    return (
      <div className="sub">
        <div className="sub-title">
            Text ( {this.props.object.type} )
        </div>
        <div className="sub-textmenu">
          <div className="add-text">
            <button onClick={this.addText}>New Text</button>
          </div>

          <label htmlFor='fontfamily' className="option-title">Font</label>











          {/* <div className="font-style">
            <select className='text-font' name='fontfamily' text='fontfamily' onChange={this.textAction}>
              {this.fontListUp()}
            </select>
          </div> */}




          <div className="font-style">
            <div id="select" className="text-font">choose</div>
            <ul id="font-ul" className="select-ul">
              {this.fontListUp()}
            </ul>
          </div>











          <label htmlFor='fontSize' className="option-title">Font size</label>
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
              <button onClick={this.handlefontSizeButton} text='fontSize' name='fontSize' id='fontSize' updown="t">UP</button>
              <button onClick={this.handlefontSizeButton} text='fontSize' name='fontSize' id='fontSize' updown="f">Down </button>
            </div>
          </div>

          <label htmlFor="align" className="option-title">Align</label>
          <div className="text-align">
            <div className="align-button">
              <button type='checkbox' className='align' id="left-align" onClick={this.textAction} text='left-align'></button>
              <button type='checkbox' className='align' id="center-align" onClick={this.textAction} text='center-align'></button>
              <button type='checkbox' className='align' id="right-align" onClick={this.textAction} text='right-align' ></button>
            </div>
          </div>

          <label htmlFor="text" className="option-title">Weight</label>
          <div className="font-weight">
            <div className="bold">
              <input type='checkbox' onClick={this.textAction} text='bold' id='bold_checkbox' />
              <label htmlFor="bold_checkbox">bold</label>
            </div>
            <div className="italic">
              <input type='checkbox' onClick={this.textAction} text='italic' id='italic_checkbox' />
              <label htmlFor="italic_checkbox">italic</label>
            </div>
          </div>

          <div className="option-title">Text background</div>
          <div className="text-bg">
            <input type='checkbox' onClick={this.textActionColor} id="textbg" text="background-color" />
            <label htmlFor="textbg">Active</label>
          </div>

          <label className="option-title">Text color</label>
          <div className="color-picker">
            <ChromePicker color={ this.state.color } onChange={ this.handleColorChange } onChangeComplete = { this.handleColorChangeComplete }/>
          </div>

          <label className="option-title">Text bg color</label>
          <div className="color-picker">
            <ChromePicker color={ this.state.bgcolor } onChange={ this.handleBGColorChange } onChangeComplete = { this.handleBGColorChangeComplete }/>
          </div>

          <div>
            <button onClick = { this.handlePipette }>pipette</button>
          </div>
        </div>
      </div>
    );
  }

}