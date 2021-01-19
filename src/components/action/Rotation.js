import Action from './Action';

class Rotation extends Action {
  constructor(App) {
    super('Rotation', App);
  }

  changeAngle(angle) {
    const canvas = this.getCanvas();
    let obj = this.getActiveObject();
    if(obj){
      obj.set({
        angle: (angle + obj.angle)% 360,
      });
      this.getImageEditor().saveState('angle change');
      canvas.renderAll();
    }
  }

  setAngle(angle) {
    const canvas = this.getCanvas();
    let obj = this.getActiveObject();
    if(obj){
      obj.set({
        angle: angle % 360,
      });
      this.getImageEditor().saveState('angle set');
      canvas.renderAll();
    }
  }
}

export default Rotation;