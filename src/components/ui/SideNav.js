import React from 'react';

export default function SideNav(props) {
  return (
    <nav>
      <ul className="menu">
        <li>
          <button className="nav-bar-button" type="button" onClick={props.changeTab}><img src="image/text.svg" alt="text" tab="0"/></button>
          <span className="tooltip">Text</span>
        </li>
        <li>
          <button className="nav-bar-button" type="button" onClick={props.changeTab}><img src="image/image-edit.svg" alt="imageEdit" tab="1"/></button>
          <span className="tooltip">Image</span>
        </li>
        <li>
          <button className="nav-bar-button" type="button" onClick={props.changeTab}><img src="image/filter.svg" alt="filter" tab="2" /></button>
          <span className="tooltip">Filters</span>
        </li>
        <li>
        <button className="nav-bar-button" type="button" onClick={props.changeTab}><span style={{color : '#a79e98'}} ><i className="fas fa-icons fa-4x" tab="3"></i></span></button>
          <span className="tooltip">Icon</span>
        </li>
        <li>
          <button className="nav-bar-button" type="button" onClick={props.changeTab}><span style={{color : '#a79e98'}} ><i className="fas fa-vector-square fa-4x" tab="4"></i></span></button>
          <span className="tooltip">Object</span>
        </li>
        <li>
          <button className="nav-bar-button" type="button" onClick={props.changeTab}><span style={{color : '#a79e98'}} ><i className="fas fa-sync-alt fa-4x" tab="5"></i></span></button>
          <span className="tooltip">Rotation</span>
        </li>
        <li>
          <button className="nav-bar-button" type="button" onClick={props.changeTab}><img src="image/shape.svg" alt="Shape" tab="6" /></button>
          <span className="tooltip">Shape</span>
        </li>
        <li>
          <button className="nav-bar-button" type="button" onClick={props.changeTab}><img src="image/drawing.svg" alt="draw" tab="7" /></button>
          <span className="tooltip">Drawing</span>
        </li>
        <li>
          <button className="nav-bar-button" type="button" onClick={props.changeTab}><span style={{color : '#a79e98'}} ><i className="fas fa-tools fa-4x" tab="8"></i></span></button>
          <span className="tooltip">Tools</span>
        </li>
        <li>
          <button className="nav-bar-button" type="button" onClick={props.changeTab}><span style={{color : '#a79e98'}} ><i className="fas fa-times fa-4x" tab="99"></i></span></button>
          <span className="tooltip">Close</span>
        </li>
      </ul>
      {props.UI[props.tab]}
    </nav>
  );
}
