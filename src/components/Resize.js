function shapeScalingResizeEvent(canvas, pointer, obj){
  // let width = obj.scaleX * obj.width
  // let height = obj.scaleY * obj.height
  // const startPoint = obj.aCoords.tl;
  // obj.set({
  //   width : width,
  //   height : height,
  //   scaleX : 1,
  //   scaleY : 1,
  //   left : startPoint + width / 2,
  //   top : startPoint + height / 2,
  // })
  // console.log(obj.scaleY, obj.scaleY, pointer);
  
  // console.log(obj.scaleX, obj.scaleY);
  // if(activeObject.type === 'ellipse'){
  //   activeObject.set({
  //       rx : width /2 ,
  //       ry : height / 2,
  //       scaleX : 1,
  //       scaleY : 1,
  //   })
  // }
  // else if(activeObject.type === 'circle'){
  //   activeObject.set({
  //     radius : Math.max(width, height) / 2,
  //     scaleX : 1,
  //     scaleY : 1,
  //   })
  // }
  // else{
  //   activeObject.set({
  //     width : width,
  //     height :height,
  //     scaleX : 1,
  //     scaleY : 1,
  //   })
  // }
  canvas.renderAll();
  
}

module.exports = {

  
  resize(canvas, event, obj){
    const pointer = canvas.getPointer(event, false);
    shapeScalingResizeEvent(canvas, pointer, obj);
  }
}
