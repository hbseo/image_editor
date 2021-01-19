import { fabric } from 'fabric';
import React, {Component} from 'react';

export default class Text extends Component{
  constructor(props){
    super(props);
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
      this.switchTools('text', false)
      this.textSelection(this.props.object);
    }
    else{
      this.switchTools('text', true)
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
  }

  switchTools = (...args) => {
    for(let i = 0; i< args.length-1; i++) {
      fabric.util.toArray(document.getElementsByClassName(args[i])).forEach(el => 
        el.disabled = args[args.length-1]
      );
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
            <button onClick={this.props.addText}>텍스트 추가</button>
          </div>
          <div>
            <input type='checkbox' className='text' onClick={this.props.textObject} text='bold' id='bold_checkbox' />bold
          </div>
          <div>
            <input type='checkbox' className='text' onClick={this.props.textObject} text='italic' id='italic_checkbox' />italic
          </div>
          <div>
            <button type='checkbox' className='text' onClick={this.props.textObject} text='left-align'>좌측정렬</button>
          </div>
          <div>
            <button type='checkbox' className='text' onClick={this.props.textObject} text='center-align' >가운데정렬</button>
          </div>
          <div>
            <button type='checkbox' className='text' onClick={this.props.textObject} text='right-align' >우측정렬</button>
          </div>
          
        </div>
      </div>
    );
  }

}