import React, {Component} from 'react';
import { ChromePicker } from 'react-color';
// import './Text.scss'
export default class Icon extends Component {
  constructor(props){
    super(props);
    this.state = {
      color: {
        r: '0',
        g: '0',
        b: '0',
        a: '1'
      },
    }
  }
  componentDidMount(){
    console.log('Icon UI Mount');
  }
  componentDidUpdate(){
    console.log('Icon UI Update');
  }
  componentWillUnmount(){
    console.log('Icon UI Unmount');
  }

  addIcon = (event) => {
    const options = {
      type : event.target.getAttribute('type'),
      color : this.state.color,
    }
    this.props.addIcon(options);
  }

  handleColorChange = (color) => {
    this.setState({ color: color.rgb })
  }

  handleColorChangeComplete = (color) => {
    this.props.setColor(color);
  }

  render(){
    return (
      <div className="sub">
        <div className="sub-title">
            Icon ( {this.props.object.type} )
        </div>
        <div className="sub-iconmenu">
          <button className="fas fa-times fa-5x" onClick={this.addIcon} type = "cancel"></button>
          <div className="icon">
            <button className="fas fa-arrow-right" onClick={this.addIcon} type = "icon_arrow_2"></button>
            <button className="fas fa-angle-right" onClick={this.addIcon} type = "icon_arrow_3"></button>
            <button className="fas fa-star" onClick={this.addIcon} type = "icon_star"></button>
            <button className="fas fa-certificate" onClick={this.addIcon} type = "icon_star_2"></button>
            <button className="fas fa-times" onClick={this.addIcon} type = "icon_polygon"></button>
            <button className="fas fa-map-marker-alt" onClick={this.addIcon} type = "icon_location"></button>
            <button className="fas fa-heart" onClick={this.addIcon} type = "icon_heart"></button>
            <button className="fas fa-comment-alt" onClick={this.addIcon} type = "icon_bubble"></button>
            <button className="fas fa-cloud" onClick={this.addIcon} type = "icon_cloud"></button>
          </div>
        </div>
        <div className="color-picker">
          <label>color</label>
          <ChromePicker color={ this.state.color } onChange={ this.handleColorChange } onChangeComplete = { this.handleColorChangeComplete }/>
        </div>
      </div>
    );
  }
}