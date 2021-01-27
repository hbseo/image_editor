import switchTools from '../helper/SwitchTools'
import React, {Component} from 'react';
import {fontList} from '../const/consts';

export default class Text extends Component{
  constructor(props){
    super(props);
    this.state = { fontSize : 20 };

  }

  componentDidMount(){
    console.log('Text UI Mount');
    this.documentUpdate();
  }
  componentDidUpdate(){
    console.log('Text UI Update');
    this.documentUpdate();
  }
  componentWillUnmount(){
    console.log('Text UI Unmount');
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

  render(){
    return (
      <div className="sub">
        <div className="sub-title">
            Text ( {this.props.object.type} )
        </div>
        <div className="sub-textmenu">
          <div>
            <button onClick={this.props.addText}>텍스트 추가</button>
          </div>
          <div>
            <input type='checkbox' className='text' onClick={this.textAction} text='bold' id='bold_checkbox' />bold
          </div>
          <div>
            <input type='checkbox' className='text' onClick={this.textAction} text='italic' id='italic_checkbox' />italic
          </div>
          <div>
            <button type='checkbox' className='text' onClick={this.textAction} text='left-align'>좌측정렬</button>
          </div>
          <div>
            <button type='checkbox' className='text' onClick={this.textAction} text='center-align' >가운데정렬</button>
          </div>
          <div>
            <button type='checkbox' className='text' onClick={this.textAction} text='right-align' >우측정렬</button>
          </div>
          <div>
            <label htmlFor='fontfamily'>글꼴: </label>
            <select className='text' name='fontfamily' text='fontfamily' onChange={this.textAction}>
              {this.fontListUp()}
            </select>
          </div>
          <div>
            <label htmlFor='fontSize'> 글자 크기: </label>
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
          
        </div>
      </div>
    );
  }

}