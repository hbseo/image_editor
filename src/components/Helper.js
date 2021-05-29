import React, { Component } from 'react';
import { withTranslation } from "react-i18next";
import { Link, Route } from 'react-router-dom';
import {FilterHelp, ImageCutHelp, GetStarted, DrawPolygon} from './HelperPages';
import '../css/Helper.scss';

class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      tab : 0
    }

  }

  render(){
    const { match } = this.props;
    return(
      <div className="helper-div">
        <div className="top-div">
          How to Use
        </div>
        <div className="container">
          <div className="side-nav">
            <ul className="subject">
              <a className="return-home" href="/">←</a>
            </ul>
            <ul className="subject">
              <li className="topic"><Link to= {`${match.url}`}>Home</Link></li>
            </ul>
            <ul className="subject">
              <li className="topic">Text</li>
              <li className="sub-topic">텍스트 할거 있나?</li>
            </ul>
            <ul className="subject">
              <li className="topic">Filter</li>
              <li><Link to= {`${match.url}/filterhelp`}>필터 적용</Link></li>
            </ul>
            <ul className="subject">
              <li className="topic">Image</li>
              <li><Link to= {`${match.url}/imagecut`}>Cut</Link></li>
            </ul>
            <ul className="subject">
              <li className="topic">Polygon</li>
              <li><Link to= {`${match.url}/drawpolygon`}>Drawing a Polygon</Link></li>
            </ul>
            
          </div>
          <div className="main">
            <Route path={`${match.url}/:sub`} component={GoHelper}/>
            <Route exact path={match.url} render={GetStarted}/>  
          </div>
        </div>
        
        <footer>
          <ul>
            <li><a href="https://github.com/hbseo/image_editor">Github</a></li>
            <li><a href="https://trello.com/b/INAP59Dv/image-editor">Trello</a></li>
            <li><a href="/helper">Helper</a></li>
            <li><a href="https://www.hanyang.ac.kr/web/eng/erica-campus1">Hanyang Erica</a></li>
          </ul>
          <p>Hanyang</p>
        </footer>        
      </div>
    )
  }
}

function GoHelper({match}) {
  const sub = match.params.sub

  switch(sub){
    case 'filterhelp':
      return FilterHelp();
    case 'imagecut':
      return ImageCutHelp();
    case 'drawpolygon':
      return DrawPolygon();
    default:
      return <h2>존재하지 않는 페이지입니다</h2>

  }
}
export default withTranslation()(Home);