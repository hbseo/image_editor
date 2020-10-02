
import React, { Component } from 'react';
import { DropdownButton, Dropdown } from 'react-bootstrap';

export default class FilterMenu extends Component {
  selectFilter = (event) => {
    this.props.onClick(event)
  }
  render() {
    return (
      <DropdownButton id="dropdown-basic-button" title="Filter">
        <Dropdown.Item>
          <label>
            <input type="checkbox" onClick={this.filterObject} filter="grey" /><span>grey</span>
          </label>
        </Dropdown.Item>

        Filter grey
        <input type="checkbox" onClick={this.filterObject} filter="vintage" />Filter vintage
        {/* <Dropdown.Item onClick = {this.selectFilter} filter = "grey" checked="false">grey</Dropdown.Item> */}
        {/* <Dropdown.Item onClick = {this.selectFilter} filter = "vintage"  checked="false">vintage</Dropdown.Item> */}
      </DropdownButton>
    )
  }

}