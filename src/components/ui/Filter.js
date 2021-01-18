import React, {Component} from 'react';
import { fabric } from 'fabric';
import './Filter.scss'
export default class Filter extends Component{
  constructor(props){
    super(props);
    this.filterList = ['Grayscale', 'Invert', 'Brownie', 'Technicolor', 'Polaroid', 'BlackWhite', 'Vintage', 'Sepia', 'Kodachrome',
    'Convolute', '', '', '', '', '', 'Brightness', 'Contrast', 'Pixelate', 'Blur', 'Noise', 'Saturation', 'HueRotation','Ink', 'Vignette', 'ZoomBlur' ];
  }

  componentDidMount(){
    console.log('Filter UI Mount');
    this.documentUpdate();
  }
  componentDidUpdate(){
    console.log('Filter UI Update');
    this.documentUpdate();
  }
  componentWillUnmount(){
    console.log('Filter UI Unmount');
  }

  documentUpdate = () => {
    if(this.props.object.type === 'image'){
      this.switchTools('filter', false)
      this.imageSelection(this.props.object);
    }
    else{
      this.switchTools('filter', true)
    }
  }

  imageSelection = (image) => {
    let list = document.getElementsByClassName('filter');
    let change_filters = Array.from({length: this.filterList.length}, () => false);
    image.filters.forEach(filter => {
      change_filters[this.filterList.indexOf(filter.type)] = filter;
    });
    image.filters = change_filters;
    for(let i=0; i<list.length; i++){
      list[i].checked = image.filters[i];
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
            Filters ( {this.props.object.type} )
        </div>
        <div className="sub-filters">
          <div>
            <input type='checkbox' id="filter-grey" className='filter' onClick={this.props.filter} filter='grey'/><label htmlFor="filter-grey">Filter grey</label>
          </div>
          <div>
            <input type='checkbox' id="filter-invert" className='filter' onClick={this.props.filter} filter='invert'/><label htmlFor="filter-invert">Filter invert</label>
          </div>
          <div>
            <input type='checkbox' id="filter-brownie" className='filter' onClick={this.props.filter} filter='brownie'/><label htmlFor="filter-brownie">Filter brownie</label>
          </div>
          <div>
            <input type='checkbox' id="filter-technicolor" className='filter' onClick={this.props.filter} filter='technicolor'/><label htmlFor="filter-technicolor">Filter technicolor</label>
          </div>
          <div>
            <input type='checkbox' id="filter-polaroid" className='filter' onClick={this.props.filter} filter='polaroid'/><label htmlFor="filter-polaroid">Filter polaroid</label>
          </div>
          <div>
            <input type='checkbox' id="filter-blackwhite" className='filter' onClick={this.props.filter} filter='blackwhite'/><label htmlFor="filter-blackwhite">Filter blackwhite</label>
          </div>
          <div>
            <input type='checkbox' id="filter-vintage" className='filter' onClick={this.props.filter} filter='vintage'/><label htmlFor="filter-vintage">Filter vintage</label>
          </div>
          <div>
            <input type='checkbox' id="filter-sepia" className='filter' onClick={this.props.filter} filter='sepia'/><label htmlFor="filter-sepia">Filter Sepia</label>
          </div>
          <div>
            <input type='checkbox' id="filter-kodachrome" className='filter' onClick={this.props.filter} filter='kodachrome'/><label htmlFor="filter-kodachrome">Filter kodachrome</label>
          </div>
          <div>
            <input type='checkbox' id="filter-emboss" className='filter' onClick={this.props.filter} filter='emboss'/><label htmlFor="filter-emboss">Filter emboss</label>
          </div>
        </div>
      </div>
    );
  }

}