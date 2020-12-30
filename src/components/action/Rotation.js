import Action from './Action';

class Rotation extends Action {
  constructor(App) {
    super('Rotation', App);
    // console.log(this.canvas);
  }

  getCurrentAngle() {
    // console.log('active',this.getActiveObject().angle);
    if (this.getActiveObject()) {
      return this.getActiveObject().angle;
    }
    else {
      return null;
    }
  }


  setAngle(angle) {
    angle %= 360
    // const oldAngle = this.getCurrentAngle() % 360;
    // const angleDiff = oldAngle - angle;
    const activeImage = this.getActiveObject();
    const canvas = this.getCanvas();
    // console.log(activeImage);
    // const oldImageCenter = activeImage.getCenterPoint();

    activeImage.set({
      angle: angle,
    });
    canvas.renderAll();

    

  }
}

export default Rotation;