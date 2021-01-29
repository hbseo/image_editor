import React, {Component} from 'react';
import switchTools from '../helper/SwitchTools'
import '../../css/ui/Filter.scss'

export default class Filter extends Component{
  constructor(props){
    super(props);
    this.filterList = ['Grayscale', 'Invert', 'Brownie', 'Technicolor', 'Polaroid', 'BlackWhite', 'Vintage', 'Sepia', 'Kodachrome',
    'Convolute', '', '', '', '', '', 'Brightness', 'Contrast', 'Pixelate', 'Blur', 'Noise', 'Saturation', 'HueRotation','Ink', 'Vignette', 'ZoomBlur' ];

    this.state = {
      brightness: 0,
      contrast : 0,
      pixelate : 1,
      blur : 0,
      noise : 0,
      saturation : 0,
      hue : 0,
      ink : 0,
      vignette : 0,
      zoomblur : 0,
      opacity : 1,
    }
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

  static getDerivedStateFromProps(nextProps, prevState) {
    if(nextProps.object.type === 'image') {
      if(nextProps.object.filters[15]) {
        if(nextProps.object.filters[15].brightness !== prevState.brightness) {
          return { brightness: nextProps.object.filters[15].brightness };
        }
      }
      else {  // object의 filters[15] (brightness) 가 false 일 때
        return { brightness: 0 };
      }
    }
    return null;
  }

  documentUpdate = () => {
    if(this.props.object.type === 'image'){
      switchTools('filter', false);
      this.imageSelection(this.props.object);
    }
    else if(this.props.getBackgroundImage()){
      switchTools('filter', false);
      this.imageSelection(this.props.getBackgroundImage());
    }
    else{
      switchTools('filter', true)
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

    // document.getElementById('brightness').value = image.filters[15] ? image.filters[15].brightness : 0;
    // document.getElementById('contrast').value = image.filters[16] ? image.filters[16].contrast : 0;
    // document.getElementById('pixelate').value = image.filters[17] ? image.filters[17].blocksize : 1;
    // document.getElementById('blur').value = image.filters[18] ? image.filters[18].blur : 0;
    // document.getElementById('noise').value = image.filters[19] ? image.filters[19].noise : 0;
    // document.getElementById('saturation').value = image.filters[20] ? image.filters[20].saturation : 0;
    // document.getElementById('hue').value = image.filters[21] ? image.filters[21].rotation : 0;
    // document.getElementById('ink').value = image.filters[22] ? image.filters[22].ink_matrix.ink : 0;
    // document.getElementById('vignette').value = image.filters[23] ? image.filters[23].vignette_matrix.amount : 0;
    // document.getElementById('zoomblur').value = image.filters[24] ? image.filters[24].zoomblur_matrix.strength : 0;
    // document.getElementById('opacity').value = image.opacity
    // document.getElementById('brightness-value').innerHTML = image.filters[15] ? image.filters[15].brightness : 0;
  }

  handleFilterChange = (event) => {
    const value = event.target.value
    let filterOption = event.target.getAttribute('filter');
    new Promise((resolve) => {
      this.setState({[event.target.name] : event.target.value});
      resolve();
    })
    .then(() => {
      this.props.rangeFilterObject(filterOption, value);
    })
  }

  render(){
    return (
      <div className="sub">
        <div className="sub-title">
            Filters ( {this.props.object.type} )
        </div>
        <div className="sub-filtersmenu">
          <div className="filter-box">
            <div className="box-title">Filters</div>
            <div className="filter-options">
              <div>
                <input type='checkbox' id="filter-grey" className='filter' onClick={this.props.filterObject} filter='grey'/><label htmlFor="filter-grey">Grey</label>
              </div>
              <div>
                <input type='checkbox' id="filter-invert" className='filter' onClick={this.props.filterObject} filter='invert'/><label htmlFor="filter-invert">Invert</label>
              </div>
              <div>
                <input type='checkbox' id="filter-brownie" className='filter' onClick={this.props.filterObject} filter='brownie'/><label htmlFor="filter-brownie">Brownie</label>
              </div>
              <div>
                <input type='checkbox' id="filter-technicolor" className='filter' onClick={this.props.filterObject} filter='technicolor'/><label htmlFor="filter-technicolor">Technicolor</label>
              </div>
              <div>
                <input type='checkbox' id="filter-polaroid" className='filter' onClick={this.props.filterObject} filter='polaroid'/><label htmlFor="filter-polaroid">Polaroid</label>
              </div>
              <div>
                <input type='checkbox' id="filter-blackwhite" className='filter' onClick={this.props.filterObject} filter='blackwhite'/><label htmlFor="filter-blackwhite">Blackwhite</label>
              </div>
              <div>
                <input type='checkbox' id="filter-vintage" className='filter' onClick={this.props.filterObject} filter='vintage'/><label htmlFor="filter-vintage">Vintage</label>
              </div>
              <div>
                <input type='checkbox' id="filter-sepia" className='filter' onClick={this.props.filterObject} filter='sepia'/><label htmlFor="filter-sepia">Sepia</label>
              </div>
              <div>
                <input type='checkbox' id="filter-kodachrome" className='filter' onClick={this.props.filterObject} filter='kodachrome'/><label htmlFor="filter-kodachrome">Kodachrome</label>
              </div>
              <div>
                <input type='checkbox' id="filter-emboss" className='filter' onClick={this.props.filterObject} filter='emboss'/><label htmlFor="filter-emboss">Emboss</label>
              </div>
            </div>
          </div>
          <div className="adjust-box">
            <div className="box-title">Adjust</div>
            <div className="adjust-options">
              <div>
                <input
                  type='range'
                  className='filter'
                  id='brightness'
                  min='-1'
                  max='1'
                  name='brightness'
                  step='0.01'
                  value={this.state.brightness || 0}
                  onChange={this.handleFilterChange} filter='brightness'
                />Brightness
                <label id='brightness-value'>{this.state.brightness}</label>
              </div>
              <div>
                <input
                  type='range'
                  className='filter'
                  id='contrast'
                  min='-1'
                  max='1'
                  name='contrast'
                  step='0.01'
                  value={this.state.contrast || 0}
                  onChange={this.handleFilterChange} filter='contrast'
                />Contrast
                <label id="contrast-value">{this.state.contrast}</label>
                {/* {this.props.object.type === 'image' && this.props.object.filters[16] ? this.props.object.filters[16].contrast : 0 } */}
              </div>
              <div>
                <input
                  type='range'
                  className='filter'
                  id='pixelate'
                  min='1'
                  max='50'
                  name='pixelate'
                  step='1'
                  value={this.state.pixelate || 1}
                  onChange={this.handleFilterChange} filter='pixelate'
                />pixelate
                <label id="pixelate-value">{this.state.pixelate}</label>
                {/* {this.props.object.type === 'image' && this.props.object.filters[17] ? this.props.object.filters[17].blocksize : 0 } */}
              </div>
              <div>
                <input
                  type='range'
                  className='filter'
                  id='blur'
                  min='0'
                  max='1'
                  name='blur'
                  step='0.01'
                  value={this.state.blur || 0}
                  onChange={this.handleFilterChange} filter='blur'
                />blur
                <label id="blur-value">{this.state.blur}</label>
                {/* {this.props.object.type === 'image' && this.props.object.filters[18] ? this.props.object.filters[18].blur : 0 } */}
              </div>
              <div>
                <input
                  type='range'
                  className='filter'
                  id='noise'
                  min='0'
                  max='100'
                  name='noise'
                  step='1'
                  value={this.state.noise || 0}
                  onChange={this.handleFilterChange} filter='noise'
                />noise
                <label id="noise-value">{this.state.noise}</label>
                {/* {this.props.object.type === 'image' && this.props.object.filters[19] ? this.props.object.filters[19].noise : 0 } */}
              </div>
              <div>
                <input
                  type='range'
                  className='filter'
                  id='saturation'
                  min='-1'
                  max='1'
                  name='saturation'
                  step='0.01'
                  value={this.state.saturation || 0}
                  onChange={this.handleFilterChange} filter='saturation'
                />Saturation
                <label id="saturation-value">{this.state.saturation}</label>
                {/* {this.props.object.type === 'image' && this.props.object.filters[20] ? this.props.object.filters[20].saturation : 0 } */}
              </div>
              <div>
                <input
                  type='range'
                  className='filter'
                  id='hue'
                  min='-1'
                  max='1'
                  name='hue'
                  step='0.01'
                  value={this.state.hue || 1}
                  onChange={this.handleFilterChange} filter='hue'
                />Hue
                <label id="hue-value">{this.state.hue}</label>
                {/* {this.props.object.type === 'image' && this.props.object.filters[21] ? this.props.object.filters[21].rotation : 0 } */}
              </div>
              <div>
                <input
                  type='range'
                  className='filter'
                  id='ink'
                  min='0'
                  max='1'
                  name='ink'
                  step='0.01'
                  value={this.state.ink || 0}
                  onChange={this.handleFilterChange} filter='ink'
                />ink from glfx.js
                <label id="ink-value">{this.state.ink}</label>
                {/* {this.props.object.type === 'image' && this.props.object.filters[22] ? this.props.object.filters[22].ink_matrix.ink : 0 } */}
              </div>
              <div>
                <input
                  type='range'
                  className='filter'
                  id='vignette'
                  min='0'
                  max='1'
                  name='vignette'
                  step='0.01'
                  value={this.state.vignette || 0}
                  onChange={this.handleFilterChange} filter='vignette'
                />vignette from glfx.js
                <label id="vignette-value">{this.state.vignette}</label>
                {/* {this.props.object.type === 'image' && this.props.object.filters[23] ? this.props.object.filters[23].vignette_matrix.amount : 0 } */}
              </div>
              <div>
                <input
                  type='range'
                  className='filter'
                  id='zoomblur'
                  min='0'
                  max='1'
                  name='zoomblur'
                  step='0.01'
                  value={this.state.zoomblur || 0}
                  onChange={this.handleFilterChange} filter='zoomblur'
                />zoomblur from glfx.js
                <label id="zoomblur-value">{this.state.zoomblur}</label>
                {/* {this.props.object.type === 'image' && this.props.object.filters[24] ? this.props.object.filters[24].zoomblur_matrix.strength : 0 } */}
              </div>
              <div>
                <input
                  type='range'
                  className='filter'
                  id='opacity'
                  min='0'
                  max='1'
                  name='opacity'
                  step='0.01'
                  value={this.state.opacity || 1}
                  onChange={this.handleFilterChange} filter='opacity'
                  disabled = {this.props.object.type === 'image' ? false : true}
                />opacity
                <label id="opacity-value">{this.state.opacity}</label>
                {/* {this.props.object.type === 'image' ? this.props.object.opacity : 0 } */}
              </div>
            </div>
          </div>        
        </div>
      </div>
    );
  }

}