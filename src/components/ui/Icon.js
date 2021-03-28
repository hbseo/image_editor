import React, {Component} from 'react';
import { ChromePicker } from 'react-color';
import i18next from "../../locale/i18n";
import { withTranslation } from "react-i18next";
import '../../css/ui/Icon.scss'

export default withTranslation()(class Icon extends Component {
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

  setColor = (color) => {
    this.setState({ color: color })
  }

  handlePipette = () => {
    this.props.pipette.enablePipette(this.setColor); 
  }

  render(){
    return (
      <div className="sub">
        <div className="sub-title">
            {i18next.t('ui/icon.Icon')} ( {this.props.object.type} )
        </div>
        <div className="sub-iconmenu">
          <div className="option-title">{i18next.t('ui/icon.Pick icon')}</div>
          <div className="icon">
            <button className="fas fa-times" onClick={this.addIcon} type = "icon_cancel"></button>
            <button className="fas fa-arrow-right" onClick={this.addIcon} type = "icon_arrow_2"></button>
            <button className="fas fa-angle-right" onClick={this.addIcon} type = "icon_arrow_3"></button>
            <button className="fas fa-star" onClick={this.addIcon} type = "icon_star"></button>
            <button className="fas fa-certificate" onClick={this.addIcon} type = "icon_star_2"></button>
            <button className="fas fa-times" onClick={this.addIcon} type = "icon_polygon"></button>
            <button className="fas fa-map-marker-alt" onClick={this.addIcon} type = "icon_location"></button>
            <button className="fas fa-heart" onClick={this.addIcon} type = "icon_heart"></button>
            <button className="fas fa-comment-alt" onClick={this.addIcon} type = "icon_bubble"></button>
            <button className="fas fa-cloud" onClick={this.addIcon} type = "icon_cloud"></button>
            <button className="fas fa-camera" onClick={this.addIcon} type = "icon_camera"></button>
            <button className="fab fa-instagram" onClick={this.addIcon} type = "icon_instagram"></button>
            <button className="far fa-user" onClick={this.addIcon} type = "icon_man"></button>
            <button className="fab fa-facebook-f" onClick={this.addIcon} type = "icon_facebook"></button>
            <button className="fab fa-apple" onClick={this.addIcon} type = "icon_apple"></button>
            
          </div>
          <div className="option-title">{i18next.t('ui/icon.Color')}</div>
          <div className="color-picker">
            <ChromePicker color={ this.state.color } onChange={ this.handleColorChange } onChangeComplete = { this.handleColorChangeComplete }/>
          </div>
          <div>
            <button onClick = { this.handlePipette }>{i18next.t('ui/icon.Pipette')}</button>
          </div>
        </div>
      </div>
    );
  }
})