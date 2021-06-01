import React, {Component} from 'react';
import switchTools from '../helper/SwitchTools';
import '../../css/ui/Filter.scss';
import {filterList, ObjectIcon} from '../const/consts';
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
      huerotation : 0,
      ink : 0,
      removecolor : { color : "#ffffff", distance : 0},
      vignette : 0,
      zoomblur : 0,
      vibrance : 0,
      denoise : 50,
      grayscale : 0,
      blendcolor : {
        color : '#ffffff',
        mode : 'add',
        alpha : 0
      },
      gamma : {
        r : 1,
        g : 1,
        b : 1,
      },
      hueSaturation : 0,
      tiltshift : 0,
      hexagonalpixelate : 10,
      openrange : false,
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
      ret['grayscale'] = image.filters[10] ? Number(gray_mode.indexOf(image.filters[10].mode)) : 0;
      ret['brightness'] = image.filters[11] ? Number(image.filters[11].brightness) : 0;
      ret['contrast'] = image.filters[12] ? Number(image.filters[12].contrast) : 0;
      ret['pixelate'] = image.filters[13] ? Number(image.filters[13].blocksize) : 1;
      ret['blur'] = image.filters[14] ? Number(image.filters[14].blur) : 0;
      ret['noise'] = image.filters[15] ? Number(image.filters[15].noise) : 0;
      ret['saturation'] = image.filters[16] ? Number(image.filters[16].saturation) : 0;
      ret['huerotation'] = image.filters[17] ? Number(image.filters[17].rotation) : 0;
      ret['ink'] = image.filters[18] ? Number(image.filters[18].ink_matrix.ink) : 0;
      ret['vignette'] = image.filters[19] ? Number(image.filters[19].vignette_matrix.amount) : 0;
      ret['zoomblur'] = image.filters[20] ? Number(image.filters[20].zoomblur_matrix.strength) : 0;
      ret['vibrance'] = image.filters[21] ? Number(image.filters[21].amount) : 0;
      ret['denoise'] = image.filters[22] ? Number(image.filters[22].denoise_matrix.exponent) : 50;
      ret['removecolor'] = image.filters[23] ? { color : image.filters[23].color , distance : image.filters[23].distance} : { color : prevState.removecolor.color , distance : 0};
      ret['blendcolor'] = image.filters[24] ? { color : image.filters[24].color , alpha : image.filters[24].alpha, mode : image.filters[24].mode} : { color : prevState.blendcolor.color , mode : 'add', alpha : 0};
      ret['gamma'] = image.filters[25] ? { r : image.filters[25].gamma[0] , g : image.filters[25].gamma[1], b : image.filters[25].gamma[2]} : { r : 1, g : 1, b : 1 };
      ret['huesaturation'] = image.filters[26] ? Number(image.filters[26].hueSaturation_matrix.saturation) : 0;
      ret['tiltshift'] = image.filters[27] ? Number(image.filters[27].tiltshift_matrix.blurRadius) : 0;
      ret['hexagonalpixelate'] = image.filters[28] ? Number(image.filters[28].hexagonal_matrix.scale) : 10;
      ret['opacity'] = image.opacity;
      // console.log("prevstate ",prevState.removecolor)
      return ret;
    }
    return null;
  }
  
  documentUpdate = () => {
    if(this.props.object.type === 'image'){
      switchTools('filter', 'rangefilter', false);
      this.imageSelection(this.props.object);
    }
    else if(this.props.getBackgroundImage()){
      switchTools('filter', 'rangefilter', false);
      this.imageSelection(this.props.getBackgroundImage());
    }
    else{
      switchTools('filter', 'rangefilter', true)
    }
  }

  imageSelection = (image) => {
    let list = document.getElementsByClassName('filter');
    let change_filters = Array.from({length: this.filterList.length}, () => false);
    image.filters.forEach(filter => {
      if(filter.type === 'Convolute'){
        change_filters[9 - filter.matrix[0]] = filter
      }
      else{
        change_filters[this.filterList.indexOf(filter.type)] = filter;
      }
    });
    image.filters = change_filters;
    // console.log(image.filters)
    for(let i=0; i<list.length; i++){
      list[i].checked = image.filters[i];
    }

    let list2 = document.getElementsByClassName("rangefilter")
    let list2_onoff = document.getElementsByClassName("range-onoff-button")

    for(let i=0; i<list2.length; i++){
      list2[i].checked = image.filters[i+10];
      list2_onoff[i].checked = list2[i].checked
    }

    if(this.state.adjustmenu){
      for(let i=10; i<filterList.length; i++){
        document.getElementById(filterList[i].toLowerCase()).disabled = !$("input:checkbox[id='"+filterList[i].toLowerCase()+"-checkbox']").is(":checked")
        if(filterList[i] === "Gamma"){
          document.getElementById("gamma-g").disabled = !$("input:checkbox[id='"+filterList[i].toLowerCase()+"-checkbox']").is(":checked");
          document.getElementById("gamma-b").disabled = !$("input:checkbox[id='"+filterList[i].toLowerCase()+"-checkbox']").is(":checked")
        }
      }
      // document.getElementById('brightness').disabled = !$("input:checkbox[id='brightness-checkbox']").is(":checked")
    }
  }

  
  filterObject = (event) => {
    this.props.filterObject(event);
  }

  //this.filterObject 대신 사용하는 함수 : value 전달위해 : 체크박스 함수에 사용
  filterObjectforValue = (event) => {

    let option = event.target.getAttribute('filter')
    switch(option){
      case 'removecolor':
        this.props.filterValueObject('removecolor', event.target.checked, this.state.removecolor );
        break;
      case 'blendcolor':
        this.props.filterValueObject('blendcolor', event.target.checked, this.state.blendcolor )
        break;
      case 'gamma':
        this.props.filterValueObject('gamma', event.target.checked, this.state.gamma )
        break;
      default :
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

  //removecolor range 함수에 사용. value가 오브젝트 형태인것만 빼면 특별한 건 없음.
  handleRemoveColorChange = (event) => {
    const value = { color : this.state.removecolor.color, distance : event.target.value}
    let filterOption = event.target.getAttribute('filter');
    let checked = $("input:checkbox[id='"+ filterOption +"-checkbox']").is(":checked");
    new Promise((resolve) => {
      this.setState({removecolor : value });
      // console.log(filterOption, checked, value)
      resolve();
    })
    .then(() => {
      this.props.rangeFilterObject(filterOption, checked, value);
    })
  }

  handleBlendColorChange = (event) => {
    const value = { color : this.state.blendcolor.color, alpha : event.target.value, mode : this.state.blendcolor.mode}
    let filterOption = event.target.getAttribute('filter');
    let checked = $("input:checkbox[id='"+ filterOption +"-checkbox']").is(":checked");
    new Promise((resolve) => {
      this.setState({blendcolor : value });
      // console.log(filterOption, checked, value)
      resolve();
    })
    .then(() => {
      this.props.rangeFilterObject(filterOption, checked, value);
    })
  }

  handleMultipleFilterChange = (event) => {
    // 바꿔야 할 부분은 const랑 setState하는 부분. Mode는 어떻게 합치지?
    // 결국 value랑 state부분만 잘 손보면 정리 가능할 듯

    // const value = { color : this.state.removecolor.color, distance : event.target.value}
    // let filterOption = event.target.getAttribute('filter');
    // let checked = $("input:checkbox[id='"+ filterOption +"-checkbox']").is(":checked");
    // new Promise((resolve) => {
    //   // this.setState({removecolor : value });
    //   resolve();
    // })
    // .then(() => {
    //   this.props.rangeFilterObject(filterOption, checked, value);
    // })
  }

  handleBlendModeChange = (event) => {
    let value = this.state.blendcolor;
    value.mode = event.target.value;
    let filterOption = 'blendcolor'
    let checked = $("input:checkbox[id='"+ filterOption +"-checkbox']").is(":checked");
    new Promise((resolve) => {
      this.setState({ blendcolor : value });
      // console.log(filterOption, checked, value)
      resolve();
    })
    .then(() => {
      this.props.rangeFilterObject(filterOption, checked, value);
    })
  }

  handleGammaChange = (event) => {
    const gamma_id = event.target.getAttribute("id");
    let value;
    // console.log(this.state.gamma)
    switch(gamma_id){
      case 'gamma':
        value = { r : event.target.value, g : this.state.gamma.g, b : this.state.gamma.b}
        break;
      case 'gamma-g':
        value = { r : this.state.gamma.r, g : event.target.value, b : this.state.gamma.b}
        break;
      case 'gamma-b':
        value = { r : this.state.gamma.r, g : this.state.gamma.g, b : event.target.value}
        break;
      default:
        value = this.state.gamma;
        break;
    }
    let filterOption = event.target.getAttribute('filter');
    let checked = $("input:checkbox[id='"+ filterOption +"-checkbox']").is(":checked");
    new Promise((resolve) => {
      this.setState({ gamma : value });
      // console.log(filterOption, checked, value)
      resolve();
    })
    .then(() => {
      this.props.rangeFilterObject(filterOption, checked, value);
    })
  }

  //removecolor color 함수에 사용. 색상이 변경되면, 체크여부 확인 후, 현재 distance와 함께 필터 적용.
  setRemoveColor = (event) => {
    const value = {color  : event.target.value, distance : this.state.removecolor.distance}
    new Promise((resolve) => {
      // console.log("what : ", event.target.value)
      this.setState({ removecolor : value});
      resolve();
    })
    .then(() => {
      let checked = $("input:checkbox[id='removecolor-checkbox']").is(":checked");
      // console.log("setcolor : ", this.state.removecolor, checked)
      if(checked){
        // console.log("checkde : ", value)
        this.props.rangeFilterObject('removecolor', checked, value);
      }
    })
  }

  setBlendColor = (event) => {
    const value = {color  : event.target.value, alpha : this.state.blendcolor.alpha, mode:  this.state.blendcolor.mode}
    new Promise((resolve) => {
      // console.log("what : ", event.target.value)
      this.setState({ blendcolor : value});
      resolve();
    })
    .then(() => {
      let checked = $("input:checkbox[id='blendcolor-checkbox']").is(":checked");
      // console.log("setcolor : ", this.state.removecolor, checked)
      if(checked){
        // console.log("checkde : ", value)
        this.props.rangeFilterObject('blendcolor', checked, value);
      }
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

  changeRange = (event) => {
    if(event.target.checked){
      // 이전에 열었던 필터가 활성화 되지 않았다면, off 해준다.
      if(this.state.openrange !== false && !document.getElementById(this.state.openrange + "-checkbox").checked){
        console.log(this.state.openrange + "-checkbox", "이 필터는 닫힌다")
        document.getElementById(this.state.openrange + "-onoff-checkbox").checked = false
      }
      //open range
      this.setState({ openrange : event.target.getAttribute('filter')})
    }
    else{
      // 지금 누른게 활성화 되있다면, off 해주지 않는다
      if(this.state.openrange !== false && document.getElementById( event.target.getAttribute('filter') + "-checkbox").checked){

        //이전에 열었던 건 활성화 여부 확인 후 off 여부 결정
        if(this.state.openrange !== false && !document.getElementById(this.state.openrange + "-checkbox").checked){
          document.getElementById(this.state.openrange + "-onoff-checkbox").checked = false
        }

        //off하지 않는다.
        console.log('not off')
        document.getElementById(event.target.getAttribute('filter') + "-onoff-checkbox").checked = true

        // 열어준다
        this.setState({ openrange :  event.target.getAttribute('filter')})
      }

      // 초기 상태에서 체크되어 있는거 연다.
      else if ( this.state.openrange === false && document.getElementById( event.target.getAttribute('filter') + "-checkbox").checked){
        this.setState({ openrange :  event.target.getAttribute('filter')})
      }

      else{
        //close range
        console.log('close range')
        this.setState({ openrange : false})
      }

    }
    console.log(this.state.openrange);
  }

  rangeStyle = (option) => {
    if(option === this.state.openrange){
      return { display : 'flex'};
    }
    else{
      return { display : 'none'};
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
            <div className={this.state.filtermenu ? "option-title-opened" : "option-title"} option="filter" onClick = {this.changeMenu}>{i18next.t('ui/filter.Filters')}&#9660;</div>
            <div className={this.state.adjustmenu ? "option-title-opened" : "option-title"} option="adjust" onClick = {this.changeMenu}>{i18next.t('ui/filter.Adjust')}&#9660;</div>
            <div className="option-title" option="cancel" onClick = {this.changeMenu}>{i18next.t('ui/filter.Close')}</div>
          </div>
          <div className="filter-box">
            <CSSTransition in = {this.state.filtermenu} timeout={200} classNames="my-node" unmountOnExit >
              <div className="filter-options">
                <div>
                  <input type='checkbox' id="filter-invert" className='filter' onClick={this.props.filterObject} filter='invert'/>
                  <label htmlFor="filter-invert" className="label-filter-icon" id="label-filter-invert">{i18next.t('ui/filter.Invert')}</label>
                </div>
                <div>
                  <input type='checkbox' id="filter-brownie" className='filter' onClick={this.props.filterObject} filter='brownie'/>
                  <label htmlFor="filter-brownie" className="label-filter-icon" id="label-filter-brownie">{i18next.t('ui/filter.Brownie')}</label>
                </div>
                <div>
                  <input type='checkbox' id="filter-technicolor" className='filter' onClick={this.props.filterObject} filter='technicolor'/>
                  <label htmlFor="filter-technicolor" className="label-filter-icon" id="label-filter-technicolor">{i18next.t('ui/filter.Technicolor')}</label>
                </div>
                <div>
                  <input type='checkbox' id="filter-polaroid" className='filter' onClick={this.props.filterObject} filter='polaroid'/>
                  <label htmlFor="filter-polaroid" className="label-filter-icon" id="label-filter-polaroid">{i18next.t('ui/filter.Polaroid')}</label>
                </div>
                <div>
                  <input type='checkbox' id="filter-blackwhite" className='filter' onClick={this.props.filterObject} filter='blackwhite'/>
                  <label htmlFor="filter-blackwhite" className="label-filter-icon" id="label-filter-blackwhite">{i18next.t('ui/filter.Blackwhite')}</label>
                </div>
                <div>
                  <input type='checkbox' id="filter-vintage" className='filter' onClick={this.props.filterObject} filter='vintage'/>
                  <label htmlFor="filter-vintage" className="label-filter-icon" id="label-filter-vintage">{i18next.t('ui/filter.Vintage')}</label>
                </div>
                <div>
                  <input type='checkbox' id="filter-sepia" className='filter' onClick={this.props.filterObject} filter='sepia'/>
                  <label htmlFor="filter-sepia" className="label-filter-icon" id="label-filter-sepia">{i18next.t('ui/filter.Sepia')}</label>
                </div>
                <div>
                  <input type='checkbox' id="filter-kodachrome" className='filter' onClick={this.props.filterObject} filter='kodachrome'/>
                  <label htmlFor="filter-kodachrome" className="label-filter-icon" id="label-filter-kodachrome">{i18next.t('ui/filter.Kodachrome')}</label>
                </div>
                <div>
                  <input type='checkbox' id="filter-emboss" className='filter' onClick={this.props.filterObject} filter='emboss'/>
                  <label htmlFor="filter-emboss" className="label-filter-icon" id="label-filter-emboss">{i18next.t('ui/filter.Emboss')}</label>
                </div>
                <div>
                  <input type='checkbox' id="filter-sharpen" className='filter' onClick={this.props.filterObject} filter='sharpen'/>
                  <label htmlFor="filter-sharpen" className="label-filter-icon" id="label-filter-sharpen">{i18next.t('ui/filter.Sharpen')}</label>
                </div>
              </div>
            </CSSTransition>
          </div>
          <div className="adjust-box">
            <CSSTransition in = {this.state.adjustmenu} timeout={200} classNames="my-node" unmountOnExit >
              <div className="adjust-options">
                <div className="range-onoff">
                  <input className="range-onoff-button" id="grayscale-onoff-checkbox" type="checkbox" onClick = {this.changeRange} filter='grayscale'/>
                  <label htmlFor="grayscale-onoff-checkbox">{i18next.t('ui/filter.Grey')}</label>
                </div>
                <div className="range-box" style = {this.rangeStyle('grayscale')}>
                  <label className="mycheckbox path">
                    <input type='checkbox' id="grayscale-checkbox" className='rangefilter' onClick={this.filterObject} filter='grayscale' value={this.state.grayscale|| 0}/>
                      <svg viewBox="0 0 21 21">
                        <path d={ObjectIcon.checkbox}></path>
                      </svg>
                  </label>
                  <input
                    type='range'
                    className='filter'
                    id='grayscale'
                    min='0'
                    max='2'
                    name='grayscale'
                    step='1'
                    value={this.state.grayscale || 0}
                    onChange={this.handleFilterChange} filter='grayscale'
                  />
                  <div className="range-value">
                    {this.state.grayscale}
                  </div>
                </div>
              
                {/* <div onClick = {this.changeRange} filter='brightness'>{i18next.t('ui/filter.Brightness')} {this.state.brightness}</div> */}
                <div className="range-onoff">
                  <input className="range-onoff-button" id="brightness-onoff-checkbox" type="checkbox" onClick = {this.changeRange} filter='brightness'/>
                  <label htmlFor="brightness-onoff-checkbox">{i18next.t('ui/filter.Brightness')}</label>
                </div>
                <div className="range-box" style = {this.rangeStyle('brightness')}>
                  <label className="mycheckbox path">
                    <input type='checkbox' id="brightness-checkbox" className='rangefilter' onClick={this.filterObject} filter='brightness' value={this.state.brightness || 0}/>
                      <svg viewBox="0 0 21 21">
                        <path d={ObjectIcon.checkbox}></path>
                      </svg>
                  </label>
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
                  <div className="range-value">
                    {this.state.brightness}
                  </div>
                </div>
               
                {/* <div onClick = {this.changeRange} filter='contrast'>{i18next.t('ui/filter.Contrast')} {this.state.contrast}</div> */}
                <div className="range-onoff">
                  <input className="range-onoff-button" id="contrast-onoff-checkbox" type="checkbox" onClick = {this.changeRange} filter='contrast'/>
                  <label htmlFor="contrast-onoff-checkbox">{i18next.t('ui/filter.Contrast')}</label>
                </div>
                <div className="range-box" style = {this.rangeStyle('contrast')}>
                  <label className="mycheckbox path">
                    <input type='checkbox' id="contrast-checkbox" className='rangefilter' onClick={this.filterObject} filter='contrast' value={this.state.contrast || 0}/>
                      <svg viewBox="0 0 21 21">
                        <path d={ObjectIcon.checkbox}></path>
                      </svg>
                  </label>
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
                  <div className="range-value">
                    {this.state.contrast}
                  </div>
                </div>

                {/* <div onClick = {this.changeRange} filter='pixelate'>{i18next.t('ui/filter.Pixelate')} {this.state.pixelate}</div> */}
                <div className="range-onoff">
                  <input className="range-onoff-button" id="pixelate-onoff-checkbox" type="checkbox" onClick = {this.changeRange} filter='pixelate'/>
                  <label htmlFor="pixelate-onoff-checkbox">{i18next.t('ui/filter.Pixelate')}</label>
                </div>
                <div className="range-box" style = {this.rangeStyle('pixelate')}>
                  <label className="mycheckbox path">
                    <input type='checkbox' id="pixelate-checkbox" className='rangefilter' onClick={this.filterObject} filter='pixelate' value={this.state.pixelate || 0}/>
                      <svg viewBox="0 0 21 21">
                        <path d={ObjectIcon.checkbox}></path>
                      </svg>
                  </label>
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
                  <div className="range-value">
                    {this.state.pixelate}
                  </div>
                </div>

                {/* <div onClick = {this.changeRange} filter='blur'>{i18next.t('ui/filter.Blur')} {this.state.blur}</div> */}
                <div className="range-onoff">
                  <input className="range-onoff-button" id="blur-onoff-checkbox" type="checkbox" onClick = {this.changeRange} filter='blur'/>
                  <label htmlFor="blur-onoff-checkbox">{i18next.t('ui/filter.Blur')}</label>
                </div>
                <div className="range-box" style = {this.rangeStyle('blur')}>
                  <label className="mycheckbox path">
                    <input type='checkbox' id="blur-checkbox" className='rangefilter' onClick={this.filterObject} filter='blur' value={this.state.blur || 0}/>
                      <svg viewBox="0 0 21 21">
                        <path d={ObjectIcon.checkbox}></path>
                      </svg>
                  </label>
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
                  <div className="range-value">
                    {this.state.blur}
                  </div>
                </div>

                {/* <div onClick = {this.changeRange} filter='noise'>{i18next.t('ui/filter.Noise')} {this.state.noise}</div> */}
                <div className="range-onoff">
                  <input className="range-onoff-button" id="noise-onoff-checkbox" type="checkbox" onClick = {this.changeRange} filter='noise'/>
                  <label htmlFor="noise-onoff-checkbox">{i18next.t('ui/filter.Noise')}</label>
                </div>
                <div className="range-box" style = {this.rangeStyle('noise')}>
                  <label className="mycheckbox path">
                    <input type='checkbox' id="noise-checkbox" className='rangefilter' onClick={this.filterObject} filter='noise' value={this.state.noise || 0}/>
                      <svg viewBox="0 0 21 21">
                        <path d={ObjectIcon.checkbox}></path>
                      </svg>
                  </label>
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
                  <div className="range-value">
                    {this.state.noise}
                  </div>
                </div>

                {/* <div onClick = {this.changeRange} filter='saturation'>{i18next.t('ui/filter.Saturation')} {this.state.saturation}</div> */}
                <div className="range-onoff">
                  <input className="range-onoff-button" id="saturation-onoff-checkbox" type="checkbox" onClick = {this.changeRange} filter='saturation'/>
                  <label htmlFor="saturation-onoff-checkbox">{i18next.t('ui/filter.Saturation')}</label>
                </div>
                <div className="range-box" style = {this.rangeStyle('saturation')}>
                  <label className="mycheckbox path">
                    <input type='checkbox' id="saturation-checkbox" className='rangefilter' onClick={this.filterObject} filter='saturation' value={this.state.saturation || 0}/>
                      <svg viewBox="0 0 21 21">
                        <path d={ObjectIcon.checkbox}></path>
                      </svg>
                  </label>
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
                  <div className="range-value">
                    {this.state.saturation}
                  </div>
                </div>

                {/* <div onClick = {this.changeRange} filter='huerotation'>{i18next.t('ui/filter.Hue')} {this.state.hue}</div> */}
                <div className="range-onoff">
                  <input className="range-onoff-button" id="huerotation-onoff-checkbox" type="checkbox" onClick = {this.changeRange} filter='huerotation'/>
                  <label htmlFor="huerotation-onoff-checkbox">{i18next.t('ui/filter.Hue')}</label>
                </div>
                <div className="range-box" style = {this.rangeStyle('huerotation')}>
                  <label className="mycheckbox path">
                    <input type='checkbox' id="huerotation-checkbox" className='rangefilter' onClick={this.filterObject} filter='huerotation' value={this.state.huerotation || 0}/>
                      <svg viewBox="0 0 21 21">
                        <path d={ObjectIcon.checkbox}></path>
                      </svg>
                  </label>
                  <input
                    type='range'
                    className='filter'
                    id='huerotation'
                    min='-1'
                    max='1'
                    name='huerotation'
                    step='0.01'
                    value={this.state.huerotation || 1}
                    onChange={this.handleFilterChange} filter='huerotation'
                  />
                  <div className="range-value">
                    {this.state.huerotation}
                  </div>
                </div>

                {/* <div onClick = {this.changeRange} filter='ink'>{i18next.t('ui/filter.Ink')} {this.state.ink}</div> */}
                <div className="range-onoff">
                  <input className="range-onoff-button" id="ink-onoff-checkbox" type="checkbox" onClick = {this.changeRange} filter='ink'/>
                  <label htmlFor="ink-onoff-checkbox">{i18next.t('ui/filter.Ink')}</label>
                </div>
                <div className="range-box" style = {this.rangeStyle('ink')}>
                  <label className="mycheckbox path">
                    <input type='checkbox' id="ink-checkbox" className='rangefilter' onClick={this.filterObject} filter='ink' value={this.state.ink  || 0}/>
                      <svg viewBox="0 0 21 21">
                        <path d={ObjectIcon.checkbox}></path>
                      </svg>
                  </label>
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
                  <div className="range-value">
                    {this.state.ink}
                  </div>
                </div>

                {/* <div onClick = {this.changeRange} filter='vignette'>{i18next.t('ui/filter.Vignette')} {this.state.vignette}</div> */}
                <div className="range-onoff">
                  <input className="range-onoff-button" id="vignette-onoff-checkbox" type="checkbox" onClick = {this.changeRange} filter='vignette'/>
                  <label htmlFor="vignette-onoff-checkbox">{i18next.t('ui/filter.Vignette')}</label>
                </div>
                <div className="range-box" style = {this.rangeStyle('vignette')}>
                  <label className="mycheckbox path">
                    <input type='checkbox' id="vignette-checkbox" className='rangefilter' onClick={this.filterObject} filter='vignette' value={this.state.vignette || 0}/>
                      <svg viewBox="0 0 21 21">
                        <path d={ObjectIcon.checkbox}></path>
                      </svg>
                  </label>
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
                  <div className="range-value">
                    {this.state.vignette}
                  </div>
                </div>

                {/* <div onClick = {this.changeRange} filter='zoomblur'>{i18next.t('ui/filter.Zoomblur')} {this.state.zoomblur}</div> */}
                <div className="range-onoff">
                  <input className="range-onoff-button" id="zoomblur-onoff-checkbox" type="checkbox" onClick = {this.changeRange} filter='zoomblur'/>
                  <label htmlFor="zoomblur-onoff-checkbox">{i18next.t('ui/filter.Zoomblur')}</label>
                </div>
                <div className="range-box" style = {this.rangeStyle('zoomblur')}>
                  <label className="mycheckbox path">
                    <input type='checkbox' id="zoomblur-checkbox" className='rangefilter' onClick={this.filterObject} filter='zoomblur' value={this.state.zoomblur || 0}/>
                      <svg viewBox="0 0 21 21">
                        <path d={ObjectIcon.checkbox}></path>
                      </svg>
                  </label>
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
                  <div className="range-value">
                    {this.state.zoomblur}
                  </div>
                </div>

                {/* <div onClick = {this.changeRange} filter='vibrance'>{i18next.t('ui/filter.Vibrance')} {this.state.vibrance}</div> */}
                <div className="range-onoff">
                  <input className="range-onoff-button" id="vibrance-onoff-checkbox" type="checkbox" onClick = {this.changeRange} filter='vibrance'/>
                  <label htmlFor="vibrance-onoff-checkbox">{i18next.t('ui/filter.Vibrance')}</label>
                </div>
                <div className="range-box" style = {this.rangeStyle('vibrance')}>
                  <label className="mycheckbox path">
                    <input type='checkbox' id="vibrance-checkbox" className='rangefilter' onClick={this.filterObject} filter='vibrance' value={this.state.vibrance || 0}/>
                      <svg viewBox="0 0 21 21">
                        <path d={ObjectIcon.checkbox}></path>
                      </svg>
                  </label>
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
                  <div className="range-value">
                    {this.state.vibrance}
                  </div>
                </div>

                {/* <div onClick = {this.changeRange} filter='denoise'>{i18next.t('ui/filter.Denoise')} {this.state.denoise}</div> */}
                <div className="range-onoff">
                  <input className="range-onoff-button" id="denoise-onoff-checkbox" type="checkbox" onClick = {this.changeRange} filter='denoise'/>
                  <label htmlFor="denoise-onoff-checkbox">{i18next.t('ui/filter.Denoise')}</label>
                </div>
                <div className="range-box" style = {this.rangeStyle('denoise')}>
                  <label className="mycheckbox path">
                    <input type='checkbox' id="denoise-checkbox" className='rangefilter' onClick={this.filterObject} filter='denoise' value={this.state.denoise || 0}/>
                      <svg viewBox="0 0 21 21">
                        <path d={ObjectIcon.checkbox}></path>
                      </svg>
                  </label>
                  <input
                    type='range'
                    className='filter'
                    id='denoise'
                    min='0'
                    max='50'
                    name='denoise'
                    step='1'
                    value={this.state.denoise || 0}
                    onChange={this.handleFilterChange} filter='denoise'
                  />
                  <div className="range-value">
                    {this.state.denoise}
                  </div>
                </div>
                
                <div className="range-onoff">
                  <input className="range-onoff-button" id="removecolor-onoff-checkbox" type="checkbox" onClick = {this.changeRange} filter='removecolor'/>
                  <label htmlFor="removecolor-onoff-checkbox">{i18next.t('ui/filter.RemoveColor')}</label>
                </div>
                <div className="range-box" style = {this.rangeStyle('removecolor')}>
                  <label className="mycheckbox path">
                    <input type='checkbox' id="removecolor-checkbox" className='rangefilter' onClick={this.filterObjectforValue} filter='removecolor'/>
                      <svg viewBox="0 0 21 21">
                        <path d={ObjectIcon.checkbox}></path>
                      </svg>
                  </label>
                  <input type="color" id="colorSource" value={this.state.removecolor.color} onChange = { this.setRemoveColor}/>
                  <input
                    type='range'
                    className='filter'
                    id='removecolor'
                    min='0'
                    max='1'
                    name='removecolor'
                    step='0.01'
                    value={this.state.removecolor.distance || 0}
                    onChange={ this.handleRemoveColorChange } filter='removecolor'
                  />
                  <div className="range-value">
                    {this.state.removecolor.distance}
                  </div>
                </div>

                <div className="range-onoff">
                  <input className="range-onoff-button" id="blendcolor-onoff-checkbox" type="checkbox" onClick = {this.changeRange} filter='blendcolor'/>
                  <label htmlFor="blendcolor-onoff-checkbox">{i18next.t('ui/filter.BlendColor')}</label>
                </div>
                <div className="range-box" id="blend-color-range-box" style = {this.rangeStyle('blendcolor')}>
                  <div className="blend-color-div">
                    <label className="mycheckbox path">
                      <input type='checkbox' id="blendcolor-checkbox" className='rangefilter' onClick={this.filterObjectforValue} filter='blendcolor'/>
                        <svg viewBox="0 0 21 21">
                          <path d={ObjectIcon.checkbox}></path>
                        </svg>
                    </label>
                    <input type="color" id="colorSource" value={this.state.blendcolor.color} onChange = { this.setBlendColor }/>
                    <select className='rangefilter-select' id="blend-mode" name="blend-mode" onChange = {this.handleBlendModeChange} value = {this.state.blendcolor.mode}>
                      <option value="add">Add</option>
                      <option value="diff">Diff</option>
                      <option value="subtract">Subtract</option>
                      <option value="multiply">Multiply</option>
                      <option value="screen">Screen</option>
                      <option value="lighten">Lighten</option>
                      <option value="darken">Darken</option>
                      <option value="overlay">Overlay</option>
                      <option value="exclusion">Exclusion</option>
                      <option value="tint">Tint</option>
                    </select>
                  </div>
                  <div className="blend-color-div">
                    <input
                      type='range'
                      className='filter'
                      id='blendcolor'
                      min='0'
                      max='1'
                      name='blendcolor'
                      step='0.01'
                      value={this.state.blendcolor.alpha || 0}
                      onChange={ this.handleBlendColorChange } filter='blendcolor'
                    />
                    <div className="range-value">
                      {this.state.blendcolor.alpha}
                    </div>
                  </div>
                </div>
                <div className="range-onoff">
                  <input className="range-onoff-button" id="gamma-onoff-checkbox" type="checkbox" onClick = {this.changeRange} filter='gamma'/>
                  <label htmlFor="gamma-onoff-checkbox">{i18next.t('ui/filter.Gamma')}</label>
                </div>
                <div className="range-box" id="gamma-box" style = {this.rangeStyle('gamma')}>
                  <label className="mycheckbox path">
                    <input type='checkbox' id="gamma-checkbox" className='rangefilter' onClick={this.filterObjectforValue} filter='gamma'/>
                      <svg viewBox="0 0 21 21">
                        <path d={ObjectIcon.checkbox}></path>
                      </svg>
                  </label>
                  <div className="gamma-range-box">
										<div className="range-with-value">
											<input
													type='range'
													className='filter'
													id='gamma'
													min='0.2'
													max='2.2'
													name='gamma'
													step='0.01'
													value={this.state.gamma.r || 1}
													onChange={ this.handleGammaChange } filter='gamma'
											/>
											{this.state.gamma.r}
										</div>
										<div className="range-with-value">
											<input
													type='range'
													className='filter'
													id='gamma-g'
													min='0.2'
													max='2.2'
													name='gamma'
													step='0.01'
													value={this.state.gamma.g || 1}
													onChange={ this.handleGammaChange } filter='gamma'
											/>
										{this.state.gamma.g}
										</div>
										<div className="range-with-value">
											<input
													type='range'
													className='filter'
													id='gamma-b'
													min='0.2'
													max='2.2'
													name='gamma'
													step='0.01'
													value={this.state.gamma.b || 1}
													onChange={ this.handleGammaChange } filter='gamma'
											/>
                      {this.state.gamma.b}
										</div>
                  </div>
                </div>

                <div className="range-onoff">
                  <input className="range-onoff-button" id="huesaturation-onoff-checkbox" type="checkbox" onClick = {this.changeRange} filter='huesaturation'/>
                  <label htmlFor="huesaturation-onoff-checkbox">{i18next.t('ui/filter.Hue/Saturation')}</label>
                </div>
                <div className="range-box" style = {this.rangeStyle('huesaturation')}>
                  <label className="mycheckbox path">
                    <input type='checkbox' id="huesaturation-checkbox" className='rangefilter' onClick={this.filterObject} filter='huesaturation' value={this.state.huesaturation || 0}/>
                      <svg viewBox="0 0 21 21">
                        <path d={ObjectIcon.checkbox}></path>
                      </svg>
                  </label>
                  <input
                    type='range'
                    className='filter'
                    id='huesaturation'
                    min='-1'
                    max='1'
                    name='huesaturation'
                    step='0.1'
                    value={this.state.huesaturation || 0}
                    onChange={this.handleFilterChange} filter='huesaturation'
                  />
                  <div className="range-value">
                    {this.state.huesaturation}
                  </div>
                </div>
                
                {/* <div className="range-onoff">
                  <input className="range-onoff-button" id="tiltshift-onoff-checkbox" type="checkbox" onClick = {this.changeRange} filter='tiltshift'/>
                  <label htmlFor="tiltshift-onoff-checkbox">{i18next.t('ui/filter.Tiltshift')}</label>
                </div>
                <div className="range-box" style = {this.rangeStyle('tiltshift')}>
                  <label className="mycheckbox path">
                    <input type='checkbox' id="tiltshift-checkbox" className='rangefilter' onClick={this.filterObject} filter='tiltshift' value={this.state.tiltshift || 0}/>
                      <svg viewBox="0 0 21 21">
                        <path d={ObjectIcon.checkbox}></path>
                      </svg>
                  </label>
                  <input
                    type='range'
                    className='filter'
                    id='tiltshift'
                    min='0'
                    max='50'
                    name='tiltshift'
                    step='1'
                    value={this.state.tiltshift || 0}
                    onChange={this.handleFilterChange} filter='tiltshift'
                  />
                  <div className="range-value">
                    {this.state.tiltshift}
                  </div>
                </div> */}

                {/* <div className="range-onoff">
                  <input className="range-onoff-button" id="hexagonalpixelate-onoff-checkbox" type="checkbox" onClick = {this.changeRange} filter='hexagonalpixelate'/>
                  <label htmlFor="hexagonalpixelate-onoff-checkbox">{i18next.t('ui/filter.HexagonalPixelate')}</label>
                </div>
                <div className="range-box" style = {this.rangeStyle('hexagonalpixelate')}>
                  <label className="mycheckbox path">
                    <input type='checkbox' id="hexagonalpixelate-checkbox" className='rangefilter' onClick={this.filterObject} filter='hexagonalpixelate' value={this.state.hexagonalpixelate || 10}/>
                      <svg viewBox="0 0 21 21">
                        <path d={ObjectIcon.checkbox}></path>
                      </svg>
                  </label>
                  <input
                    type='range'
                    className='filter'
                    id='hexagonalpixelate'
                    min='10'
                    max='100'
                    name='hexagonalpixelate'
                    step='1'
                    value={this.state.hexagonalpixelate || 10}
                    onChange={this.handleFilterChange} filter='hexagonalpixelate'
                  />
                  <div className="range-value">
                    {this.state.hexagonalpixelate}
                  </div>
                </div> */}


                <div className="range-onoff">
                  <input className="range-onoff-button" id="opacity-onoff-checkbox" type="checkbox" onClick = {this.changeRange} filter='opacity'/>
                  <label htmlFor="opacity-onoff-checkbox">{i18next.t('ui/filter.Opacity')}</label>
                </div>
                <div className="range-box" style = {this.rangeStyle('opacity')}>
                  <label className="mycheckbox path" style={{display : 'none'}}>
                    <input type='checkbox' id="opacity-checkbox" className='rangefilter' onClick={this.filterObject} filter='opacity' value={this.state.opacity || 10}/>
                      <svg viewBox="0 0 21 21">
                        <path d={ObjectIcon.checkbox}></path>
                      </svg>
                  </label>
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
                  <div className="range-value">
                    {this.state.opacity}
                  </div>
                </div>
              </div>
            </CSSTransition>
          </div>        
        </div>
      </div>
    );
  }
})

const gray_mode = ['average', 'luminosity', 'lightness']
