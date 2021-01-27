import { data } from "jquery";

export default function convertImage () {
  var imgObj = new Image();
  // imgObj.crossOrigin = 'Anonymous';
  // var res = imgObj.onload = function () {
  //   var tempCanvas = document.createElement('CANVAS');
  //   var tempCtx = tempCanvas.getContext('2d');
  //   var height = tempCanvas.height
  //   var width = tempCanvas.width
  //   tempCtx.drawImage(this, 0, 0);
  //   var dataURL = tempCanvas.toDataURL();
  //   console.log(dataURL);
  //   return dataURL;
  // };
  // imgObj.src = url;
  // return res;
  return imgObj;

  // new Promise ((resolve, reject) => {
  //   var imgObj = new Image();
  //   // imgObj.addEventListener('load', () => {
  //   //   var tempCanvas = document.createElement('CANVAS');
  //   //   var tempCtx = tempCanvas.getContext('2d');
  //   //   tempCtx.drawImage(this, 0, 0);
  //   //   var dataURL = tempCanvas.toDataURL();
  //   //   resolve(dataURL)
  //   // })
  //   console.log('qqqq');
  //   imgObj.onload = () => {
  //     console.log("onload");
  //     var tempCanvas = document.createElement('CANVAS');
  //     var tempCtx = tempCanvas.getContext('2d');
  //     tempCtx.drawImage(this, 0, 0);
  //     var dataURL = tempCanvas.toDataURL();
  //     resolve(dataURL);
  //   }
  // })
  // .then((url) => {
  //   console.log('asdf');
  //   // return 'ttt';
  // })
}
