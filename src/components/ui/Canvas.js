import React, { Component } from 'react';
import i18next from "../../locale/i18n";
import '../../css/ui/Canvas.scss';
import { withTranslation } from "react-i18next";
import { HEXtoRGBA } from '../helper/ConverRGB';
import { ObjectIcon } from '../const/consts';

export default withTranslation()(class Canvas extends Component {
  constructor(props) {
    super(props);
    console.log()
    this.state = {
      cropCanvasSize: { width: props.canvas.width/2, height: props.canvas.height/2},
      displayCropCanvas: false,
      color: {
        r: '128',
        g: '128',
        b: '128',
        a: '1',
      },
      hexcolor : '#808080'
    };
  }

  componentDidMount() {
    // console.log('Canvas UI Mount');
    this.canvasUpdate();
  }
  componentDidUpdate() {
    // console.log('Canvas UI Update');
    this.canvasUpdate();
  }
  componentWillUnmount() {
    this.props.cropStopCanvas();
    // console.log('Canvas UI Unmount');
  }

  canvasUpdate = () => {
    document.getElementById("grid-show").checked = this.props.gridOn;
    document.getElementById("grid-snap").checked = this.props.snapOn;
    document.getElementById("object-snap").checked = this.props.objectSnapOn;
  }

  handleChange = (event) => {
    new Promise((resolve) => {
      this.setState({ cropCanvasSize: this.props.setCropCanvasSize(this.state.cropCanvasSize, event.target.name, event.target.value, this.props.object) });
      resolve();
    })
      .then(() => {
        this.props.handleCropCanvasSizeChange(this.state.cropCanvasSize);
      })
  }

  cropCanvas = () => {
    this.setState({displayCropCanvas: true});
    this.props.cropCanvas(this.offdisplayCropCanvas);
  }

  cropEndCanvas = () => {
    this.setState({displayCropCanvas: false});
    this.props.cropEndCanvas(document.getElementById("cropfit").checked);
  }

  cropStopCanvas = () => {
    this.setState({displayCropCanvas: false});
    this.props.cropStopCanvas();
  }

  offdisplayCropCanvas = () => {
    this.setState({displayCropCanvas: false});
  }

  handleColorChange = (event) => {
    new Promise((resolve) => {
      let color = HEXtoRGBA(event.target.value, this.state.color.a)
      this.setState({ color : color, hexcolor : event.target.value});
      resolve(color);
    })
    .then((color) => {
      console.log(color)
      this.props.changeBackgroundColor(color);
    })
  }

  handleOpacityChange = (event) => {
    let change = this.state.color;
    change.a = event.target.value;
    this.setState({ color : change });
    this.props.changeBackgroundColor(change);
  }

  openHiddenMenu = () => {
    document.getElementById("hidden-menu").style = null;

  }

  closeHiddenMenu = () => {
    document.getElementById("hidden-menu").style.setProperty("display", "none");
  }

  clearBackgroundColor = () => {
    let change = this.state.color;
    change.a = 0;
    this.setState({ color : change });
    this.props.clearBackgroundColor();
  }
  
  render() {
    return (
      <div className="sub">
        <div className="sub-title">
          {i18next.t('ui/canvas.Canvas')} ( {this.props.object.type} )
        </div>
        <div className="canvas-menu">
          {/* <div className="canvas-reset">
              <button onClick={this.props.resetCanvas}> {i18next.t('ui/canvas.ResetCanvas')} </button>
          </div> */}
          <div className="option-title">{i18next.t('ui/canvas.CropCanvas')}</div>
          <div className="canvas-crop">
            <button onClick={this.cropCanvas}>{i18next.t('ui/canvas.CropCanvas')}</button>
            {this.state.displayCropCanvas ?
              <div className="crop-box">
                <div className="crop-size-input">
                  <input
                    type='number'
                    onChange={this.handleChange}
                    name='width'
                    min='1'
                    max={this.props.canvas.width}
                    value={this.state.cropCanvasSize.width}
                  />
                  <div>x</div>
                  <input
                    type='number'
                    onChange={this.handleChange}
                    name='height'
                    min='1'
                    max={this.props.canvas.height}
                    value={this.state.cropCanvasSize.height}
                  />
                </div>
                <button onClick={this.cropEndCanvas}>{i18next.t('ui/canvas.CropEndCanvas')}</button>
                <button onClick={this.cropStopCanvas}>{i18next.t('ui/canvas.CropStopCanvas')}</button>
                <input type="checkbox" id="cropfit" /><label htmlFor="cropfit">{i18next.t('ui/canvas.CropBackground')}</label>
              </div>
              : null
            }
          </div>
          <div className="option-title">{i18next.t('ui/canvas.CanvasColor')}</div>
          <div className="color-picker">
            <input type="color" id="colorSource" value={this.state.hexcolor} onChange = { this.handleColorChange }/>
            <div className="cp-rangebox">
                <div>{i18next.t('ui/canvas.Color opacity')}: {this.state.color.a}</div>
                <input type="range" value = {this.state.color.a} min='0' max='1' step='0.01' onChange = {this.handleOpacityChange} />
            </div>
          </div>

          <div className="canvas-trans">
            <button className="trans-background" onClick = {this.clearBackgroundColor}>{i18next.t('ui/canvas.Transparent background')}</button>
          </div>

          <div className="option-title">{i18next.t('ui/canvas.CanvasEtc')}</div>
          <div className="canvas-export-import">
            <button onClick={this.props.exportCanvas}> {i18next.t('ui/canvas.CanvasExport')} </button>
            <div className="file-input-group">
              <label className="input-file-button" htmlFor="_file">{i18next.t('ui/canvas.CanvasImport')}</label>
              <input name="file" type='file' id='_file' onChange={this.props.localImportCanvas} accept=".json" style={{ display: 'none' }}></input>
            </div>
          </div>

          <div className="option-title">{i18next.t('ui/canvas.Beta')}</div>
          <div className="canvas-beta">
              <div className="beta-checkbox">
                  <label className="mycheckbox path">
                      <input id="grid-snap" type="checkbox" onClick={this.props.onClickSnap}/>
                      <svg viewBox="0 0 21 21"><path d={ObjectIcon.checkbox}></path></svg>
                  </label>
                  {i18next.t('ui/canvas.GridSnap')}
              </div>
              <div className="beta-checkbox">
                  <label className="mycheckbox path">
                    <input id="grid-show" type="checkbox" onClick={this.props.onClickGrid}/>
                    <svg viewBox="0 0 21 21"><path d={ObjectIcon.checkbox}></path></svg>
                  </label>
                  {i18next.t('ui/canvas.GridShow')}
              </div>
              <div className="beta-checkbox">
                <label className="mycheckbox path">
                    <input id="object-snap" type="checkbox" onClick={this.props.onClickObjectSnap}/>
                    <svg viewBox="0 0 21 21"><path d={ObjectIcon.checkbox}></path></svg>
                </label>
                {i18next.t('ui/canvas.ObjectSnap')}
              </div>
              <div className="hidden">
                <button onClick = {this.openHiddenMenu}>{i18next.t('ui/canvas.OpenHidden')}</button>
                <button onClick = {this.closeHiddenMenu}>{i18next.t('ui/canvas.CloseHidden')}</button>
              </div>
          </div>
        </div>
      </div>
    );
  }
})