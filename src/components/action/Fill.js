import Action from './Action';

class Fill extends Action {
  constructor(App) {
    super('Fill', App);
  }
  fill = (color) => {
    const activeObject = this.getActiveObject();
    const canvas = this.getCanvas();
    if(activeObject){
      activeObject.set({
        fill : color
      })
      this.saveState('Fill ', activeObject.type);
      canvas.renderAll();
    }

  }
}

export default Fill;
