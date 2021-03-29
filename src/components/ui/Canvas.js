import React, { Component } from 'react';
import i18next from "../../locale/i18n";
import '../../css/ui/Canvas.scss';
import { withTranslation } from "react-i18next";
import { SketchPicker } from 'react-color';

export default withTranslation()(class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cropCanvasSize: { width: 0, height: 0 },
      displayCropCanvas: false,
      color: {
        r: '255',
        g: '255',
        b: '255',
        a: '1',
      },
    };
  }

  componentDidMount() {
    // console.log('Canvas UI Mount');
  }
  componentDidUpdate() {
    // console.log('Canvas UI Update');
  }
  componentWillUnmount() {
    this.props.cropEndCanvas();
    // console.log('Canvas UI Unmount');
  }

  handleChange = (event) => {
    let change_state = {
      width: this.state.cropCanvasSize.width,
      height: this.state.cropCanvasSize.height
    };
    if (event.target.name === 'width') {
      if (this.props.object.left - event.target.value / 2 < 0 ||
        this.props.object.left + event.target.value / 2 > this.props.canvas.width) {
        if (this.props.object.left < event.target.value / 2) {
          this.props.object.left = event.target.value / 2;
        }
        else {
          this.props.object.left = this.props.canvas.width - event.target.value / 2;
        }
        if (event.target.value > this.props.canvas.width) {
          this.props.object.left = this.props.canvas.width / 2;
          change_state.width = this.props.canvas.width;
        }
        else {
          change_state.width = event.target.value;
        }
      }
      else {
        change_state[event.target.name] = event.target.value;
      }
    }
    else {
      if (this.props.object.top - event.target.value / 2 < 0 ||
        this.props.object.top + event.target.value / 2 > this.props.canvas.height) {
        if (this.props.object.top < event.target.value / 2) {
          this.props.object.top = event.target.value / 2;
        }
        else {
          this.props.object.top = this.props.canvas.height - event.target.value / 2;
        }
        if (event.target.value > this.props.canvas.height) {
          this.props.object.top = this.props.canvas.height / 2;
          change_state.height = this.props.canvas.height;
        }
        else {
          change_state.height = event.target.value;
        }
      }
      else {
        change_state[event.target.name] = event.target.value;
      }
    }
    new Promise((resolve) => {
      this.setState({ cropCanvasSize: change_state });
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
    this.props.cropEndCanvas();
  }

  offdisplayCropCanvas = () => {
    this.setState({displayCropCanvas: false});
  }

  handleColorChange = (color) => {
    this.setState({ color: color.rgb})
  }

  handleColorChangeComplete = (color) => {
    this.setState({ color: color.rgb})
    this.props.changeBackgroundColor(color);
  }

  render() {
    return (
      <div className="sub">
        <div className="sub-title">
          {i18next.t('ui/canvas.Canvas')} ( {this.props.object.type} )
        </div>
        <div className="canvas-menu">
          <div className="canvas-reset">
              <button onClick={this.props.resetCanvas}> {i18next.t('ui/canvas.ResetCanvas')} </button>
          </div>
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
              </div>
              : null
            }
          </div>
          <div className="option-title">{i18next.t('ui/canvas.CanvasColor')}</div>
          <div className = "canvas-color">
            <SketchPicker color={ this.state.color } onChange = {this.handleColorChange} onChangeComplete={this.handleColorChangeComplete} />
          </div>
        </div>
      </div>
    );
  }
})