import React, {Component} from 'react';
import switchTools from '../helper/SwitchTools';
import '../../css/ui/Filter.scss';
import {filterList} from '../const/consts';
import { CSSTransition } from 'react-transition-group';
import i18next from "../../locale/i18n";
import { withTranslation } from "react-i18next";
import $ from 'jquery';
export default withTranslation()(class Filter extends Component{
  constructor(props){
    super(props);
    this.filterList = filterList;
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
      vibrance : 0,
      denoise : 50,
      opacity : 1,
      filtermenu : false, // true = open
      adjustmenu : false,
    };
    // this.inputRef = React.createRef();
  }

  componentDidMount(){
    // console.log('Filter UI Mount');
    this.documentUpdate();
  }
  componentDidUpdate(){
    // console.log('Filter UI Update');
    this.documentUpdate();
  }
  
  componentWillUnmount(){
    // console.log('Filter UI Unmount');
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let image = nextProps.object;
    if((nextProps.object.type === 'image') || ( nextProps.object.type === 'not active' && nextProps.getBackgroundImage())) {
      if(nextProps.object.type === 'not active') { image = nextProps.getBackgroundImage(); }
      let ret = {};
      ret['brightness'] = image.filters[15] ? Number(image.filters[15].brightness) : 0;
      ret['contrast'] = image.filters[16] ? Number(image.filters[16].contrast) : 0;
      ret['pixelate'] = image.filters[17] ? Number(image.filters[17].blocksize) : 1;
      ret['blur'] = image.filters[18] ? Number(image.filters[18].blur) : 0;
      ret['noise'] = image.filters[19] ? Number(image.filters[19].noise) : 0;
      ret['saturation'] = image.filters[20] ? Number(image.filters[20].saturation) : 0;
      ret['hue'] = image.filters[21] ? Number(image.filters[21].rotation) : 0;
      ret['ink'] = image.filters[22] ? Number(image.filters[22].ink_matrix.ink) : 0;
      ret['vignette'] = image.filters[23] ? Number(image.filters[23].vignette_matrix.amount) : 0;
      ret['zoomblur'] = image.filters[24] ? Number(image.filters[24].zoomblur_matrix.strength) : 0;
      ret['vibrance'] = image.filters[25] ? Number(image.filters[25].amount) : 0;
      ret['denoise'] = image.filters[26] ? Number(image.filters[26].denoise_matrix.exponent) : 50;
      ret['opacity'] = image.opacity;
      return ret;
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

    if(this.state.adjustmenu){
      for(let i=15; i<filterList.length; i++){
        document.getElementById(filterList[i].toLowerCase()).disabled = !$("input:checkbox[id='"+filterList[i].toLowerCase()+"-checkbox']").is(":checked")
      }
      // document.getElementById('brightness').disabled = !$("input:checkbox[id='brightness-checkbox']").is(":checked")
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

    let list2 = document.getElementsByClassName("rangefilter")
    for(let i=0; i<list2.length; i++){
      list2[i].checked = image.filters[i+15];
    }
  }

  handleFilterChange = (event) => {
    const value = event.target.value
    let filterOption = event.target.getAttribute('filter');
    let checked = $("input:checkbox[id='"+ filterOption +"-checkbox']").is(":checked");
    if(filterOption === 'opacity') { checked = true; }
    new Promise((resolve) => {
      this.setState({[event.target.name] : event.target.value});
      resolve();
    })
    .then(() => {
      this.props.rangeFilterObject(filterOption, checked, value);
    })
  }

  changeMenu = (event) => {
    let option = event.target.getAttribute('option');
    if(option === 'filter'){
      this.setState({filtermenu : true, adjustmenu : false})
    }
    else if (option === 'adjust') {
      this.setState({filtermenu : false, adjustmenu : true})
    }
    else {
      this.setState({filtermenu : false, adjustmenu : false})
    }
  }

  render(){
    return (
      <div className="sub">
        <div className="sub-title">
          {i18next.t('ui/filter.Filters')} ( {this.props.object.type} )
        </div>
        <div className="sub-filtersmenu">
          <div className="filter-title-open">
            <div className="option-title" option="filter" onClick = {this.changeMenu}>{i18next.t('ui/filter.Filters')}</div>
            <div className="option-title" option="adjust" onClick = {this.changeMenu}>{i18next.t('ui/filter.Adjust')}</div>
            <div className="option-title" option="cancel" onClick = {this.changeMenu}>{i18next.t('ui/filter.Close')}</div>
          </div>
          <div className="filter-box">
            <CSSTransition in = {this.state.filtermenu} timeout={200} classNames="my-node" unmountOnExit >
              <div className="filter-options">
                <div>
                  <input type='checkbox' id="filter-grey" className='filter' onClick={this.props.filterObject} filter='grey'/><label htmlFor="filter-grey" className="label-filter-icon" id="label-filter-grey"></label>
                  <label className="filter-name">{i18next.t('ui/filter.Grey')}</label>
                </div>
                <div>
                  <input type='checkbox' id="filter-invert" className='filter' onClick={this.props.filterObject} filter='invert'/><label htmlFor="filter-invert" className="label-filter-icon" id="label-filter-invert"></label>
                  <label className="filter-name">{i18next.t('ui/filter.Invert')}</label>
                </div>
                <div>
                  <input type='checkbox' id="filter-brownie" className='filter' onClick={this.props.filterObject} filter='brownie'/><label htmlFor="filter-brownie" className="label-filter-icon" id="label-filter-brownie">{i18next.t('ui/filter.Brownie')}</label>
                </div>
                <div>
                  <input type='checkbox' id="filter-technicolor" className='filter' onClick={this.props.filterObject} filter='technicolor'/><label htmlFor="filter-technicolor" className="label-filter-icon" id="label-filter-technicolor">{i18next.t('ui/filter.Technicolor')}</label>
                </div>
                <div>
                  <input type='checkbox' id="filter-polaroid" className='filter' onClick={this.props.filterObject} filter='polaroid'/><label htmlFor="filter-polaroid" className="label-filter-icon" id="label-filter-polaroid">{i18next.t('ui/filter.Polaroid')}</label>
                </div>
                <div>
                  <input type='checkbox' id="filter-blackwhite" className='filter' onClick={this.props.filterObject} filter='blackwhite'/><label htmlFor="filter-blackwhite" className="label-filter-icon" id="label-filter-blackwhite">{i18next.t('ui/filter.Blackwhite')}</label>
                </div>
                <div>
                  <input type='checkbox' id="filter-vintage" className='filter' onClick={this.props.filterObject} filter='vintage'/><label htmlFor="filter-vintage" className="label-filter-icon" id="label-filter-vintage">{i18next.t('ui/filter.Vintage')}</label>
                </div>
                <div>
                  <input type='checkbox' id="filter-sepia" className='filter' onClick={this.props.filterObject} filter='sepia'/><label htmlFor="filter-sepia" className="label-filter-icon" id="label-filter-sepia">{i18next.t('ui/filter.Sepia')}</label>
                </div>
                <div>
                  <input type='checkbox' id="filter-kodachrome" className='filter' onClick={this.props.filterObject} filter='kodachrome'/><label htmlFor="filter-kodachrome" className="label-filter-icon" id="label-filter-kodachrome">{i18next.t('ui/filter.Kodachrome')}</label>
                </div>
                <div>
                  <input type='checkbox' id="filter-emboss" className='filter' onClick={this.props.filterObject} filter='emboss'/><label htmlFor="filter-emboss" className="label-filter-icon" id="label-filter-emboss">{i18next.t('ui/filter.Emboss')}</label>
                </div>
                <div>
                  <input type='checkbox' id="filter-resize" className='filter' onClick={this.props.filterObject} filter='resize'/><label htmlFor="filter-resize">test</label>
                </div>
              </div>
            </CSSTransition>
          </div>
          <div className="adjust-box">
            <CSSTransition in = {this.state.adjustmenu} timeout={200} classNames="my-node" unmountOnExit >
              <div className="adjust-options">
              <div>{i18next.t('ui/filter.Brightness')}</div>
                <input type='checkbox' id="brightness-checkbox" className='rangefilter' onClick={this.props.filterObject} filter='brightness' value={this.state.brightness || 0}/>
                <div className="range-box">
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
                  />
                  <label id='brightness-value'>{this.state.brightness}</label>
                </div>
                <div>{i18next.t('ui/filter.Contrast')}</div>
                <input type='checkbox' id="contrast-checkbox" className='rangefilter' onClick={this.props.filterObject} filter='contrast' value={this.state.contrast || 0}/>
                <div className="range-box">
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
                  />
                  <label id="contrast-value">{this.state.contrast}</label>
                  {/* {this.props.object.type === 'image' && this.props.object.filters[16] ? this.props.object.filters[16].contrast : 0 } */}
                </div>
                <div>{i18next.t('ui/filter.Pixelate')}</div>
                <input type='checkbox' id="pixelate-checkbox" className='rangefilter' onClick={this.props.filterObject} filter='pixelate' value={this.state.pixelate || 0}/>
                <div className="range-box">
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
                  />
                  <label id="pixelate-value">{this.state.pixelate}</label>
                  {/* {this.props.object.type === 'image' && this.props.object.filters[17] ? this.props.object.filters[17].blocksize : 0 } */}
                </div>
                <div>{i18next.t('ui/filter.Blur')}</div>
                <input type='checkbox' id="blur-checkbox" className='rangefilter' onClick={this.props.filterObject} filter='blur' value={this.state.blur || 0}/>
                <div className="range-box">
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
                  />
                  <label id="blur-value">{this.state.blur}</label>
                  {/* {this.props.object.type === 'image' && this.props.object.filters[18] ? this.props.object.filters[18].blur : 0 } */}
                </div>
                <div>{i18next.t('ui/filter.Noise')}</div>
                <input type='checkbox' id="noise-checkbox" className='rangefilter' onClick={this.props.filterObject} filter='noise' value={this.state.noise || 0}/>
                <div className="range-box">
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
                  />
                  <label id="noise-value">{this.state.noise}</label>
                  {/* {this.props.object.type === 'image' && this.props.object.filters[19] ? this.props.object.filters[19].noise : 0 } */}
                </div>
                <div>{i18next.t('ui/filter.Saturation')}</div>
                <input type='checkbox' id="saturation-checkbox" className='rangefilter' onClick={this.props.filterObject} filter='saturation' value={this.state.saturation || 0}/>
                <div className="range-box">
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
                  />
                  <label id="saturation-value">{this.state.saturation}</label>
                  {/* {this.props.object.type === 'image' && this.props.object.filters[20] ? this.props.object.filters[20].saturation : 0 } */}
                </div>
                <div>{i18next.t('ui/filter.Hue')}</div>
                <input type='checkbox' id="huerotation-checkbox" className='rangefilter' onClick={this.props.filterObject} filter='hue' value={this.state.hue || 0}/>
                <div className="range-box">
                  <input
                    type='range'
                    className='filter'
                    id='huerotation'
                    min='-1'
                    max='1'
                    name='hue'
                    step='0.01'
                    value={this.state.hue || 1}
                    onChange={this.handleFilterChange} filter='hue'
                  />
                  <label id="hue-value">{this.state.hue}</label>
                  {/* {this.props.object.type === 'image' && this.props.object.filters[21] ? this.props.object.filters[21].rotation : 0 } */}
                </div>
                <div>{i18next.t('ui/filter.Ink')}</div>
                <input type='checkbox' id="ink-checkbox" className='rangefilter' onClick={this.props.filterObject} filter='ink' value={this.state.ink  || 0}/>
                <div className="range-box">
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
                  />
                  <label id="ink-value">{this.state.ink}</label>
                  {/* {this.props.object.type === 'image' && this.props.object.filters[22] ? this.props.object.filters[22].ink_matrix.ink : 0 } */}
                </div>
                <div>{i18next.t('ui/filter.Vignette')}</div>
                <input type='checkbox' id="vignette-checkbox" className='rangefilter' onClick={this.props.filterObject} filter='vignette' value={this.state.vignette || 0}/>
                <div className="range-box">
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
                  />
                  <label id="vignette-value">{this.state.vignette}</label>
                  {/* {this.props.object.type === 'image' && this.props.object.filters[23] ? this.props.object.filters[23].vignette_matrix.amount : 0 } */}
                </div>
                <div>{i18next.t('ui/filter.Zoomblur')}</div>
                <input type='checkbox' id="zoomblur-checkbox" className='rangefilter' onClick={this.props.filterObject} filter='zoomblur' value={this.state.zoomblur || 0}/>
                <div className="range-box">
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
                  />
                  <label id="zoomblur-value">{this.state.zoomblur}</label>
                  {/* {this.props.object.type === 'image' && this.props.object.filters[24] ? this.props.object.filters[24].zoomblur_matrix.strength : 0 } */}
                </div>
                <div>{i18next.t('ui/filter.Vibrance')}</div>
                <input type='checkbox' id="vibrance-checkbox" className='rangefilter' onClick={this.props.filterObject} filter='vibrance' value={this.state.vibrance || 0}/>
                <div className="range-box">
                  <input
                    type='range'
                    className='filter'
                    id='vibrance'
                    min='-1'
                    max='1'
                    name='vibrance'
                    step='0.1'
                    value={this.state.vibrance || 0}
                    onChange={this.handleFilterChange} filter='vibrance'
                  />
                  <label id="vibrance-value">{this.state.vibrance}</label>
                  {/* {this.props.object.type === 'image' && this.props.object.filters[24] ? this.props.object.filters[24].zoomblur_matrix.strength : 0 } */}
                </div>
                <div>{i18next.t('ui/filter.Denoise')}</div>
                <input type='checkbox' id="denoise-checkbox" className='rangefilter' onClick={this.props.filterObject} filter='denoise' value={this.state.denoise || 0}/>
                <div className="range-box">
                  <input
                    type='range'
                    className='filter'
                    id='denoise'
                    min='0'
                    max='50'
                    name='denoise'
                    step='1'
                    value={this.state.denoise || 50}
                    onChange={this.handleFilterChange} filter='denoise'
                  />
                  <label id="denoise-value">{this.state.Opacity}</label>
                  {/* {this.props.object.type === 'image' && this.props.object.filters[24] ? this.props.object.filters[24].zoomblur_matrix.strength : 0 } */}
                </div>
                <div>{i18next.t('ui/filter.Opacity')}</div>
                <div className="range-box">
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
                  />
                  <label id="opacity-value">{this.state.opacity}</label>
                  {/* {this.props.object.type === 'image' ? this.props.object.opacity : 0 } */}
                </div>
              </div>
            </CSSTransition>
          </div>        
        </div>
      </div>
    );
  }
})