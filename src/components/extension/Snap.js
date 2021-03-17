import Extension from './Extension';
class Snap extends Extension {
  constructor(App) {
    super('Snap', App);
  }

  /**
   * "object:moving" canvas event handler
   * @param {{target: fabric.Object, e: MouseEvent, transform : object}} fEvent - Fabric event
   * @public
   */
  snapMovingEvent = (event) => {
    let direction = {
      x : event.e.movementX <= 0 ? 'left' : 'right',
      y : event.e.movementY <= 0 ? 'top' : 'bottom',
    }
    let left = Math.round(event.target.left / 10) * 10;
    let top =  Math.round(event.target.top / 10) * 10;
    event.target.set({
      left : left,
      top : top,
    })
    const pointer = event.target.getPointByOrigin(direction.x, direction.y);
    // const pointer = event.target.getPointByOrigin('left', 'top');
    event.target.set({
      left : left - pointer.x%10,
      top : top - pointer.y%10
    })
    event.target.setCoords();

    this.getImageEditor().setState({activeObject : this.getActiveObject()})

  }

  /**
   * On/off a SnapMovingEvent
   * @param {{target : input[type=checkbox]}} event 
   */
  onClickSnap = (event) => {
    const canvas = this.getCanvas();
    if(event.target.checked){
      canvas.on("object:moving", this.snapMovingEvent);
    }
    else{
      canvas.off("object:moving", this.snapMovingEvent);
    }
  }

  /**
   * "object:moving" canvas event handler
   * @param {{target: fabric.Object, e: MouseEvent}} fEvent - Fabric event
   * @public
   */
  snapObjectMovingEvent = (event) => {
    const canvas = this.getCanvas();
    event.target.setCoords();
    let target_top = Math.min(event.target.aCoords.tl.y, event.target.aCoords.tr.y, event.target.aCoords.br.y, event.target.aCoords.bl.y) ;
    let target_bottom =  Math.max(event.target.aCoords.tl.y, event.target.aCoords.tr.y, event.target.aCoords.br.y, event.target.aCoords.bl.y);
    let target_left = Math.min(event.target.aCoords.tl.x, event.target.aCoords.tr.x, event.target.aCoords.br.x, event.target.aCoords.bl.x);
    let target_right = Math.max(event.target.aCoords.tl.x, event.target.aCoords.tr.x, event.target.aCoords.br.x, event.target.aCoords.bl.x);
    canvas.forEachObject((obj) => {
      if(obj === event.target) {return;}
      
      obj.setCoords();
      let obj_top = Math.min(obj.aCoords.tl.y, obj.aCoords.tr.y, obj.aCoords.br.y, obj.aCoords.bl.y) ;
      let obj_bottom = Math.max(obj.aCoords.tl.y, obj.aCoords.tr.y, obj.aCoords.br.y, obj.aCoords.bl.y);
      let obj_right = Math.max(obj.aCoords.tl.x, obj.aCoords.tr.x, obj.aCoords.br.x, obj.aCoords.bl.x);
      let obj_left = Math.min(obj.aCoords.tl.x, obj.aCoords.tr.x, obj.aCoords.br.x, obj.aCoords.bl.x);

      //right
      if(Math.abs(obj_right - target_left) < 10){
        event.target.set({
          // left : obj.getPointByOrigin('right', 'bottom').x + (event.target.scaleX * event.target.width / 2) + (event.target.strokeWidth/2)
          // left : obj_right + (event.target.scaleX * event.target.width / 2) + (event.target.strokeWidth/2) ,
          // left : obj.getPointByOrigin('left', 'bottom').x + (obj.width * obj.scaleX) + (event.target.scaleX * event.target.width / 2)
          left : event.target.left + obj_right - target_left
        })
        // obj.setCoords();
        event.target.setCoords();
      }
      //left
      // console.log(obj.aCoords.tl.x - event.target.aCoords.tr.x);
      if(Math.abs(obj_left - target_right) < 10){
        event.target.set({
          // left : event.target.left - obj.left + 1,
          // left : obj.getPointByOrigin('left', 'bottom').x - (event.target.scaleX * event.target.width / 2) - (event.target.strokeWidth/2)
          // left : obj_left - (event.target.scaleX * event.target.width / 2) - (event.target.strokeWidth/2), 
          left : event.target.left + obj_left - target_right
        })
        event.target.setCoords();
      }
      // top
      if(Math.abs(obj_top - target_bottom) < 10){
        event.target.set({
          // top : obj.getPointByOrigin('right', 'top').y - (event.target.scaleY * event.target.height / 2) - (event.target.strokeWidth/2)
          // top : obj_top - (event.target.scaleY * event.target.height / 2) - (event.target.strokeWidth/2),
          top : event.target.top + obj_top - target_bottom
        })
        event.target.setCoords();
      }
      //bottom
      if(Math.abs(obj_bottom - target_top) < 10){
        event.target.set({
          // top : obj.getPointByOrigin('left', 'bottom').y + (event.target.scaleY * event.target.height / 2) + (event.target.strokeWidth/2)
          // top : obj_bottom + (event.target.scaleY * event.target.height / 2) + (event.target.strokeWidth/2)
          top : event.target.top + obj_bottom - target_top
        })
        event.target.setCoords();
      }
    })
  }

  /**
   * On/Off snapObjectMovingEvent
   * @param {{target : input[type=checkbox]}} event 
   */
  onClickObjectSnap = (event) => {
    const canvas = this.getCanvas();
    if(event.target.checked){
      canvas.on("object:moving", this.snapObjectMovingEvent);
    }
    else{
      canvas.off("object:moving", this.snapObjectMovingEvent);
    }
  }
}
  
export default Snap;