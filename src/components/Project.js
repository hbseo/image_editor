import React, { Component } from 'react';
import {fabric} from 'fabric';
import { Link } from 'react-router-dom';
import i18next from "../locale/i18n";
import { withTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import '../css/Project.scss';

class Project extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      projects : [],
      project_length : 20,
      scroll: true,
      sort : 0, 
      last : '', // 마지막으로 로드 된 데이터
    }
    this.canvas = null;
    this.limit = 20;
    this.offset = 0;
  }

  componentDidMount(){
    this.initCanvas();
  }

  getProjects = () => {
    if(this.props.id === '') { return; }
    fetch('/content/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id : this.props.id, 
        search : this.state.search,
        limit : this.limit,
        offset : this.offset,
        sort : this.state.sort,
        last : this.state.sort > 1 ? this.state.last.create_date : this.state.last.title
      })
    })
    .then((res) => res.json())
    .then((data) => {
      if(data.success){
        if(data.result.length === 0) {
          this.setState({scroll: false});
          return;
        }
        this.offset = data.result[data.result.length - 1].idx;
        let projects = this.state.projects.concat(data.result);
        this.setState({projects : projects, project_length: projects.length, last : data.result[data.result.length - 1]});
      }
      else{
        alert(i18next.t('Project.Error'));
      }
    })
    .catch(() => {
      alert(i18next.t('Project.Error'));
    })
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.getProjects();
  }

  handleSearchChange = (event) => {
    let change_state = {};
    change_state[event.target.name] = event.target.value;
    this.setState(change_state);
  }

  initCanvas = () => {
    this.canvas = new fabric.Canvas('c');
    this.getProjects();
  }

  fromJsontoPng = (json, idx) => {
    this.canvas.loadFromJSON(json, () => {
      // this.canvas.renderAll();
      // console.log(idx , document.getElementById(idx))
      // console.log(this.canvas.backgroundImage); // 밖에다 두면 backgrounImage를 null로 인식함... 이유? 콜백함수라서 img 태그가 다 load되고 나서 불러와지기 때문
      if(document.getElementById(idx)){
        document.getElementById(idx).src = this.canvas.toDataURL({format : 'png'});
        this.canvas.clear();
      }
    })
    return this.canvas.toDataURL({format : 'png'});
  }

  // showProjects = () => {
  //   if(this.props.login){
  //     let listitem = null;
  //     if(this.state.projects.length > 0) {
  //       listitem = this.state.projects.map((prj) =>
  //         <div className="project-div" key={prj.idx}>
  //           <div className="project-img">
  //             <Link 
  //             to={{
  //               pathname: '/edit',
  //               save : true,
  //               project_data : prj.project_data,
  //               project_idx : prj.idx,
  //               state: {
  //                 width: 500,
  //                 height: 400,
  //               }
  //             }}><img className="project-thumb" id={prj.idx} src = {this.fromJsontoPng(prj.project_data, prj.idx)} width="auto" height="200px" alt="none" onClick = {this.openProject}/>
  //             </Link>
  //           </div>
  //           <div className="project-title">
  //             <p>{prj.title}</p>
  //             {/* <p> {prj.create_date} </p> */}
  //             <button idx= {prj.idx} delete="one" onClick={this.checkDelete}>X</button>
  //           </div>
  //         </div>
  //       );
  //     }
  //     this.setState({project_list : listitem})
  //     // return(
  //     //   <div id="project-list">
  //     //     {listitem}  
  //     //   </div>
  //     // );
  //   }
  //   else{
  //     // return(
  //     //   <div id="project-list">
  //     //     <div className="project-div">
  //     //       {i18next.t('Project.PlzSignin')}
  //     //     </div>
  //     //   </div>
  //     // )
  //   }
  // }

  deleteProject = (event) => {
    let idx = event.target.getAttribute('idx');
    if(this.props.id === '' || isNaN(idx)) { return; }

    fetch('/content/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id : this.props.id, prj_idx : idx})
    })
    .then((res) => res.json())
    .then((data) => {
      if(data.success){
        let index = this.state.projects.findIndex((element) => {
          if(Number(element.idx) === Number(idx)) return 1;
        });
        this.state.projects.splice(index, 1);
        let bool = this.state.projects.length === 0 ? false : true;
        this.setState({project_length: this.state.projects.length, scroll: bool});
      }
      else{
        alert(i18next.t('Project.Error'));
      }
    })
    .catch(() => {
      alert(i18next.t('Project.Error'));
    })
  }

  deleteAllProjects = () => {
    if(this.props.id === '') { return; }
    fetch('/content/deleteall', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id : this.props.id})
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if(data.success){
        this.setState({projects: [], project_length: 0, scroll:false});
      }
      else{
        alert(i18next.t('Project.Error'));
      }
    })
    .catch(() => {
      alert(i18next.t('Project.Error'));
    })
  }

  checkDelete = (event) => {

    let option = event.target.getAttribute('delete');
    let delete_check;

    if( option === 'all'){
      delete_check= window.confirm(i18next.t('Project.Deleteallcheck'));
      if(delete_check){
        this.deleteAllProjects();
      }
      // else{
      //   alert(i18next.t('Project.Cancel'))
      // }
    }
    else{
      delete_check= window.confirm(i18next.t('Project.Deletecheck'));
      if(delete_check){
        this.deleteProject(event);
      }
      // else{
      //   alert(i18next.t('Project.Cancel'))
      // }
    }
  }

  projectSort = (event) => {
    let option = event.target.getAttribute('option');

    // if(option === '0') {
    //   this.setState({projects : this.state.projects.sort((o1, o2) => {
    //     return o1.title > o2.title ? 1 : -1;
    //   })});
    // }
    // else if(option === '1') {
    //   this.setState({projects: this.state.projects.sort((o1, o2) => {
    //     return o2.title > o1.title ? 1 : -1;
    //   })});
    // }
    // else if(option === '2') {
    //   this.setState({projects: this.state.projects.sort((o1, o2) => {
    //     return o1.create_date > o2.create_date ? 1 : -1;
    //   })});
    // }
    // else if(option === '3') {
    //   this.setState({projects: this.state.projects.sort((o1, o2) => {
    //     return o2.create_date > o1.create_date ? 1 : -1;
    //   })});
    // }

    new Promise((resolve, reject) => {
      let past_option = this.state.sort;

      if(option >=0 && option <= 3){
        if(past_option != option){
          this.setState({sort : parseInt(option), last : '', projects : [], scroll: true });
          this.offset = 0;
        }
        else{
          this.setState({sort : parseInt(option)});
        }
        resolve();
      }
      else{
        reject();
      }
    })
    .then(() => this.getProjects())
    .catch((err) => { alert(err); })
    
  }

  render() {
    return (
      <div>
        {/* <p>{this.state.last.title} {this.state.last.create_date}</p> */}
        <h2>{i18next.t('Project.Project')}</h2>
        <button delete = "all" onClick={this.checkDelete}><i delete = "all" className="fas fa-times-circle fa-4x"></i></button>
        <button className = "proejct-sort-button" option = "0" onClick= {this.projectSort}> {i18next.t('Project.Title')} 오름 </button>
        <button className = "proejct-sort-button" option = "1" onClick= {this.projectSort}> {i18next.t('Project.Title')} 내림 </button>
        <button className = "proejct-sort-button" option = "2" onClick= {this.projectSort}> {i18next.t('Project.Date')} 오름 </button>
        <button className = "proejct-sort-button" option = "3" onClick= {this.projectSort}> {i18next.t('Project.Date')} 내림 </button>
        <div className="project-search">
          <div className="project-search-form">
            <form onSubmit={this.handleSubmit}>
              {i18next.t('Project.Title')} <input name="search" value={this.state.search} onChange={this.handleSearchChange} />
              <input type="submit" value="Submit" />
            </form>
          </div>
          {/* <div>
            {this.props.id} {i18next.t('Project.User')}
            <p className="project-search-data">{i18next.t('Project.Search')} : {this.state.search}</p>
          </div> */}
        </div>
        <div id="project-list" style={{overflow:"auto", height:500}}>
          <InfiniteScroll 
            dataLength={this.state.project_length}
            next={this.getProjects}
            hasMore={this.state.scroll}
            loader={<h4>Loading...</h4>}
            scrollableTarget="project-list">
            {this.state.projects.map((prj) =>
              <div className="project-div" key={prj.idx}>
                <div className="project-img">
                  <Link 
                  to={{
                    pathname: '/edit',
                    save : true,
                    project_data : prj.project_data,
                    project_idx : prj.idx,
                    state: {
                      width: 500,
                      height: 400,
                    }
                  }}><img className="project-thumb" id={prj.idx} src = {this.fromJsontoPng(prj.project_data, prj.idx)} width="auto" height="200px" alt="none" onClick = {this.openProject}/>
                  </Link>
                </div>
                <div className="project-title">
                  <p>{prj.title}</p>
                  {/* <p> {prj.create_date} </p> */}
                  <button idx= {prj.idx} delete="one" onClick={this.checkDelete}>X</button>
                </div>
              </div>
            )}
          </InfiniteScroll>
        </div>
      </div>
    )
  }
}

export default withTranslation()(Project);