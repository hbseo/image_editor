import React, { Component } from 'react';
import i18next from "../../locale/i18n";
import { withTranslation } from "react-i18next";
import '../../css/ui/Object.scss';
import { ObjectIcon } from '../const/consts';

export default withTranslation()(class Objects extends Component {
  // constructor(props){
  //   super(props);
  // }

  componentDidMount() {
    // console.log('Object UI Mount');
    this.documentUpdate();
  }
  componentDidUpdate() {
    // console.log('Object UI Update');
    this.documentUpdate();
  }
  componentWillUnmount() {
    // console.log('Object UI Unmount');
  }

  documentUpdate = () => {
    document.getElementById("lockScale").checked = this.props.getLockScale();
  }

  handleScaleXChange = (event) => {
    this.props.scaleXChange(event.target.value);
  }

  handleScaleYChange = (event) => {
    this.props.scaleYChange(event.target.value);
  }

  flipObject = (event) => {
    let option = event.target.getAttribute('flip');
    this.props.flipObject(option);
  }

  render() {
    return (
      <div className="sub">
        <div className="sub-title">
          {i18next.t('ui/object.Object')} ( {this.props.object.type} )
        </div>
        <div className="sub-objmenu">
          <div className="option-title"> {i18next.t('ui/object.Order')}</div>
          <div className="obj-order">
            <div className ="order-div">
              <svg onClick={this.props.bringToFront} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
                <path d={ObjectIcon.bringToFront}/>
              </svg>
              <p className="attribute">{i18next.t('ui/object.BringToFront')}</p>
            </div>

            <div className ="order-div">
              <svg onClick={this.props.sendToBack} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
                <path d={ObjectIcon.sendToBack}/>
              </svg>
              <p className="attribute">{i18next.t('ui/object.SendToBack')}</p>
            </div>

            <div className ="order-div">
              <svg onClick={this.props.bringForward} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
                <path d={ObjectIcon.bringForward}/>
              </svg>
              <p className="attribute">{i18next.t('ui/object.BringForward')}</p>
            </div>

            <div className ="order-div">
              <svg onClick={this.props.sendBackwards} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
                <path d={ObjectIcon.sendBackwards}/>
              </svg>
              <p className="attribute">{i18next.t('ui/object.SendBackwards')}</p>
            </div>
          </div>
          <div className="flip-delete">
            <div className="obj-flip">
              <div className="option-title">{i18next.t('ui/object.Flip')}</div>
              <div className="flip-button">
                <div className="flip-div">
                  <svg onClick={this.flipObject} flip="X" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
                    <path flip="X" d={ObjectIcon.flipX} overflow="visible" fontFamily="Bitstream Vera Sans" />
                  </svg>
                  <p className="attribute">{i18next.t('ui/object.Flip x')}</p>
                </div>
                <div className="flip-div">
                  <svg onClick={this.flipObject} flip="Y" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
                    <path flip="Y" d={ObjectIcon.flipY} overflow="visible" fontFamily="Bitstream Vera Sans" />
                  </svg>
                  <p className="attribute">{i18next.t('ui/object.Flip y')}</p>
                </div>
              </div>
            </div>
            <div className="obj-delete">
              <div className="option-title">{i18next.t('ui/object.Delete')}</div>
              <div className="delete-button">
                <div className="delete-div">
                  <svg onClick={this.props.deleteObject} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
                    <path d={ObjectIcon.deleteObject}/>
                  </svg>
                  <p className="attribute">{i18next.t('ui/object.Delete')}</p>
                </div>
                <div className="delete-div">
                  <svg onClick={this.props.deleteAllObject} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
                    <path d={ObjectIcon.deleteAllObject}/>
                  </svg>
                  <p className="attribute">{i18next.t('ui/object.Deleteall')}</p>
                </div>


              </div>
            </div>
          </div>
          <div className="option-title">{i18next.t('ui/object.Group')}</div>
          <div className="obj-group">
            <div className="group-div">
              <svg onClick={this.props.makeGroup} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
                <path d={ObjectIcon.makeGroup}/>
              </svg>
              <p className="attribute">{i18next.t('ui/object.Group')}</p>
            </div>
            <div className="group-div">
              <svg onClick={this.props.unGroup} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
                <path d={ObjectIcon.unGroup}/>
              </svg>
              <p className="attribute">{i18next.t('ui/object.Ungroup')}</p>
            </div>


          </div>
          <div className="option-title">{i18next.t('ui/object.Change Scale')}</div>
          <div className="obj-zoom">
            <div className="zoom-box">
              <div className="keep-ratio">
                <label className="mycheckbox path">
                  <input type="checkbox" id="lockScale" onClick={this.props.lockScaleRatio} disabled={this.props.object.type === 'not active' ? true : false} />
                  <svg viewBox="0 0 21 21">
                    <path d={ObjectIcon.checkbox}></path>
                  </svg>
                </label>
                <div>{i18next.t('ui/object.Lock Ratio')}</div>
              </div>
              <input
                type='range'
                name='scaleX'
                min='1'
                max='200'
                step='1'
                disabled={this.props.object.type === 'not active' || this.props.object.type === 'path' ? true : false}
                value={this.props.object.scaleX * 100}
                onChange={this.handleScaleXChange}
              />
              {this.props.object.type === 'not active' || this.props.object.type === 'path' ? 
              null : <div><label>X : {this.props.object.scaleX * 100}%</label></div>}
              
              <input
                type='range'
                name='scaleY'
                min='1'
                max='200'
                step='1'
                disabled={this.props.object.type === 'not active' || this.props.object.type === 'path' ? true : false}
                value={this.props.object.scaleY * 100}
                onChange={this.handleScaleYChange}
              />
              {this.props.object.type === 'not active' || this.props.object.type === 'path' ? 
              null : <div><label>Y : {this.props.object.scaleY * 100}%</label></div>}
            </div>
          </div>
        </div>
      </div>
    );
  }
})