import Action from './Action';
import ResizeHelper from '../helper/Resize';
class Rotation extends Action {
  constructor(App) {
    super('Rotation', App);
  }

  changeAngle(angle) {
    const canvas = this.getCanvas();
    let obj = this.getActiveObject();
    if(obj){
      if(obj.type === 'Cropzone') { return; }
      obj.set({
        angle: (angle + obj.angle)% 360,
      });
      this.saveState('angle change');
      this.updateObject();
      canvas.renderAll();
    }
    else if (this.getBackgroundImage() && ( angle % 90 === 0)){
      let img = this.getBackgroundImage()
      img.set({
        angle: (angle + img.angle)% 360,
      });
      ResizeHelper.exchangeBackgroundSize(canvas, angle);
      this.saveState('angle change');
      this.updateObject();
      canvas.renderAll();
    }
  }

  setAngle(angle) {
    const canvas = this.getCanvas();
    let obj = this.getActiveObject();
    if(obj){
      if(obj.type === 'Cropzone') { return; }
      obj.set({
        angle: angle % 360,
      });
      this.saveState('angle set');
      this.updateObject();
      canvas.renderAll();
    }
    else if (this.getBackgroundImage() && ( angle % 90 === 0)){
      let img = this.getBackgroundImage()
      img.set({
        angle: angle % 360,
      });
      ResizeHelper.exchangeBackgroundSize(canvas, angle);
      this.saveState('angle set');
      this.updateObject();
      canvas.renderAll();

    }
  }
}

export default Rotation;