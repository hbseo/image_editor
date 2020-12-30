import Action from './Action';

class Fill extends Action {
  constructor(App) {
    super('Fill', App);
  }
  fill = (color) => {
    const activeObject = this.getActiveObject();
    const canvas = this.getCanvas();

    activeObject.set({
      fill : color
    })

    canvas.renderAll();
  }
}

export default Fill;
