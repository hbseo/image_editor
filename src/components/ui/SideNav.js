import React from 'react';
import Filter from './Filter';
import Image from './Image';
import Tools from './Tools';
import Text from './Text';

export default function SideNav(props) {
  const tab = {
    0: <Text/>,
    1: <Image/>,
    2: <Filter filter={props.filter}/>,
    3: <Tools addImage={props.addImage}/>,
  };
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
          <button className="nav-bar-button" type="button" onClick={props.changeTab}><img src="image/shape.svg" alt="filter" tab="1" /></button>
          <span className="tooltip">Shape</span>
        </li>
        <li>
          <button className="nav-bar-button" type="button" onClick={props.changeTab}><img src="image/drawing.svg" alt="filter" tab="0" /></button>
          <span className="tooltip">Drawing</span>
        </li>
        <li>
          <button className="nav-bar-button" type="button" onClick={props.changeTab}><span style={{color : '#a79e98'}} ><i className="fas fa-tools fa-4x" tab="3"></i></span></button>
          <span className="tooltip">Tools</span>
        </li>
      </ul>
      {tab[props.tab]}
    </nav>
  );
}
