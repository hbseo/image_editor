import React, { Component } from 'react';

class ImageList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      random_count : 0,
      images: [],
      search: '',
      image_count: 1,
      url: '',
      image : {
        full : '',
        raw : '',
        regular : '',
        small : '',
        thumb : ''
      },
      imageSize : {
        full : { x:0, y:0},
        raw : { x:0, y:0},
        regular : { x:0, y:0},
        small : { x:0, y:0},
        thumb : { x:0, y:0},

      }
    }
  }

  getRandomImage() {
    var url = new URL("https://api.unsplash.com/photos/random");
    var params = {
      client_id: 'ua3Yx_zNDTdYyxlcX5JaO-KoZs4ri2-xZXZqc7_rcp0',
      count: this.state.random_count
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
      .then(res => this.setState({ images: res }))
      .catch((error) => {
        console.log("error : ", error);
        alert('fail');
      });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.getImage();
  }
  searchChange = (event) => {
    let change_state = {};
    change_state[event.target.name] = event.target.value;
    this.setState(change_state);
  }

  showImage = (imagelist) => {
    const listitem = imagelist.map((image) =>

      <img key={image.id} src={image.urls.thumb} alt="." onClick={ this.onClickThumb } full = {image.urls.full} raw = {image.urls.raw} regular = {image.urls.regular} small = {image.urls.small}/>

      // ursl뒤에 raw, small, regular, full 등의 따라 사이즈 조절
    );

    return (
      <div id="image-list">{listitem}</div>
    )
  }

  onClickThumb = (event) => {
    new Promise((resolve) => {
      this.setState({
        image : {
          full : event.target.getAttribute('full'),
          raw : event.target.getAttribute('raw'),
          regular : event.target.getAttribute('regular'),
          small : event.target.getAttribute('small'),   
          thumb : event.target.src     
      }})
      resolve();
    })
    .then(() => {
      this.getImageSize();
    })

  }

  onClickImg = (event) => {
    this.props.onClick(event.target.getAttribute('url'));
  }

  handleSubmit = (event) => {
		if(event){ event.preventDefault(); }
    this.getImage();
	}

	imageNotFound = () => {

  }
  
	imageFound = (img) => {
    console.log()
  }
  
  getImageSize = () => {
    let full_img = new Image();
    full_img.onload = () => {
      this.setState({
        imageSize : {
          full : { x: full_img.width, y: full_img.height},
          small : { x : 400, y: Math.round(full_img.height * (400 / full_img.width)) },
          thumb : { x : 200, y: Math.round(full_img.height * (200 / full_img.width)) },
          regular : { x : 1080, y: Math.round(full_img.height * (1080 / full_img.width)) },
        }
      })
    };
    full_img.onerror = this.imageNotFound;
    full_img.src = this.state.image.full;
  }

  imageSizeVersion = () => {
    let image = this.state.image;

    if(!image){
      return(
        <div id="image-list-size-none">
          <p>no img</p>
        </div>
      )
    }
    else{
      return (
        <div id="image-list-size">
          <ul>
            <li style = {{ float : 'left'  }}>
              full : {this.state.imageSize.full.x} X  {this.state.imageSize.full.y}
              <img src = {image.thumb} url={image.full} alt="." onClick={this.onClickImg}  />
            </li>
            {/* <li>
              <img src = {image.thumb} url={image.raw} alt="." onClick={this.onClickImg}  />
            </li> */}
            <li style = {{ float : 'left'  }}>
              regular : {this.state.imageSize.regular.x} X  {this.state.imageSize.regular.y}
              <img src = {image.thumb} url={image.regular} alt="." onClick={this.onClickImg}  />
            </li>
            <li style = {{ float : 'left'  }}>
              small : {this.state.imageSize.small.x} X {this.state.imageSize.small.y}
              <img src = {image.thumb} url={image.small} alt="." onClick={this.onClickImg}  />
            </li>
            <li style = {{ float : 'left'  }}>
              thumb : {this.state.imageSize.thumb.x} X {this.state.imageSize.thumb.y}
              <img src = {image.thumb} url={image.thumb} alt="." onClick={this.onClickImg}  />
            </li>
          </ul>
        </div>
      )
    }
  }

  randomCountChange = (event) => {
    let change_state = {};
    change_state[event.target.name] = event.target.value;
    this.setState(change_state);
  }

  render() {
    return (
      <div className='main'>
        <input type="number" name = "random_count" value={this.state.random_count} onChange = {this.randomCountChange}></input>
        <button onClick={() => this.getRandomImage()}>get a random image 10 count</button>
        <form onSubmit={this.handleSubmit}>

          이미지 이름 : <input name="search" value={this.state.search} onChange={this.searchChange} />
          숫자 : <input type="number" name="image_count" value={this.state.image_count} onChange={this.searchChange} />

          <input type="submit" value="Submit" />

        </form>
        <p>검색어 : {this.state.search}</p>
        <p>이미지 수 : {this.state.image_count}</p>

        {this.showImage(this.state.images)}
        <p>아래는 선택한 이미지 크기</p>
        { this.imageSizeVersion() }
        {this.props.children}

      </div>
    )
  }
}
export default ImageList