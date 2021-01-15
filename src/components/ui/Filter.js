import React from 'react';
import './Filter.scss'
export default function Filter({filter}) {
  return (
    <div className="sub">
      <div className="sub-title">
          Filters
      </div>
      <div className="sub-filters">
        <div>
          <input type='checkbox' id="filter-vintage" className='filter' onClick={filter} filter='vintage'/><label htmlFor="filter-vintage">Filter vintage</label>
        </div>
        <div>
          <input type='checkbox' id="filter-sepia" className='filter' onClick={filter} filter='sepia'/><label htmlFor="filter-sepia">Filter Sepia</label>
        </div>
        <div>
          <input type='checkbox' id="filter-polaroid" className='filter' onClick={filter} filter='polaroid'/><label htmlFor="filter-polaroid">Filter Sepia</label>
        </div>
      </div>
    </div>
  );
}