import switchTools from '../helper/SwitchTools'
import React, {Component} from 'react';
import {fontList} from '../const/consts';
import { ChromePicker } from 'react-color';

export default class Text extends Component{
  constructor(props){
    super(props);
    this.state = { 
      fontSize : 20 ,
      color: {
        r: '0',
        g: '0',
        b: '0',
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
    this.setState({fontSize : fontSize})
    this.props.textObject(textOption, true, fontSize);
  }
  
  fontListUp = () => {
    let i = 0;
    return fontList.map(font => (<option key={i++} value={font}>{font}</option>));
  }

  textAction = (event) => {
    let textOption = event.target.getAttribute('text');
    this.props.textObject(textOption, event.target.checked, event.target.value);
  }

  textActionColor = (event) => {
    let textOption = event.target.getAttribute('text');
    this.props.textObject(textOption, event.target.checked, `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`);
  }

  handlePipette = () => {
    this.props.pipette.enablePipette(this.setColor); 
  }

  handleColorChange = (color) => {
    this.setState({ color: color.rgb })
  }

  handleColorChangeComplete = (color) => {
    if(document.getElementById('textbg').checked){
      this.props.textObject("background-color", true, `rgba(${ color.rgb.r }, ${ color.rgb.g }, ${ color.rgb.b }, ${ color.rgb.a })`);
    } 
    else {
      this.setState({ color: color.rgb })
    }
  }

  render(){
    return (
      <div className="sub">
        <div className="sub-title">
            Text ( {this.props.object.type} )
        </div>
        <div className="sub-textmenu">
          <div>
            <button onClick={this.props.addText} className="add-text">텍스트 추가</button>
          </div>
          <div className="font-style">
            <label htmlFor='fontfamily'>글꼴 </label>
            <select className='text' name='fontfamily' text='fontfamily' onChange={this.textAction}>
              {this.fontListUp()}
            </select>
          </div>
          <div className="size-align">
            <div className="font-size">
              <label htmlFor='fontSize'> 글자 크기 </label>
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
              <label htmlFor="align">정렬</label>
              <div className="align-button">
                <button type='checkbox' className='align' id="left-align" onClick={this.textAction} text='left-align'></button>
                <button type='checkbox' className='align' id="center-align" onClick={this.textAction} text='center-align'></button>
                <button type='checkbox' className='align' id="right-align" onClick={this.textAction} text='right-align' ></button>
              </div>
            </div>
          </div>
          <div className="font-weight">
            <label htmlFor="text">Weight</label>
            <div className="weight-button">
              <div className="bold">
                <input type='checkbox' className='weight' onClick={this.textAction} text='bold' id='bold_checkbox' />
                <label htmlFor="bold_checkbox">bold</label>
              </div>
              <div className="italic">
                <input type='checkbox' className='weight' onClick={this.textAction} text='italic' id='italic_checkbox' />
                <label htmlFor="italic_checkbox">italic</label>
              </div>
            </div>
          </div>

          <div>
            <input type='checkbox' className='textbg' onClick={this.textActionColor} id="textbg" text="background-color" />
            <label htmlFor="textbg">textbg</label>
          </div>

          <div className="color-picker">
            <ChromePicker color={ this.state.color } onChange={ this.handleColorChange } onChangeComplete = { this.handleColorChangeComplete }/>
          </div>
          <div>
            <button onClick = { this.handlePipette }>pipette</button>
          </div>
        </div>
      </div>
    );
  }

}