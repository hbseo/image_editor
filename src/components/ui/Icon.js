import React, {Component} from 'react';
import i18next from "../../locale/i18n";
import { withTranslation } from "react-i18next";
import { HEXtoRGBA } from '../helper/ConverRGB';
import { iconList } from '../const/consts';
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
      hexcolor : "#ffffff"
    }
  }
  componentDidMount(){
    // console.log('Icon UI Mount');
  }
  componentDidUpdate(){
    // console.log('Icon UI Update');
  }
  componentWillUnmount(){
    // console.log('Icon UI Unmount');
  }

  addIcon = (event) => {
    const options = {
      type : event.target.getAttribute('type'),
      color : this.state.color,
    }
    this.props.addIcon(options);
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
            
            <div className="icon_div">
              <button className="fas fa-times" onClick={this.addIcon} type = "icon_cancel"></button>
              <p className="attribute">Cancel</p>
            </div>
            
            <div className="icon_div">
              <button className="fas fa-arrow-right" onClick={this.addIcon} type = "icon_arrow_2"></button>
              <p className="attribute">Arrow1</p>
            </div>
            
            <div className="icon_div">
              <button className="fas fa-angle-right" onClick={this.addIcon} type = "icon_arrow_3"></button>
              <p className="attribute">Arrow2</p>
            </div>

            <div className="icon_div">
              <button className="fas fa-star" onClick={this.addIcon} type = "icon_star"></button>
              <p className="attribute">Star1</p>
            </div>

            <div className="icon_div">
              <button className="fas fa-certificate" onClick={this.addIcon} type = "icon_star_2"></button>
              <p className="attribute">Star2</p>
            </div>

            <div className="icon_div">
              <button className="noicon" onClick={this.addIcon} type = "icon_polygon">
                <svg className="icon_svg" viewBox="-16 -25 100 100">
                  <path d={iconList.icon_polygon}></path>
                </svg>
              </button>
              <p className="attribute">Polygon</p>
            </div>
            
            <div className="icon_div">
              <button className="fas fa-map-marker-alt" onClick={this.addIcon} type = "icon_location"></button>
              <p className="attribute">Location</p>
            </div>
            
            <div className="icon_div">
              <button className="fas fa-heart" onClick={this.addIcon} type = "icon_heart"></button>
              <p className="attribute">Heart1</p>
            </div>
            
            <div className="icon_div">
              <button className="far fa-heart" onClick={this.addIcon} type = "icon_heart2"></button>
              <p className="attribute">Heart2</p>
            </div>
            
            <div className="icon_div">
              <button className="fas fa-comment-alt" onClick={this.addIcon} type = "icon_bubble"></button>
              <p className="attribute">Bubble</p>
            </div>

            <div className="icon_div">
              <button className="fas fa-cloud" onClick={this.addIcon} type = "icon_cloud"></button>
              <p className="attribute">Cloud</p>
            </div>

            <div className="icon_div">
              <button className="fas fa-camera" onClick={this.addIcon} type = "icon_camera"></button>
              <p className="attribute">Camera</p>
            </div>

            <div className="icon_div">
              <button className="fab fa-instagram" onClick={this.addIcon} type = "icon_instagram"></button>
              <p className="attribute">Instagram</p>
            </div>

            <div className="icon_div">
              <button className="far fa-user" onClick={this.addIcon} type = "icon_man"></button>
              <p className="attribute">User</p>
            </div>

            <div className="icon_div">
              <button className="fab fa-facebook-f" onClick={this.addIcon} type = "icon_facebook"></button>
              <p className="attribute">Facebook</p>
            </div>

            <div className="icon_div">
              <button className="fab fa-apple" onClick={this.addIcon} type = "icon_apple"></button>
              <p className="attribute">Apple</p>
            </div>

            <div className="icon_div">
              <button className="fas fa-question" onClick={this.addIcon} type = "icon_question"></button>
              <p className="attribute">Question</p>
            </div>

            <div className="icon_div">
              <button className="fas fa-exclamation" onClick={this.addIcon} type = "icon_exclamation"></button>
              <p className="attribute">Exclamation</p>
            </div>

            <div className="icon_div">
              <button className="fas fa-thumbs-up" onClick={this.addIcon} type = "icon_thumbs_up"></button>
              <p className="attribute">ThumbUp</p>
            </div>

            <div className="icon_div">
              <button className="fas fa-search" onClick={this.addIcon} type = "icon_magnifier"></button>
              <p className="attribute">Search</p>
            </div>

            <div className="icon_div">
              <button className="fab fa-twitter" onClick={this.addIcon} type = "icon_twitter"></button>
              <p className="attribute">Twitter</p>
            </div>

            <div className="icon_div">
              <button className="noicon" onClick={this.addIcon} type = "icon_fish"> 
                <svg className="icon_svg" viewBox="-3 0 29 29" > 
                  <path d={iconList.icon_fish}> 
                  </path> 
                </svg> 
              </button>
              <p className="attribute">Fish</p>
            </div>
          </div>
          
          <div className="option-title">{i18next.t('ui/icon.Color')}</div>
          <div className="color-picker">            
            <input type="color" id="colorSource" value={this.state.hexcolor} onChange = { this.handleColorChange}/>
            <input type="range" value = {this.state.color.a} min='0' max='1' step='0.01' onChange = {this.handleOpacityChange} />
          </div>
          <div>{this.state.color.a}</div>
          {/* <div>
            <button onClick = { this.handlePipette }>{i18next.t('ui/icon.Pipette')}</button>
          </div> */}
        </div>
      </div>
    );
  }
})