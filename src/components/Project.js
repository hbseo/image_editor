import React, { Component } from 'react';
import {fabric} from 'fabric';
class Project extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      projects : [],
    }
    this.canvas = null;
  }

  componentDidMount(){
    this.initCanvas();
  }

  getProjects = () => {
    fetch('/content/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id : this.props.id, count : 10})
    })
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      this.setState({projects : data});
    })
    .catch(() => {
      alert('error');
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
  }
  fromJsontoPng = (json, idx) => {
    this.canvas.loadFromJSON(json, () => {
      // this.canvas.renderAll();
      // console.log(this.canvas.backgroundImage); // 밖에다 두면 backgrounImage를 null로 인식함... 이유? 콜백함수라서 img 태그가 다 load되고 나서 불러와지기 때문
      document.getElementById(idx).src = this.canvas.toDataURL({format : 'png'});
      ;
    })
    return '';
  }


  showProjects = () => {
    if(this.props.login){

      const listitem = this.state.projects.map((prj) =>
        <div key={prj.idx}>
          <p>{prj.title}</p>
          <img id={prj.idx} src = {this.fromJsontoPng(prj.project_data, prj.idx)} width="auto" height="300px" alt="none"/>
        </div>
      );
      return(
        <div>
            {this.props.id} 유저
            <hr/>
            {listitem}  
        </div>
      );
    }
    else{
      return(<div>no login</div>)
    }
  }
 
  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          프로젝트 title : <input name="search" value={this.state.search} onChange={this.handleSearchChange} />
          <input type="submit" value="Submit" />
        </form>
        <p>검색어 : {this.state.search}</p>
        <hr/>
        <h4>프로젝트</h4>
        {this.showProjects()}
      </div>
    )
  }
}
export default Project