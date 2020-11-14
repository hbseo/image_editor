import React, { Component } from 'react';

class ImageList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      images: [],
      search: '',
      image_count: 1,
      url: ''
    }
  }

  getRandomImage() {
    var url = new URL("https://api.unsplash.com/photos/random");
    var params = {
      client_id: 'ua3Yx_zNDTdYyxlcX5JaO-KoZs4ri2-xZXZqc7_rcp0',
      count: 10
    }
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    fetch(url, {
      method: 'get',
    })
      .then(res => res.json())
      // .then(res=>console.log(res))
      .then(res => this.setState({ images: res }))
      .catch((error) => {
        console.log("error : ", error);
      });
  }

  getImage() {
    console.log("getimage", this.state.search,);
    var url = new URL("https://api.unsplash.com/photos/random");
    var params = {
      client_id: 'ua3Yx_zNDTdYyxlcX5JaO-KoZs4ri2-xZXZqc7_rcp0',
      count: this.state.image_count,
      query: this.state.search
    }
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    fetch(url, {
      method: 'get',
    })
      .then(res => res.json())
      // .then(res=>console.log(res))
      .then(res => this.setState({ images: res }))
      .catch((error) => {
        console.log("error : ", error);
      });
  }

  handleSubmit = (event) => {
    // console.log("submit", this.state.search);
    event.preventDefault();
    this.getImage();
  }
  searchChange = (event) => {
    // console.log(event.target.value);
    // this.setState({ search : event.target.value});
    let change_state = {};
    change_state[event.target.name] = event.target.value;
    // console.log(event.target.name, event.target.value, change_state);
    this.setState(change_state);
  }

  showImage = (imagelist) => {
    // console.log('show image', imagelist)
    const listitem = imagelist.map((image) =>

      <img key={image.id} src={image.urls.thumb} alt="." onClick={this.onClickImg} />

      // ursl뒤에 raw, small, regular, full 등의 따라 사이즈 조절
    );

    return (
      // <div>me</div>
      <div id="image-list">{listitem}</div>
    )
  }

  onClickImg = (event) => {
    // console.log(event.target.src);
    this.props.onClick(event.target.src);
  }



  render() {

    return (
      <div>
        <button onClick={() => this.getRandomImage()}>get a random image 10 count</button>

        <form onSubmit={this.handleSubmit}>

          이미지 이름 : <input name="search" value={this.state.search} onChange={this.searchChange} />
                숫자 : <input type="number" name="image_count" value={this.state.image_count} onChange={this.searchChange} />

          <input type="submit" value="Submit" />

        </form>
        <p>검색어 : {this.state.search}</p>
        <p>이미지 수 : {this.state.image_count}</p>

        {this.showImage(this.state.images)}
      </div>
    )
  }
}
export default ImageList