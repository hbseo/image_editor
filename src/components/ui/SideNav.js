import React from 'react';
import i18next from "../../locale/i18n";
import { withTranslation } from "react-i18next";

export default withTranslation()(function SideNav(props) {
  return (
    <nav>
      <ul className="menu">
        <li>
          <button className="nav-bar-button" type="button" onClick={props.changeTab} alt="text" tab="0">{i18next.t('ui/sidenav.Text')}</button>
        </li>
        <li>
          <button className="nav-bar-button" type="button" onClick={props.changeTab} alt="imageEdit" tab="1">{i18next.t('ui/sidenav.Image')}</button>
        </li>
        <li>
          <button className="nav-bar-button" type="button" onClick={props.changeTab} alt="filter" tab="2">{i18next.t('ui/sidenav.Filter')}</button>
        </li>
        <li>
        <button className="nav-bar-button" type="button" onClick={props.changeTab} alt="icon" tab="3">{i18next.t('ui/sidenav.Icon')}</button>
        </li>
        <li>
          <button className="nav-bar-button" type="button" onClick={props.changeTab} alt="object" tab="4">{i18next.t('ui/sidenav.Object')}</button>
        </li>
        <li>
          <button className="nav-bar-button" type="button" onClick={props.changeTab} alt="rotate" tab="5">{i18next.t('ui/sidenav.Rotate')}</button>
        </li>
        <li>
          <button className="nav-bar-button" type="button" onClick={props.changeTab} alt="shape" tab="6">{i18next.t('ui/sidenav.Shape')}</button>
        </li>
        <li>
          <button className="nav-bar-button" type="button" onClick={props.changeTab} alt="draw" tab="7">{i18next.t('ui/sidenav.Draw')}</button>
        </li>
        <li>
          <button className="nav-bar-button" type="button" onClick={props.changeTab} alt="others" tab="8">{i18next.t('ui/sidenav.Others')}</button>
        </li>
        <li>
          <button className="nav-bar-button" type="button" onClick={props.changeTab} alt="canvas" tab="9">{i18next.t('ui/sidenav.Canvas')}</button>
        </li>
        <li>
          <button className="nav-bar-button" type="button" onClick={props.changeTab} alt="effect" tab="10">{i18next.t('ui/sidenav.Effect')}</button>
        </li>
        <li>
          <button className="nav-bar-button" type="button" onClick={props.changeTab} alt="close" tab="99">{i18next.t('ui/sidenav.Close')}</button>
        </li>
      </ul>
      {props.UI[props.tab]}
    </nav>
  );
})
