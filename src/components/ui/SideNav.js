import React from 'react';
import FilterUI from './Filter';
import ImageUI from './Image';
import ToolsUI from './Tools';
import ShapeUI from './Shape';
import TextUI from './Text';
import ObjectUI from './Object';

export default function SideNav(props) {
  // const tab = {
  //   0: <Text object = {props.object} textObject={props.textObject} addText = {props.addText}/>,
  //   1: <Image object = {props.object}/>,
  //   2: <Filter object = {props.object} filter={props.filter}/>,
  //   3: <Shape object={props.object} addIcon = {props.addIcon}/>,
  //   4: props.objectab,
  //   5: <Tools addImage={props.addImage} objectInfo = {props.objectInfo}/>,
  // };
  return (
    <nav>
      <ul className="menu">
        <li>
          <button className="nav-bar-button" type="button" onClick={props.changeTab}><img src="image/text.svg" alt="text" tab="0"/></button>
          <span className="tooltip">Text</span>
        </li>
        <li>
          <button className="nav-bar-button" type="button" onClick={props.changeTab}><img src="image/image-edit.svg" alt="image-edit" tab="1"/></button>
          <span className="tooltip">Image</span>
        </li>
        <li>
          <button className="nav-bar-button" type="button" onClick={props.changeTab}><img src="image/filter.svg" alt="filter" tab="2" /></button>
          <span className="tooltip">Filters</span>
        </li>
        <li>
          <button className="nav-bar-button" type="button" onClick={props.changeTab}><img src="image/shape.svg" alt="shape" tab="3" /></button>
          <span className="tooltip">Shape</span>
        </li>
        <li>
          <button className="nav-bar-button" type="button" onClick={props.changeTab}><span style={{color : '#a79e98'}} ><i className="fas fa-vector-square fa-4x" tab="4"></i></span></button>
          <span className="tooltip">Object</span>
        </li>
        {/* <li>
          <button className="nav-bar-button" disabled type="button" onClick={props.changeTab}><img src="image/drawing.svg" alt="filter" tab="0" /></button>
          <span className="tooltip">Drawing</span>
        </li> */}
        <li>
          <button className="nav-bar-button" type="button" onClick={props.changeTab}><span style={{color : '#a79e98'}} ><i className="fas fa-tools fa-4x" tab="5"></i></span></button>
          <span className="tooltip">Tools</span>
        </li>
      </ul>
      {props.UI[props.tab]}
    </nav>
  );
}
