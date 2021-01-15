import React from 'react';
import Filter from './Filter';
export default function SideNav(props) {
  return (
    <nav>
      <ul className="menu">
        <li>
          <a><img src="image/text.svg" alt="text" /></a>
          <span className="tooltip">Text</span>
        </li>
        <li>
          <a><img src="image/image-edit.svg" alt="image-edit"/></a>
          <span className="tooltip">Image</span>
        </li>
        <li>
          <a><img src="image/filter.svg" alt="filter"/></a>
          <span className="tooltip">Filters</span>
        </li>
        <li>
          <a><img src="image/shape.svg" alt="shape"/></a>
          <span className="tooltip">Shape</span>
        </li>
        <li>
          <a><img src="image/drawing.svg" alt="drawing"/></a>
          <span className="tooltip">Drawing</span>
        </li>
      </ul>
      <Filter filter={props.filter}/>
    </nav>
  );
}