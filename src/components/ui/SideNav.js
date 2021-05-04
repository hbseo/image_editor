import React from 'react';
import i18next from "../../locale/i18n";
import { withTranslation } from "react-i18next";

export default withTranslation()(function SideNav(props) {
  return (
    <nav>
      <ul className="menu">
        <li>
          <button className={props.tab === 0 ? "nav-bar-button-active" : "nav-bar-button"} style = {props.stylelang} type="button" onClick={props.changeTab} alt="text" tab="0">{i18next.t('ui/sidenav.Text')}</button>
        </li>
        <li>
          <button className={props.tab === 1 ? "nav-bar-button-active" : "nav-bar-button"} style = {props.stylelang} type="button" onClick={props.changeTab} alt="imageEdit" tab="1">{i18next.t('ui/sidenav.Image')}</button>
        </li>
        <li>
          <button className={props.tab === 2 ? "nav-bar-button-active" : "nav-bar-button"} style = {props.stylelang} type="button" onClick={props.changeTab} alt="filter" tab="2">{i18next.t('ui/sidenav.Filter')}</button>
        </li>
        <li>
        <button className={props.tab === 3 ? "nav-bar-button-active" : "nav-bar-button"} style = {props.stylelang} type="button" onClick={props.changeTab} alt="icon" tab="3">{i18next.t('ui/sidenav.Icon')}</button>
        </li>
        <li>
          <button className={props.tab === 4 ? "nav-bar-button-active" : "nav-bar-button"} style = {props.stylelang} type="button" onClick={props.changeTab} alt="object" tab="4">{i18next.t('ui/sidenav.Object')}</button>
        </li>
        <li>
          <button className={props.tab === 5 ? "nav-bar-button-active" : "nav-bar-button"} style = {props.stylelang} type="button" onClick={props.changeTab} alt="rotate" tab="5">{i18next.t('ui/sidenav.Rotate')}</button>
        </li>
        <li>
          <button className={props.tab === 6 ? "nav-bar-button-active" : "nav-bar-button"} style = {props.stylelang} type="button" onClick={props.changeTab} alt="shape" tab="6">{i18next.t('ui/sidenav.Shape')}</button>
        </li>
        <li>
          <button className={props.tab === 7 ? "nav-bar-button-active" : "nav-bar-button"} style = {props.stylelang} type="button" onClick={props.changeTab} alt="draw" tab="7">{i18next.t('ui/sidenav.Draw')}</button>
        </li>
        <li>
          <button className={props.tab === 9 ? "nav-bar-button-active" : "nav-bar-button"} style = {props.stylelang} type="button" onClick={props.changeTab} alt="canvas" tab="9">{i18next.t('ui/sidenav.Canvas')}</button>
        </li>
        <li>
          <button className={props.tab === 10 ? "nav-bar-button-active" : "nav-bar-button"} style = {props.stylelang} type="button" onClick={props.changeTab} alt="effect" tab="10">{i18next.t('ui/sidenav.Effect')}</button>
        </li>
        <li>
          <button className={props.tab === 99 ? "nav-bar-button-active" : "nav-bar-button"} style = {props.stylelang} type="button" onClick={props.changeTab} alt="close" tab="99">{i18next.t('ui/sidenav.Close')}</button>
        </li>
        <li>
          <button id = "hidden-menu" className={"nav-bar-button2"} style = { { display : 'none'}} type="button" onClick={props.changeTab} alt="others" tab="8">{i18next.t('ui/sidenav.Others')}</button>
        </li>
      </ul>
      {props.UI[props.tab]}
    </nav>
  );
})
