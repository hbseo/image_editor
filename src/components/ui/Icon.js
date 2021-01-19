import React, {Component} from 'react';
// import './Text.scss'
export default class Icon extends Component {
  constructor(props){
    super(props);
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
  render(){
    return (
      <div className="sub">
        <div className="sub-title">
            Icon ( {this.props.object.type} )
        </div>
        <div className="sub-filters">
          <div>
            <button className="fas fa-times fa-5x" onClick={this.props.addIcon} type = "cancel"></button>
          </div>
          <div>
            <button className="fas fa-arrow-right" onClick={this.props.addIcon} type = "icon_arrow_2"></button>
            <button className="fas fa-angle-right" onClick={this.props.addIcon} type = "icon_arrow_3"></button>
            <button className="fas fa-star" onClick={this.props.addIcon} type = "icon_star"></button>
            <button className="fas fa-certificate" onClick={this.props.addIcon} type = "icon_star_2"></button>
            <button className="fas fa-times" onClick={this.props.addIcon} type = "icon_polygon"></button>
            <button className="fas fa-map-marker-alt" onClick={this.props.addIcon} type = "icon_location"></button>
            <button className="fas fa-heart" onClick={this.props.addIcon} type = "icon_heart"></button>
            <button className="fas fa-comment-alt" onClick={this.props.addIcon} type = "icon_bubble"></button>
            <button className="fas fa-cloud" onClick={this.props.addIcon} type = "icon_cloud"></button>
          </div>
        </div>
      </div>
    );
  }
}