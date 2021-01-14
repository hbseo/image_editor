import Action from './Action';

class Rotation extends Action {
  constructor(App) {
    super('Rotation', App);
  }

  getCurrentAngle() {
    if (this.getActiveObject()) {
      return this.getActiveObject().angle;
    }
    else {
      return null;
    }
  }


  setAngle(obj, angle) {
    const canvas = this.getCanvas();
    if(obj){
      obj.set({
        angle: angle % 360,
      });
      this.getImageEditor().saveState('angle change');
      canvas.renderAll();

    }
  }
}

export default Rotation;