import React from 'react';

export default function SideNav(props) {
  return (
    <nav>
      <ul className="menu">
        <li>
          <button className="nav-bar-button" type="button" onClick={props.changeTab} alt="text" tab="0">Text</button>
        </li>
        <li>
          <button className="nav-bar-button" type="button" onClick={props.changeTab} alt="imageEdit" tab="1">Image</button>
        </li>
        <li>
          <button className="nav-bar-button" type="button" onClick={props.changeTab} alt="filter" tab="2">Filter</button>
        </li>
        <li>
        <button className="nav-bar-button" type="button" onClick={props.changeTab} alt="icon" tab="3">Icon</button>
        </li>
        <li>
          <button className="nav-bar-button" type="button" onClick={props.changeTab} alt="object" tab="4">Object</button>
        </li>
        <li>
          <button className="nav-bar-button" type="button" onClick={props.changeTab} alt="rotate" tab="5">Rotate</button>
        </li>
        <li>
          <button className="nav-bar-button" type="button" onClick={props.changeTab} alt="shape" tab="6">Shape</button>
        </li>
        <li>
          <button className="nav-bar-button" type="button" onClick={props.changeTab} alt="draw" tab="7">Draw</button>
        </li>
        <li>
          <button className="nav-bar-button" type="button" onClick={props.changeTab} alt="others" tab="8">Others</button>
        </li>
        <li>
          <button className="nav-bar-button" type="button" onClick={props.changeTab} alt="canvas" tab="9">Canvas</button>
        </li>
        <li>
          <button className="nav-bar-button" type="button" onClick={props.changeTab} alt="effect" tab="10">Effect</button>
        </li>
        <li>
          <button className="nav-bar-button" type="button" onClick={props.changeTab} alt="close" tab="99">Close</button>
        </li>
      </ul>
      {props.UI[props.tab]}
    </nav>
  );
}
