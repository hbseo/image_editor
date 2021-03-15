import React, {Component} from 'react';
import { ChromePicker, CompactPicker } from 'react-color';
import switchTools from '../helper/SwitchTools';
export default class Effect extends Component {
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
      strokeWidth: 5,
      strokeColor:{
        r:'0',
        g:'0',
        b:'0',
        a:'1'
      }
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
    this.props.setShadow({color : `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`, blur : this.state.blur, offsetX : this.state.offsetX, offsetY : this.state.offsetY});
  }

  toggleShadow = (event) => {
    if(event.target.checked){
      this.props.setShadow({color : `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`, blur : this.state.blur, offsetX : this.state.offsetX, offsetY : this.state.offsetY});
    }
    else{
      this.props.removeShadow();
    }
  }

  handleColorChange = (color) => {
    this.setState({ color: color.rgb })
  }

  handleColorChangeComplete = (color) => {
    if(document.getElementById("shadow_toggle").checked){
      this.props.setShadow({color : `rgba(${ color.rgb.r }, ${ color.rgb.g }, ${ color.rgb.b }, ${ color.rgb.a })`, blur : this.state.blur, offsetX : this.state.offsetX, offsetY : this.state.offsetY});
    }
  }

  handlePipette = () => {
    this.props.pipette.enablePipette(this.setColor); 
  }

  handleStrokeWidthChange = (event) => {
    this.setState({ strokeWidth : Number(event.target.value)});
    this.props.setStroke({ color : `rgba(${ this.state.strokeColor.r }, ${ this.state.strokeColor.g }, ${ this.state.strokeColor.b }, ${ this.state.strokeColor.a })`, width : Number(event.target.value)});
  }

  handleStrokeColorChange = (color) => {
    this.setState({ strokeColor : color.rgb });
  }

  handleStrokeColorChangeComplete = (color) => {
    this.props.setStrokeColor(color);
  }
  

  render(){
    return (
      <div className="sub">
        <div className="sub-title">
            Shape ( {this.props.object.type} )
        </div>
        <div className="sub-effect">
          <div>
            <input id = "shadow_toggle" type="checkbox" onClick = {this.toggleShadow}></input>
            <label htmlFor='shadow'>
              <span>블러</span>
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
              <span>세로 위치</span>
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
              <span>가로 위치</span>
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
              <ChromePicker name="fillColor" color={ this.state.color } onChange={ this.handleColorChange } onChangeComplete = { this.handleColorChangeComplete }/>
            </div>
            
            <div className="stroke">
              <label htmlFor="stroke">stroke</label>
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

            
            
            <div className="option-title">strokeColor</div>
            
            <div className="color-picker">
              <ChromePicker name="fillColor" color={ this.state.strokeColor } onChange={ this.handleStrokeColorChange } onChangeComplete = { this.handleStrokeColorChangeComplete }/>
            </div>
            
            <div>
              <button onClick = { this.handlePipette }>pipette</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}