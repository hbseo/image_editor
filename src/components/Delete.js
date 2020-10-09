import Action from './Action';

class Delete extends Action {
  constructor(App) {
    super('Delete', App);
  }

  deleteObj = () => {
    let canvas = this.getCanvas();
    let obj = canvas.getActiveObject();
    if (obj) {
      canvas.remove(obj);
    }
    canvas.renderAll();
  }

}

export default Delete;

